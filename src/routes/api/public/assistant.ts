import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { GatewayError, streamResponse } from "@lovable.dev/ai-gateway";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { assistantKnowledge, assistantRules } from "@/lib/assistant-knowledge";

export const Route = createFileRoute("/api/public/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["SUPABASE_URL"],
          key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return Response.json({ error: "Serviço indisponível." }, { status: 503 });
        const bearer = request.headers.get("authorization");
        if (!bearer?.startsWith("Bearer "))
          return Response.json({ error: "Entre na sua conta para conversar." }, { status: 401 });
        const client = createClient<Database>(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: bearer } },
        });
        const { data: auth, error: authError } = await client.auth.getUser(bearer.slice(7));
        if (authError || !auth.user)
          return Response.json({ error: "Entre na sua conta para conversar." }, { status: 401 });
        const parsed = z
          .object({ text: z.string().trim().min(1), id: z.string().uuid() })
          .safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Mensagem inválida." }, { status: 400 });
        const userId = auth.user.id;
        const { error: insertError } = await client
          .from("assistant_messages")
          .insert({
            user_id: userId,
            message_id: parsed.data.id,
            role: "user",
            parts: [{ type: "text", text: parsed.data.text }],
          });
        if (insertError)
          return Response.json(
            { error: "Não foi possível salvar a mensagem. Não reenvie automaticamente." },
            { status: 409 },
          );
        const history: { role: "user" | "assistant"; content: string }[] = [];
        for (let offset = 0; ; offset += 1000) {
          const { data, error } = await client
            .from("assistant_messages")
            .select("role,parts")
            .eq("user_id", userId)
            .order("created_at")
            .order("id")
            .range(offset, offset + 999);
          if (error)
            return Response.json({ error: "Não foi possível ler o histórico." }, { status: 500 });
          for (const row of data) {
            const parts = z
              .array(z.object({ type: z.literal("text"), text: z.string() }))
              .safeParse(row.parts);
            if (parts.success && (row.role === "user" || row.role === "assistant"))
              history.push({ role: row.role, content: parts.data.map((p) => p.text).join("\n") });
          }
          if (data.length < 1000) break;
        }
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const emit = (event: object) =>
              controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
            let text = "";
            const id = crypto.randomUUID();
            try {
              const result = await streamResponse(
                {
                  model: "openai/gpt-6-astra",
                  instructions:
                    assistantRules +
                    "\nInformações confirmadas:\n" +
                    JSON.stringify(assistantKnowledge()),
                  input: history,
                },
                { signal: request.signal },
              );
              let completed = false;
              for await (const event of result) {
                if (
                  event.type === "response.output_text.delta" ||
                  event.type === "response.refusal.delta"
                ) {
                  text += event.delta;
                  emit({ type: "delta", text: event.delta, id });
                }
                if (event.type === "response.completed") completed = true;
                if (event.type === "response.incomplete") throw new Error("Incomplete answer");
              }
              if (!completed || !text) throw new Error("Missing completed answer");
              const { error } = await client
                .from("assistant_messages")
                .insert({
                  user_id: userId,
                  message_id: id,
                  role: "assistant",
                  parts: [{ type: "text", text }],
                });
              if (error) throw new Error("Could not save assistant answer");
              emit({ type: "done", id });
            } catch (error) {
              if (error instanceof GatewayError)
                console.error("Assistant Gateway failure", error.code, error.ids);
              else console.error("Assistant failure", error);
              emit({
                type: "error",
                message:
                  error instanceof GatewayError && error.httpStatus === 402
                    ? "O assistente está sem créditos. Fale com Emyli pelo Instagram."
                    : "Não foi possível concluir e salvar a resposta. Sua pergunta foi preservada; fale com Emyli pelo Instagram.",
              });
            } finally {
              controller.close();
            }
          },
        });
        return new Response(stream, {
          headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" },
        });
      },
    },
  },
});

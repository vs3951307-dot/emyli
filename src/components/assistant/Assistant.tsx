import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import type { UIMessage, ChatStatus } from "ai";
import { z } from "zod";
import { Instagram, LogOut, MessageCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AccountForm } from "./AccountForm";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/config/site";
import { loadConversation, clearConversation } from "@/lib/assistant.functions";

export function Assistant({ userId }: { userId: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Abrir assistente de dúvidas"
          className="fixed bottom-4 left-4 z-40 h-12 gap-2 rounded-full px-4 shadow-lg"
        >
          <MessageCircle aria-hidden="true" />
          <span className="text-sm">Dúvidas?</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="assistant-panel flex h-[min(740px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-md flex-col gap-0 overflow-hidden rounded-lg p-0">
        <header className="border-b border-border p-5 pr-12">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl italic" aria-hidden="true">
              Eg.
            </span>
            <div className="min-w-0">
              <DialogTitle className="font-sans text-base">Assistente Emyli Giseli</DialogTitle>
              <DialogDescription className="text-xs">
                Atendimento virtual · Estética & Sobrancelhas
              </DialogDescription>
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {userId ? <Chat key={userId} userId={userId} /> : <AccountForm />}
        </div>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 border-t border-border py-3 text-sm text-muted-foreground"
        >
          <Instagram size={16} />
          Conversar com Emyli no Instagram
        </a>
      </DialogContent>
    </Dialog>
  );
}

function Chat({ userId }: { userId: string }) {
  const load = useServerFn(loadConversation),
    clear = useServerFn(clearConversation);
  const history = useQuery({ queryKey: ["assistant", userId], queryFn: () => load() });
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const abort = useRef<AbortController | null>(null);
  const form = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const focus = () => form.current?.querySelector("textarea")?.focus();
  useEffect(() => {
    if (!history.data) return;
    const restored: UIMessage[] = [];
    for (const row of history.data) {
      const parts = z
        .array(z.object({ type: z.literal("text"), text: z.string() }))
        .safeParse(row.parts);
      if (parts.success && (row.role === "user" || row.role === "assistant"))
        restored.push({ id: row.message_id, role: row.role, parts: parts.data });
    }
    setMessages(restored);
  }, [history.data]);
  useEffect(() => {
    focus();
    return () => abort.current?.abort();
  }, []);
  async function send(text: string) {
    if (!text.trim() || sending.current || history.isPending || history.isError) return;
    sending.current = true;
    setError("");
    setStatus("submitted");
    setDraft("");
    focus();
    const id = crypto.randomUUID();
    setMessages((previous) => [...previous, { id, role: "user", parts: [{ type: "text", text }] }]);
    abort.current = new AbortController();
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error("Entre novamente na sua conta.");
      const response = await fetch("/api/public/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ id, text }),
        signal: abort.current.signal,
      });
      if (!response.ok || !response.body) {
        const body = await response.json();
        throw new Error(body.error || "Não foi possível responder.");
      }
      const reader = response.body.getReader(),
        decoder = new TextDecoder();
      let buffer = "",
        complete = false;
      const schema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("delta"), text: z.string(), id: z.string() }),
        z.object({ type: z.literal("done"), id: z.string() }),
        z.object({ type: z.literal("error"), message: z.string() }),
      ]);
      while (true) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        let end;
        while ((end = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, end);
          buffer = buffer.slice(end + 1);
          if (!line) continue;
          const event = schema.parse(JSON.parse(line));
          if (event.type === "error") throw new Error(event.message);
          if (event.type === "done") complete = true;
          if (event.type === "delta") {
            setStatus("streaming");
            setMessages((previous) => {
              const found = previous.find((m) => m.id === event.id);
              if (!found)
                return [
                  ...previous,
                  { id: event.id, role: "assistant", parts: [{ type: "text", text: event.text }] },
                ];
              return previous.map((m) =>
                m.id === event.id
                  ? {
                      ...m,
                      parts: [
                        {
                          type: "text",
                          text:
                            m.parts.map((p) => (p.type === "text" ? p.text : "")).join("") +
                            event.text,
                        },
                      ],
                    }
                  : m,
              );
            });
          }
        }
        if (chunk.done) break;
      }
      if (!complete) throw new Error("A resposta foi interrompida e pode não ter sido salva.");
      setStatus("ready");
    } catch (failure) {
      setStatus("error");
      setError(
        failure instanceof Error && failure.name === "AbortError"
          ? "Resposta interrompida. A pergunta pode já ter sido salva."
          : failure instanceof Error
            ? failure.message
            : "Não foi possível responder.",
      );
    } finally {
      sending.current = false;
      abort.current = null;
      focus();
    }
  }
  const busy = status === "submitted" || status === "streaming";
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 justify-end gap-1 border-b border-border px-3 py-1">
        <Button
          variant="ghost"
          size="icon"
          title="Apagar histórico"
          aria-label="Apagar histórico"
          disabled={busy}
          onClick={async () => {
            if (!window.confirm("Apagar toda a conversa da sua conta?")) return;
            try {
              await clear();
              setMessages([]);
              setError("");
            } catch {
              setError("Não foi possível apagar o histórico.");
            }
          }}
        >
          <Trash2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Sair da conta"
          aria-label="Sair da conta"
          disabled={busy}
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) setError("Não foi possível sair.");
          }}
        >
          <LogOut />
        </Button>
      </div>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-5 p-5">
          {history.isPending ? (
            <Shimmer>Carregando conversa…</Shimmer>
          ) : history.isError ? (
            <p role="alert">
              Não foi possível carregar sua conversa.
              <Button variant="link" onClick={() => history.refetch()}>
                Tentar novamente
              </Button>
            </p>
          ) : messages.length === 0 ? (
            <Message from="assistant">
              <MessageContent>
                <MessageResponse>
                  Olá! Sou a assistente virtual da Emyli. Qual serviço você gostaria de conhecer
                  melhor?
                </MessageResponse>
              </MessageContent>
            </Message>
          ) : null}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent
                className={
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-transparent"
                }
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Preparando sua resposta…</Shimmer>}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div ref={form} className="shrink-0 border-t border-border p-3">
        <PromptInput onSubmit={({ text }) => send(text)}>
          <PromptInputTextarea
            aria-label="Sua dúvida"
            placeholder="Qual é a sua dúvida?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              aria-label={busy ? "Parar resposta" : "Enviar pergunta"}
              status={status}
              disabled={!busy && (!draft.trim() || history.isPending || history.isError)}
              onStop={() => abort.current?.abort()}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

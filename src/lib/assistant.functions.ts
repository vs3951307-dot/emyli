import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const loadConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const rows = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await context.supabase
        .from("assistant_messages")
        .select("message_id,role,parts")
        .eq("user_id", context.userId)
        .order("created_at")
        .order("id")
        .range(offset, offset + 999);
      if (error) throw new Error("Não foi possível carregar sua conversa.");
      rows.push(...data);
      if (data.length < 1000) break;
    }
    return rows;
  });
export const clearConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("assistant_messages")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error("Não foi possível apagar sua conversa.");
    return { ok: true };
  });

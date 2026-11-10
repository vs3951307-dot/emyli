import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha | Emyli Giseli" },
      {
        name: "description",
        content: "Recupere o acesso à sua conversa com a assistente de Emyli Giseli.",
      },
      { property: "og:title", content: "Nova senha | Emyli Giseli" },
      { property: "og:description", content: "Recuperação segura da sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});
function Reset() {
  const [recovery, setRecovery] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    setRecovery(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery");
  }, []);
  return (
    <main className="mx-auto max-w-md px-5 py-24">
      <Link to="/">← Voltar ao site</Link>
      <h1 className="mt-8 text-4xl">Nova senha</h1>
      {recovery ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const password = String(new FormData(e.currentTarget).get("password"));
            const { error } = await supabase.auth.updateUser({ password });
            setNotice(
              error
                ? "Não foi possível atualizar. Solicite um novo link."
                : "Senha atualizada. Você já pode voltar ao site.",
            );
          }}
        >
          <label className="block">
            Nova senha
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          <Button>Salvar senha</Button>
        </form>
      ) : (
        <p className="mt-6">Abra o link de recuperação recebido no seu email.</p>
      )}
      <p role="status" className="mt-4">
        {notice}
      </p>
    </main>
  );
}

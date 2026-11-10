import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@lovable.dev/cloud-auth-js/styles.css";

export function AccountForm() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    setNotice("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) setNotice("Não foi possível entrar. Tente novamente.");
    } catch {
      setNotice("Não foi possível entrar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-4 p-5">
      <p className="font-display text-3xl">Sua conversa, com cuidado.</p>
      <p className="text-sm text-muted-foreground">
        Entre para manter seu histórico privado na conta.
      </p>
      <Button
        variant="outline"
        className="google-auth w-full h-11"
        disabled={busy}
        onClick={() => social("google")}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
          />
        </svg>
        Continuar com Google
      </Button>
      <Button
        className="lovable-auth-button w-full"
        disabled={busy}
        onClick={() => social("lovable")}
      >
        Continue with Lovable
      </Button>
      <form
        className="space-y-3 border-t border-border pt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setNotice("");
          const form = new FormData(e.currentTarget),
            email = String(form.get("email")),
            password = String(form.get("password"));
          try {
            const result =
              mode === "signup"
                ? await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: window.location.origin },
                  })
                : mode === "reset"
                  ? await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    })
                  : await supabase.auth.signInWithPassword({ email, password });
            if (result.error)
              setNotice(
                mode === "login"
                  ? "Confira email e senha e tente novamente."
                  : "Não foi possível concluir. Tente novamente.",
              );
            else if (mode !== "login")
              setNotice(
                mode === "signup"
                  ? "Confira seu email para confirmar a conta antes de entrar."
                  : "Se houver uma conta para este email, você receberá o link de recuperação.",
              );
          } catch {
            setNotice("Não foi possível conectar. Tente novamente.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm">
          Email
          <Input name="email" type="email" autoComplete="email" required className="mt-1" />
        </label>
        {mode !== "reset" && (
          <label className="block text-sm">
            Senha
            <Input
              name="password"
              type="password"
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              className="mt-1"
            />
          </label>
        )}
        <Button className="w-full" disabled={busy}>
          {mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
        </Button>
      </form>
      <div className="flex justify-between gap-2">
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setNotice("");
          }}
        >
          {mode === "signup" ? "Já tenho conta" : "Criar conta"}
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setMode(mode === "reset" ? "login" : "reset");
            setNotice("");
          }}
        >
          {mode === "reset" ? "Voltar" : "Esqueci a senha"}
        </Button>
      </div>
      {notice && (
        <p role="status" className="text-sm text-muted-foreground">
          {notice}
        </p>
      )}
    </div>
  );
}

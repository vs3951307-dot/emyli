import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { gallery } from "@/content/gallery";
import { publishedServices } from "@/content/services";
import { editorDb, photoBucket, photoUrl, useSiteGallery, useSiteSettings, type SiteSettings } from "@/lib/site-editor";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração | Emyli Giseli" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Admin,
});

function Admin() {
  const [userId, setUserId] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alt, setAlt] = useState("");
  const [serviceId, setServiceId] = useState(publishedServices[0]?.id ?? "design-sobrancelhas");
  const [consent, setConsent] = useState(false);
  const queryClient = useQueryClient();
  const { data: settings, error: settingsError } = useSiteSettings();
  const { data: uploads, error: galleryError } = useSiteGallery();

  useEffect(() => {
    let active = true;
    async function check() {
      const { data: auth } = await supabase.auth.getUser();
      if (!active) return;
      const id = auth.user?.id ?? null;
      setUserId(id);
      if (id) {
        const { data, error } = await editorDb.from("site_admins").select("user_id").eq("user_id", id).maybeSingle();
        if (!active) return;
        setAllowed(!error && Boolean(data));
      } else setAllowed(false);
      setLoading(false);
    }
    void check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void check(); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function perform(action: () => Promise<void>) {
    setBusy(true);
    setNotice("");
    try {
      await action();
      setNotice("Alterações salvas.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["site-settings"] }),
        queryClient.invalidateQueries({ queryKey: ["site-gallery"] }),
      ]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar. Tente novamente.");
    } finally { setBusy(false); }
  }

  async function saveSettings(changes: Partial<SiteSettings>) {
    const { error } = await editorDb.from("site_settings").update(changes).eq("id", 1);
    if (error) throw error;
  }

  async function upload(file: File, folder: string) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024 || file.size === 0)
      throw new Error("Escolha uma imagem JPG, PNG ou WebP de até 5 MB.");
    const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await editorDb.storage.from(photoBucket).upload(path, file, { contentType: file.type });
    if (error) throw error;
    return path;
  }

  async function uploadSlot(file: File | undefined, slot: "hero_path" | "portrait_path") {
    if (!file) return;
    await perform(async () => {
      const path = await upload(file, slot === "hero_path" ? "cover" : "portrait");
      try { await saveSettings({ [slot]: path }); }
      catch (error) { await editorDb.storage.from(photoBucket).remove([path]); throw error; }
      const oldPath = settings?.[slot];
      if (oldPath) await editorDb.storage.from(photoBucket).remove([oldPath]);
    });
  }

  async function addGallery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = (new FormData(form).get("photo") as File | null);
    if (!file?.size || !consent || alt.trim().length < 3) {
      setNotice("Selecione uma foto autorizada e descreva seu conteúdo.");
      return;
    }
    await perform(async () => {
      const path = await upload(file, "gallery");
      const { error } = await editorDb.from("site_gallery").insert({ path, alt: alt.trim(), service_id: serviceId, authorized: true });
      if (error) { await editorDb.storage.from(photoBucket).remove([path]); throw error; }
      form.reset(); setAlt(""); setConsent(false);
    });
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-5 py-10 text-foreground">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl">Painel da Emyli</h1>
        <Link to="/" className="underline">Ver site</Link>
      </div>
      {loading ? <p>Verificando acesso...</p> : !userId ? (
        <form className="max-w-sm space-y-4 rounded-lg border border-border p-5" onSubmit={async (event) => {
          event.preventDefault(); setBusy(true); setNotice("");
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) setNotice("Confira email e senha e tente novamente.");
          setBusy(false);
        }}>
          <h2 className="text-2xl">Entrar como proprietária</h2>
          <label className="block">Email<input required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border border-input bg-background p-3" /></label>
          <label className="block">Senha<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border border-input bg-background p-3" /></label>
          <button disabled={busy} className="btn btn-primary">Entrar</button>
        </form>
      ) : !allowed ? (
        <div className="space-y-4"><p>Esta conta não tem permissão para administrar o site.</p>
          <button className="btn btn-ghost" onClick={() => void supabase.auth.signOut()}>Sair e entrar com outra conta</button></div>
      ) : (
        <div className="space-y-10">
          <button className="btn btn-ghost" onClick={() => void supabase.auth.signOut()}>Sair</button>
          {(settingsError || galleryError) && <p role="alert">Não foi possível carregar os dados. Confira se a migração SQL foi aplicada no Supabase.</p>}
          {settings && <>
            <section className="space-y-4 rounded-lg border border-border p-5">
              <h2 className="text-3xl">Tema do site</h2>
              <label className="block">Paleta de cores
                <select value={settings.theme} disabled={busy} onChange={(event) => void perform(() => saveSettings({ theme: event.target.value as SiteSettings["theme"] }))} className="mt-2 block w-full max-w-sm rounded border border-input bg-background p-3">
                  <option value="classic">Clássico — dourado</option><option value="rose">Rosa</option><option value="sage">Verde sálvia</option>
                </select>
              </label>
            </section>
            <section className="space-y-6 rounded-lg border border-border p-5">
              <h2 className="text-3xl">Fotos principais</h2>
              {([ ["hero_path", "Foto da capa"], ["portrait_path", "Foto da seção Sobre"] ] as const).map(([slot, label]) => (
                <div key={slot} className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-2xl">{label}</h3>
                  {settings[slot] && <img src={photoUrl(settings[slot])!} alt={label} className="h-36 w-36 rounded object-cover" />}
                  <input aria-label={`Enviar ${label}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; void uploadSlot(file, slot); event.target.value = ""; }} />
                  {settings[slot] && <button disabled={busy} className="btn btn-ghost" onClick={() => void perform(async () => { const old = settings[slot]!; await saveSettings({ [slot]: null }); await editorDb.storage.from(photoBucket).remove([old]); })}>Remover e usar foto original</button>}
                </div>
              ))}
            </section>
            <section className="space-y-5 rounded-lg border border-border p-5">
              <h2 className="text-3xl">Galeria de resultados</h2>
              <p>Publique apenas fotos com autorização da pessoa retratada.</p>
              <form onSubmit={(event) => void addGallery(event)} className="grid max-w-lg gap-3">
                <label>Foto<input name="photo" type="file" required accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full" /></label>
                <label>Descrição da foto<input required minLength={3} maxLength={200} value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-1 block w-full rounded border border-input bg-background p-3" /></label>
                <label>Serviço<select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="mt-1 block w-full rounded border border-input bg-background p-3">{publishedServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> Confirmo a autorização para publicar esta foto</label>
                <button disabled={busy} className="btn btn-primary">Adicionar foto</button>
              </form>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((photo) => {
                  const hidden = settings.hidden_gallery_ids.includes(photo.id);
                  return <div key={photo.id} className="space-y-2 rounded border border-border p-3">
                    <img src={photo.after.src} alt={photo.after.alt} className="h-40 w-full object-cover" />
                    <p className="text-sm">{photo.after.alt} {hidden && "(oculta)"}</p>
                    <button disabled={busy} className="btn btn-ghost" onClick={() => void perform(() => saveSettings({ hidden_gallery_ids: hidden ? settings.hidden_gallery_ids.filter((id) => id !== photo.id) : [...settings.hidden_gallery_ids, photo.id] }))}>{hidden ? "Restaurar" : "Excluir do site"}</button>
                  </div>;
                })}
                {uploads?.map((photo) => <div key={photo.id} className="space-y-2 rounded border border-border p-3">
                  <img src={photoUrl(photo.path)!} alt={photo.alt} className="h-40 w-full object-cover" />
                  <p className="text-sm">{photo.alt}</p>
                  <button disabled={busy} className="btn btn-ghost" onClick={() => {
                    if (!window.confirm("Excluir esta foto permanentemente?")) return;
                    void perform(async () => {
                      const { error } = await editorDb.from("site_gallery").delete().eq("id", photo.id);
                      if (error) throw error;
                      const removed = await editorDb.storage.from(photoBucket).remove([photo.path]);
                      if (removed.error) throw removed.error;
                    });
                  }}>Excluir foto</button>
                </div>)}
              </div>
            </section>
          </>}
        </div>
      )}
      {notice && <p role="status" className="rounded border border-border p-3">{notice}</p>}
    </main>
  );
}

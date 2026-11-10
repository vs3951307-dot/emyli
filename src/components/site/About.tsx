import { portrait } from "@/content/gallery";
import { siteConfig } from "@/config/site";
import { photoUrl, useSiteSettings } from "@/lib/site-editor";

export function About() {
  const { data: settings } = useSiteSettings();
  const displayedPortrait = photoUrl(settings?.portrait_path) ?? portrait?.src;
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-border">
          {displayedPortrait ? (
            <img src={displayedPortrait} alt={portrait?.alt ?? "Foto de Emyli Giseli"} width={portrait?.width ?? 1024} height={portrait?.height ?? 1280} loading="lazy" className="img-reveal h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" aria-hidden="true" style={{ background: "radial-gradient(80% 60% at 30% 20%, var(--ivory), transparent), var(--gradient-satin)" }}>
              <span className="absolute bottom-6 left-6 font-display text-7xl italic text-graphite/80">EG</span>
            </div>
          )}
        </div>
        <div className="reveal max-w-xl">
          <p className="eyebrow text-taupe-deep">Sobre</p>
          <h2 id="sobre-title" className="mt-4 text-5xl leading-none md:text-7xl">Beleza com um<br /><em>toque pessoal.</em></h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Sou {siteConfig.brandName}, designer de sobrancelhas em {siteConfig.city}-{siteConfig.stateCode}.
              Gosto de fazer outras mulheres se sentirem lindas — e acredito que isso começa pelo olhar.
            </p>
            <p>Cada atendimento é pensado com atenção, conversa e carinho, para valorizar o que já é seu.</p>
          </div>
          <p className="mt-10 font-display text-3xl italic">{siteConfig.brandName}</p>
        </div>
      </div>
    </section>
  );
}

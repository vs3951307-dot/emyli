import { useState } from "react";
import { useSiteGallery, useSiteSettings, visibleGallery } from "@/lib/site-editor";
import { publishedServices } from "@/content/services";
import { siteConfig } from "@/config/site";
import { BeforeAfter } from "@/components/gallery/BeforeAfter";
import { Button } from "@/components/ui/button";
import { resultVideos } from "@/content/videos";
import { ResultVideo } from "@/components/gallery/ResultVideo";

export function Results() {
  const { data: settings } = useSiteSettings();
  const { data: uploaded } = useSiteGallery();
  const gallery = visibleGallery(settings, uploaded);
  const available = publishedServices.filter((s) => gallery.some((g) => g.serviceId === s.id));
  const [filter, setFilter] = useState<string>("all");
  const items = gallery.filter((g) => g.authorized && (filter === "all" || g.serviceId === filter));

  return (
    <section id="resultados" aria-labelledby="resultados-title" className="theme-dark relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className="eyebrow text-champagne">Resultados</p>
          <h2 id="resultados-title" className="mt-4 text-5xl leading-none md:text-7xl">Cada olhar,<br /><em className="text-champagne">uma história.</em></h2>
        </div>

        {gallery.length === 0 ? (
          <div className="reveal relative mt-16 grid min-h-[22rem] place-items-center overflow-hidden rounded-3xl border border-border p-10 text-center">
            <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--champagne) 18%, transparent), transparent)" }} />
            <div className="relative">
              <div className="mx-auto h-16 w-16 rounded-full border border-champagne-deep/50" aria-hidden="true" />
              <p className="mt-8 font-display text-4xl md:text-5xl">Em breve, resultados por aqui.</p>
              <p className="mx-auto mt-4 max-w-sm text-muted-foreground">Enquanto isso, acompanhe as novidades no Instagram.</p>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8">{siteConfig.instagramHandle}</a>
            </div>
          </div>
        ) : (
          <>
            {available.length > 1 && (
              <div role="group" aria-label="Filtrar por serviço" className="mt-10 flex flex-wrap gap-2">
                {[{ id: "all", name: "Todos" }, ...available].map((s) => (
                  <Button variant="ghost" key={s.id} type="button" aria-pressed={filter === s.id} onClick={() => setFilter(s.id)}
                    className="btn btn-ghost !min-h-11 aria-pressed:bg-champagne aria-pressed:text-graphite">{s.name}</Button>
                ))}
              </div>
            )}
            <ul key={filter} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g, i) => (
                <li key={g.id} className="rise" style={{ animationDelay: `${i * 90}ms` }}>
                  {g.before ? (
                    <BeforeAfter before={g.before} after={g.after} label={g.after.alt} />
                  ) : (
                    <figure className="group relative overflow-hidden rounded-lg">
                      <img src={g.after.src} alt={g.after.alt} width={g.after.width} height={g.after.height} loading="lazy" style={{ aspectRatio: `${g.after.width} / ${g.after.height}` }} className="h-auto w-full object-contain transition-[filter] duration-700 group-hover:brightness-105" />
                      <figcaption className="border-t border-border py-4 text-xs font-semibold text-champagne">
                        {publishedServices.find((s) => s.id === g.serviceId)?.name}
                      </figcaption>
                    </figure>
                  )}
                </li>
              ))}
              <li className="rise" style={{ animationDelay: `${items.length * 90}ms` }}>
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="group flex aspect-[3/4] h-full flex-col justify-between rounded-lg border border-border bg-graphite-soft p-8 text-ivory transition-transform duration-700 hover:-translate-y-1">
                  <span className="eyebrow text-champagne">Mais no Instagram</span>
                  <span className="font-display text-4xl leading-tight md:text-5xl">Veja outros<br /><em className="text-champagne">atendimentos</em></span>
                  <span className="flex items-center justify-between text-sm">{siteConfig.instagramHandle}<span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">→</span></span>
                </a>
              </li>
            </ul>
          </>
        )}
        <div className="mt-16 border-t border-border pt-10">
          <h3 className="text-4xl md:text-5xl">Em movimento</h3>
          <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-[minmax(0,1fr)] items-start gap-8 sm:grid-cols-2 sm:gap-6 lg:mx-0">
            {resultVideos.map((video) => (
              <li key={video.id} className="min-w-0"><ResultVideo {...video} /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

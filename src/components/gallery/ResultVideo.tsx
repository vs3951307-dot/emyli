import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResultVideo({ title, src, poster }: { title: string; src: string; poster: string }) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!started) return;
    const video = ref.current;
    if (!video) return;
    video.focus();
    void video.play().catch(() => {
      // Native controls remain available if the browser blocks playback.
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) video.pause();
    }, { threshold: 0.1 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [started]);

  return (
    <figure className="result-video mx-auto min-w-0">
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-border bg-graphite-soft">
        {started ? (
          <video
            ref={ref}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="none"
            tabIndex={0}
            aria-label={title}
            className="absolute inset-0 h-full w-full object-contain"
            onError={() => setError(true)}
            onPlay={(event) => {
              document.querySelectorAll("video").forEach((video) => {
                if (video !== event.currentTarget) video.pause();
              });
            }}
          />
        ) : (
          <Button variant="ghost" className="group absolute inset-0 h-full w-full rounded-none p-0" aria-label={`Reproduzir vídeo: ${title}`} onClick={() => setStarted(true)}>
            <img src={poster} alt="" loading="lazy" width={480} height={854} className="h-full w-full object-contain" />
            <span className="absolute inset-0 flex items-center justify-center bg-graphite/20 transition-colors group-hover:bg-graphite/35">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-champagne/60 bg-graphite/80 text-champagne"><Play aria-hidden="true" className="!h-6 !w-6" /></span>
            </span>
          </Button>
        )}
      </div>
      <figcaption className="min-w-0 break-words border-b border-border py-4 text-sm text-champagne">{title}</figcaption>
      {error && <p role="alert" className="mt-3 text-sm text-muted-foreground">Não foi possível carregar o vídeo. <a className="underline" href={src} target="_blank" rel="noopener noreferrer">Abrir vídeo</a></p>}
    </figure>
  );
}
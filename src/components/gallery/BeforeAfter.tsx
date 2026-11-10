import { useState } from "react";
import type { GalleryImage } from "@/content/gallery";

/** Comparador acessível (input range nativo: mouse, toque e teclado). Use só com par real do mesmo atendimento. */
export function BeforeAfter({ before, after, label }: { before: GalleryImage; after: GalleryImage; label: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: `${after.width}/${after.height}` }}>
      <img src={after.src} alt={after.alt} width={after.width} height={after.height} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <img src={before.src} alt={before.alt} width={before.width} height={before.height} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="pointer-events-none absolute inset-y-0 w-px bg-ivory" style={{ left: `${pos}%` }} />
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar antes e depois: ${label}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

import { useEffect, useRef } from "react";
import capa from "@/assets/emyli-capa.jpg";
import { photoUrl, useSiteSettings } from "@/lib/site-editor";

/** Foto de capa com camadas futuristas que reagem ao mouse em telas grandes. */
export function Sculpture() {
  const { data: settings } = useSiteSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
        el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hero-photo absolute inset-0 overflow-hidden">
        <img
          src={photoUrl(settings?.hero_path) ?? capa}
          alt="Emyli Giseli, designer de sobrancelhas"
          width={1184}
          height={1584}
          fetchPriority="high"
          className="hero-portrait h-full w-full object-cover"
        />
        <div className="hero-shade pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}

import { Sparkle } from "lucide-react";
import { publishedServices } from "@/content/services";
import { siteConfig } from "@/config/site";

export function Marquee() {
  const words = [...publishedServices.map((s) => s.name), `${siteConfig.city} · ${siteConfig.stateCode}`, "Cuidado pessoal"];
  const row = [...words, ...words];
  return (
    <div className="marquee overflow-hidden border-y border-border bg-graphite py-5 text-ivory" aria-hidden="true">
      <div className="marquee-track flex items-center gap-10">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-3xl italic md:text-4xl">
            {w}<Sparkle size={16} className="text-champagne" />
          </span>
        ))}
      </div>
    </div>
  );
}

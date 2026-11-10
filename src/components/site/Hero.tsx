import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/components/booking/BookingProvider";
import { Sculpture } from "./Sculpture";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { requestBooking } = useBooking();
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="theme-dark premium-hero relative isolate overflow-hidden"
    >
      <Sculpture />
      <div className="hero-content mx-auto flex max-w-7xl items-end px-6 pb-14 pt-28 md:px-10 md:pb-16 lg:items-center">
        <div className="relative z-10 w-full max-w-xl">
          <p className="eyebrow rise flex items-center gap-3 text-champagne">
            <span className="h-px w-10 bg-champagne" /> {siteConfig.city} · {siteConfig.stateCode}
          </p>
          <h1
            id="hero-title"
            className="hero-heading rise mt-5 leading-[0.95]"
          >
            Emyli <em className="text-champagne">Giseli</em>
          </h1>
          <p className="rise mt-4 font-display text-3xl leading-tight md:text-4xl">Seu olhar. <em>Uma nova perspectiva.</em></p>
          <p
            className="rise mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base"
            style={{ animationDelay: "850ms" }}
          >
            Um cuidado especial para valorizar a sua beleza e a expressão do seu olhar.
          </p>
          <div
            className="rise mt-7 flex flex-wrap gap-3"
            style={{ animationDelay: "1000ms" }}
          >
            <Button
              type="button"
              className="btn btn-primary"
              onClick={(e) => requestBooking(undefined, e.currentTarget)}
            >
              Agendar meu horário <ArrowUpRight size={16} />
            </Button>
            <Button asChild variant="ghost" className="btn btn-ghost">
            <a href="#servicos">
              Explorar serviços <ArrowDown size={16} />
            </a>
            </Button>
          </div>
          <p className="rise mt-7 border-t border-border pt-4 text-xs text-muted-foreground">Design de sobrancelhas <span aria-hidden="true"> / </span> Henna <span aria-hidden="true"> / </span> Brow lamination</p>
        </div>
      </div>
      <div className="hairline absolute inset-x-0 bottom-0 opacity-40" />
    </section>
  );
}

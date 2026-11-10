import { useId, useState } from "react";
import { Instagram, MapPin, MessageCircle, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { faq } from "@/content/faq";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/components/booking/BookingProvider";
import { navItems } from "./Header";
import { Button } from "@/components/ui/button";

export function HowTo() {
  const steps = [
    "Escolha o serviço sobre o qual deseja conversar.",
    "Entre em contato pelo WhatsApp.",
    "Combine a disponibilidade diretamente com Emyli.",
  ];
  return (
    <section aria-labelledby="agendar-title" className="theme-alt py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-taupe-deep">Como agendar</p>
            <h2 id="agendar-title" className="mt-4 text-5xl leading-none md:text-6xl">Simples, <em>do seu jeito.</em></h2>
          </div>
          <p className="max-w-sm text-muted-foreground">O horário fica reservado somente após a confirmação de Emyli.</p>
        </div>
        <ol className="mt-14 grid gap-px border-y border-border bg-border md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="reveal shine bg-background p-8 transition-colors duration-500 hover:bg-card md:p-10" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="font-display text-5xl italic text-taupe-deep">0{i + 1}</span>
              <p className="mt-6 text-lg leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section aria-labelledby="faq-title" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="reveal">
          <p className="eyebrow text-taupe-deep">Dúvidas</p>
          <h2 id="faq-title" className="mt-4 text-5xl leading-none md:text-6xl">Perguntas<br /><em>frequentes</em></h2>
        </div>
        <div className="reveal divide-y divide-border border-y border-border">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <h3 key={f.q} className="font-sans text-base">
                <button
                  type="button"
                  id={`${base}-q${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`${base}-a${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium"
                >
                  {f.q}
                  <Plus aria-hidden="true" size={20} className={`shrink-0 text-taupe-deep transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} hidden={!isOpen}>
                  <p className="pb-6 pr-10 font-normal leading-relaxed text-muted-foreground animate-in fade-in">{f.a}</p>
                </div>
              </h3>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { requestBooking } = useBooking();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.city}, ${siteConfig.stateCode}, Brasil`)}`;
  return (
    <section id="contato" aria-labelledby="contato-title" className="theme-alt relative overflow-hidden py-24 md:py-36">
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <p className="eyebrow reveal text-taupe-deep">Contato</p>
        <h2 id="contato-title" className="reveal mt-4 text-5xl leading-tight md:text-7xl">Vamos conversar<br /><em className="text-satin">sobre o seu olhar?</em></h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="reveal border-t border-border py-8 sm:px-4">
            <MapPin className="text-taupe-deep" aria-hidden="true" />
            <p className="mt-6 text-xl">{siteConfig.city} — {siteConfig.state}</p>
            {siteConfig.address && <p className="mt-2 text-muted-foreground">{siteConfig.address}</p>}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm underline decoration-champagne/60 underline-offset-4 hover:decoration-champagne">
              Ver localização da cidade no mapa
            </a>
          </div>
          <div className="reveal border-t border-border py-8 sm:px-4">
            <Instagram className="text-taupe-deep" aria-hidden="true" />
            <p className="mt-6 text-xl">{siteConfig.instagramHandle}</p>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">Abrir Instagram</a>
          </div>
          <div className="reveal border-t border-border py-8 sm:px-4">
            <MessageCircle className="text-taupe-deep" aria-hidden="true" />
            <p className="mt-6 text-xl">Agendamento</p>
            {siteConfig.openingHours.length > 0 && (
              <ul className="mt-2 text-muted-foreground">
                {siteConfig.openingHours.map((h) => <li key={h.days}>{h.days}: {h.hours}</li>)}
              </ul>
            )}
            <Button type="button" className="btn btn-primary mt-6" onClick={(e) => requestBooking(undefined, e.currentTarget)}>Agendar meu horário</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="theme-alt border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-3xl italic">{siteConfig.brandName}</p>
          <p className="eyebrow mt-2 text-muted-foreground">{siteConfig.brandTagline}</p>
          <p className="mt-6 text-sm text-muted-foreground">{siteConfig.city} · {siteConfig.stateCode}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="space-y-2 text-sm">
            {navItems.map((n) => <li key={n.id}><a href={`/#${n.id}`} className="text-muted-foreground hover:text-foreground">{n.label}</a></li>)}
          </ul>
        </nav>
        <div className="space-y-2 text-sm">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground">Instagram</a>
          <Link to="/privacidade" className="block text-muted-foreground hover:text-foreground">Privacidade</Link>
        </div>
      </div>
      <div className="border-t border-border px-5 pb-24 pt-6 text-center text-xs md:pb-6 text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.brandTagline}
      </div>
    </footer>
  );
}

export function FloatingContact() {
  const { requestBooking } = useBooking();
  return (
    <button
      type="button"
      aria-label="Entrar em contato para agendar"
      onClick={(e) => requestBooking(undefined, e.currentTarget)}
      className="pulse-ring fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-13 w-13 place-items-center rounded-full border border-champagne-deep/40 bg-graphite p-3.5 text-champagne shadow-lg transition-transform duration-500 hover:-translate-y-1"
    >
      <MessageCircle size={22} aria-hidden="true" />
    </button>
  );
}

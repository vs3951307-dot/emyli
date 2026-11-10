import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/button";

export const navItems = [
  { id: "inicio", label: "Início" },
  { id: "servicos", label: "Serviços" },
  { id: "resultados", label: "Resultados" },
  { id: "sobre", label: "Sobre" },
  { id: "contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { requestBooking } = useBooking();

  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navItems.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = !scrolled || open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled && !open ? "glass shadow-sm" : ""} ${dark ? "theme-dark" : ""} ${open ? "!bg-background" : !scrolled ? "!bg-transparent" : ""}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
        <a href="#inicio" className="min-w-0 leading-none" onClick={() => setOpen(false)}>
          <span className="block truncate font-display text-2xl italic">{siteConfig.brandName}</span>
          <span className="eyebrow mt-1 block text-[0.6rem] text-muted-foreground">{siteConfig.brandTagline}</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "true" : undefined}
                  className="group relative px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground aria-[current]:text-foreground"
                >
                  {n.label}
                  <span className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-champagne-deep transition-transform duration-500 ${active === n.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" className="btn btn-primary hidden !min-h-11 sm:inline-flex" onClick={(e) => requestBooking(undefined, e.currentTarget)}>
            Agendar
          </Button>
          <Button variant="ghost" size="icon"
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-border lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <div id="scroll-progress" aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-champagne-deep" />
      <nav id="mobile-menu" aria-label="Menu mobile" hidden={!open} className="lg:hidden">
        <ul className="flex h-[calc(100dvh-5rem)] flex-col gap-1 px-5 pb-10 pt-6">
          {navItems.map((n, i) => (
            <li key={n.id} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 50}ms` }}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-border py-4 font-display text-4xl">
                <span className="eyebrow text-taupe-deep">0{i + 1}</span>{n.label}
              </a>
            </li>
          ))}
          <li className="mt-8">
            <Button type="button" className="btn btn-primary w-full" onClick={(e) => { setOpen(false); requestBooking(undefined, toggleRef.current ?? e.currentTarget); }}>
              Agendar meu horário
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

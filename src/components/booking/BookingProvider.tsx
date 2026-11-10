import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { resolveBookingUrl } from "@/lib/booking";

interface BookingCtx {
  requestBooking: (serviceName?: string, trigger?: HTMLElement | null) => void;
  isConfigured: boolean;
}

const Ctx = createContext<BookingCtx | null>(null);

export function useBooking() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBooking must be used inside BookingProvider");
  return c;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const isConfigured = resolveBookingUrl() !== null;

  const requestBooking = useCallback((serviceName?: string, trigger?: HTMLElement | null) => {
    const url = resolveBookingUrl(serviceName);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    returnFocus.current = trigger ?? (document.activeElement as HTMLElement | null);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
  }, []);

  return (
    <Ctx.Provider value={{ requestBooking, isConfigured }}>
      {children}
      {open && <SoonDialog onClose={close} />}
    </Ctx.Provider>
  );
}

function SoonDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current!;
    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>("a[href],button"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-graphite/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soon-title"
        aria-describedby="soon-desc"
        className="theme-alt relative w-full max-w-md rounded-2xl border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95"
      >
        <p className="eyebrow text-taupe-deep">Agendamento</p>
        <h2 id="soon-title" className="mt-3 text-3xl">Em breve por aqui</h2>
        <p id="soon-desc" className="mt-4 leading-relaxed text-muted-foreground">
          O agendamento pelo WhatsApp estará disponível em breve. Você pode entrar em contato pelo Instagram.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Abrir Instagram
          </a>
          <button type="button" onClick={onClose} className="btn btn-ghost">Fechar</button>
        </div>
      </div>
    </div>
  );
}

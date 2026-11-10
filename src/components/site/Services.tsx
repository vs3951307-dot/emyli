import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { publishedServices, type Service } from "@/content/services";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/button";

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow text-taupe-deep">Serviços</p>
            <h2 id="servicos-title" className="mt-4 text-5xl leading-none md:text-7xl">O cuidado <em>certo</em><br />para o seu olhar</h2>
          </div>
          <p className="reveal max-w-md text-muted-foreground lg:justify-self-end">
            Cada atendimento começa com uma conversa. A escolha do serviço e os cuidados são definidos com Emyli, de acordo com você.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {publishedServices.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 90} />)}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { requestBooking } = useBooking();
  return (
    <li className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <article className="group relative flex h-full flex-col rounded-lg border border-border border-t-champagne-deep bg-card p-7 transition-[border-color,transform] duration-700 hover:-translate-y-1 hover:border-champagne-deep/50 md:p-8">
        <span className="font-display text-5xl italic text-taupe-deep">{service.index}</span>
        <h3 className="mt-6 text-3xl">{service.name}</h3>
        <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{service.short}</p>
        <Button variant="ghost"
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="mt-8 flex h-auto min-h-12 items-center justify-between rounded-none border-t border-border px-0 py-4 text-left text-sm font-semibold"
        >
          Quero saber mais
          <Plus size={18} className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`} aria-hidden="true" />
        </Button>
        <div id={panelId} role="region" aria-label={`Detalhes: ${service.name}`} hidden={!open} className="animate-in fade-in slide-in-from-top-1">
          <div className="space-y-3 pt-4 text-sm leading-relaxed text-muted-foreground">
            {service.details.map((d) => <p key={d}>{d}</p>)}
          </div>
          <Button type="button" className="btn btn-primary mt-6 h-auto w-full whitespace-normal py-3" onClick={(e) => requestBooking(service.name, e.currentTarget)}>
            Conversar sobre {service.name.toLowerCase()}
          </Button>
        </div>
      </article>
    </li>
  );
}

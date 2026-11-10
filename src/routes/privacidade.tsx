import { createFileRoute, Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade | Emyli Giseli" },
      {
        name: "description",
        content:
          "Conheça o uso de contas, histórico do assistente e informações de visitas no site de Emyli Giseli.",
      },
      { property: "og:title", content: "Privacidade | Emyli Giseli" },
      {
        property: "og:description",
        content: "Saiba como sua conta e conversa com a assistente são tratadas.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <Link to="/" className="eyebrow text-taupe-deep hover:text-foreground">
        ← Voltar ao início
      </Link>
      <h1 className="mt-8 text-5xl">Privacidade</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
        <p>
          Este site apresenta os serviços de {siteConfig.brandName}. O assistente virtual utiliza
          uma conta para guardar o histórico privado de suas conversas em Lovable Cloud.
        </p>
        <p>
          As perguntas e o histórico são enviados ao AI Gateway para produzir respostas baseadas nas
          informações do site. Não envie fotos, informações de saúde ou outros dados sensíveis. O
          assistente não substitui uma avaliação individual.
        </p>
        <p>
          Você pode apagar o histórico no assistente. Informações agregadas de visitas, origem de
          acesso, país e dispositivo podem ser disponibilizadas pela hospedagem Lovable. Não
          adicionamos ferramentas de publicidade.
        </p>
        <p>
          Ao clicar nos botões de contato, você é direcionada ao Instagram ou ao WhatsApp. A partir
          daí, valem as políticas de privacidade dessas plataformas, e as informações que você
          enviar são vistas apenas na conversa com Emyli.
        </p>
        <p>
          O link “localização da cidade” abre uma busca por {siteConfig.city}-{siteConfig.stateCode}{" "}
          no Google Maps.
        </p>
        <p>
          Dúvidas? Fale pelo{" "}
          <a
            className="underline"
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          .
        </p>
      </div>
    </main>
  );
}

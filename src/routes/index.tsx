import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { publishedServices } from "@/content/services";
import { useRevealAll } from "@/hooks/use-reveal";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Results } from "@/components/site/Results";
import { About } from "@/components/site/About";
import { Contact, Faq, FloatingContact, Footer, HowTo } from "@/components/site/Sections";

const title = "Emyli Giseli | Sobrancelhas em Vicentina-MS";
const description =
  "Design de sobrancelhas, design com henna e brow lamination em Vicentina-MS com Emyli Giseli. Converse e combine seu horário.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: `${siteConfig.brandName} | ${siteConfig.brandTagline}`,
  areaServed: `${siteConfig.city}-${siteConfig.stateCode}`,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressRegion: siteConfig.stateCode, addressCountry: "BR" },
  sameAs: [siteConfig.instagramUrl],
  makesOffer: publishedServices.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name } })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: siteConfig.siteUrl ? [{ rel: "canonical", href: `${siteConfig.siteUrl}/` }] : [],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  useRevealAll();
  return (
    <BookingProvider>
      <a href="#conteudo" className="sr-only z-[70] rounded-full bg-graphite px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Services />
        <Results />
        <About />
        <HowTo />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </BookingProvider>
  );
}

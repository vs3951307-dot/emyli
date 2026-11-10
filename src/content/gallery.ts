/**
 * Galeria de resultados — adicione SOMENTE fotos reais com autorização da cliente.
 * 1. Envie a imagem (lovable-assets) e importe o ponteiro .asset.json.
 * 2. Adicione um item abaixo com width/height reais e um alt descritivo.
 * Para o comparador antes/depois, preencha `before` com a foto do MESMO atendimento.
 */
import r1 from "@/assets/results/resultado-1.jpg.asset.json";
import r2 from "@/assets/results/resultado-2.jpg.asset.json";
import r3 from "@/assets/results/resultado-3.jpg.asset.json";
import r4 from "@/assets/results/resultado-4.jpg.asset.json";
import r5 from "@/assets/results/resultado-5.jpg.asset.json";
import olhar from "@/assets/capa-olhar.jpg";

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface GalleryItem {
  id: string;
  serviceId: string;
  after: GalleryImage;
  before?: GalleryImage;
  authorized: true;
}

export const gallery: GalleryItem[] = [
  { id: "r1", serviceId: "design-sobrancelhas", authorized: true,
    after: { src: r1.url, width: 1440, height: 1920, alt: "Sobrancelhas escuras e definidas após o design, vistas em close" } },
  { id: "r2", serviceId: "brow-lamination", authorized: true,
    after: { src: r2.url, width: 1440, height: 1920, alt: "Fios alinhados e penteados para cima após brow lamination" } },
  { id: "r3", serviceId: "design-sobrancelhas", authorized: true,
    after: { src: r3.url, width: 1536, height: 1920, alt: "Montagem com as sobrancelhas antes, em cima, e depois do design, embaixo" } },
  { id: "r4", serviceId: "design-sobrancelhas", authorized: true,
    after: { src: r4.url, width: 1440, height: 1920, alt: "Sobrancelha antes e depois de um design natural, de olhos fechados" } },
  { id: "r5", serviceId: "design-sobrancelhas", authorized: true,
    after: { src: r5.url, width: 1440, height: 1920, alt: "Comparação lado a lado das sobrancelhas antes e depois do design" } },
];

/** Retrato autorizado de Emyli. null = mostra composição abstrata. */
export const portrait: GalleryImage | null = {
  src: olhar, width: 1024, height: 1280, alt: "Close de um olhar com sobrancelha bem desenhada e brilho dourado",
};

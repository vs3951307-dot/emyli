/**
 * Configuração central da marca e dos contatos.
 * Edite aqui — o site inteiro se adapta automaticamente.
 * Campos vazios ficam ocultos no site (nunca preencha com dados fictícios).
 */
export const siteConfig = {
  brandName: "Emyli Giseli",
  brandTagline: "Estética & Sobrancelhas",
  instagramHandle: "@emyligiseliestetica",
  instagramUrl: "https://www.instagram.com/emyligiseliestetica/",
  /** Somente dígitos com DDI + DDD, ex.: "5567999999999". Vazio = WhatsApp desativado. */
  whatsappNumber: "5567998852620" as string,
  city: "Vicentina",
  state: "Mato Grosso do Sul",
  stateCode: "MS",
  /** Endereço completo confirmado pela proprietária. Vazio = oculto. */
  address: "" as string,
  /** Ex.: [{ days: "Segunda a sexta", hours: "9h às 18h" }]. Vazio = oculto. */
  openingHours: [] as { days: string; hours: string }[],
  /** Futuro: "whatsapp" | "external". */
  bookingProvider: "whatsapp" as "whatsapp" | "external",
  /** URL de agenda online externa (quando bookingProvider = "external"). */
  bookingUrl: "" as string,
  /** Domínio definitivo, ex.: "https://emyligiseli.com.br". Vazio = sem canonical absoluto. */
  siteUrl: "https://papaya-salamander-ab2d6d.netlify.app" as string,
} as const;

export type SiteConfig = typeof siteConfig;
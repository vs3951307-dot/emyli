import { siteConfig } from "@/config/site";

export function normalizePhone(raw: string): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function bookingMessage(serviceName?: string): string {
  return serviceName
    ? `Olá, Emyli! Vim pelo site e gostaria de saber mais sobre ${serviceName} e consultar disponibilidade.`
    : "Olá, Emyli! Vim pelo site e gostaria de consultar disponibilidade para um atendimento.";
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Retorna o link de agendamento ativo, ou null quando nada válido está configurado. */
export function resolveBookingUrl(serviceName?: string, config = siteConfig): string | null {
  if (config.bookingProvider === "external" && /^https:\/\//.test(config.bookingUrl)) {
    return config.bookingUrl;
  }
  return buildWhatsAppUrl(config.whatsappNumber, bookingMessage(serviceName));
}

import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl, bookingMessage, resolveBookingUrl } from "./booking";

describe("booking", () => {
  it("returns null while no WhatsApp number is configured", () => {
    expect(resolveBookingUrl("Brow lamination", { ...siteConfig, whatsappNumber: "" })).toBeNull();
  });

  it("rejects too-short numbers", () => {
    expect(buildWhatsAppUrl("123", "oi")).toBeNull();
  });

  it("builds an encoded wa.me link with the service name", () => {
    const url = resolveBookingUrl("Design de sobrancelhas", {
      ...siteConfig,
      whatsappNumber: "+55 (67) 99999-0000",
    });
    expect(url).toBe(
      "https://wa.me/5567999990000?text=" +
        encodeURIComponent(
          "Olá, Emyli! Vim pelo site e gostaria de saber mais sobre Design de sobrancelhas e consultar disponibilidade.",
        ),
    );
  });

  it("uses a general message without service", () => {
    expect(bookingMessage()).not.toContain("sobre undefined");
  });
});

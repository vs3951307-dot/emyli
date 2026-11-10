import { describe, it, expect } from "vitest";
import { assistantKnowledge } from "./assistant-knowledge";
describe("assistant confirmed knowledge", () => {
  it("includes exactly the three published services, not pending Buço", () => {
    expect(assistantKnowledge().services.map((s) => s.name)).toEqual([
      "Design de sobrancelhas",
      "Design com henna",
      "Brow lamination",
    ]);
  });
  it("directs individual questions to the real Instagram", () => {
    expect(assistantKnowledge().instagram).toBe("https://www.instagram.com/emyligiseliestetica/");
  });
});

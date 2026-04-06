import { describe, it, expect } from "vitest";
import {
  getPortfolioOverview,
  getSection,
  searchPortfolio,
  SECTION_NAMES,
} from "./tools";

describe("getPortfolioOverview", () => {
  it("returns correct identity", () => {
    const result = getPortfolioOverview();
    expect(result.name).toBe("Adi Perswal");
    expect(result.company).toBe("Amazon");
    expect(result.social.github).toContain("github.com");
  });

  it("lists all sections", () => {
    const result = getPortfolioOverview();
    const sectionNames = result.sections.map((s) => s.name);
    for (const name of SECTION_NAMES) {
      expect(sectionNames).toContain(name);
    }
  });

  it("includes correct project count", () => {
    const result = getPortfolioOverview();
    const projectSection = result.sections.find((s) => s.name === "projects");
    expect(projectSection?.count).toBeGreaterThan(0);
  });
});

describe("getSection", () => {
  it("returns all projects", () => {
    const result = getSection("projects");
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
    expect((result.data as unknown[]).length).toBeGreaterThan(0);
  });

  it("filters projects by category", () => {
    const result = getSection("projects", { category: "featured" });
    expect(result).toHaveProperty("data");
    const data = result.data as Array<{ category: string }>;
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) {
      expect(p.category).toBe("featured");
    }
  });

  it("returns books filtered by status", () => {
    const result = getSection("books", { status: "favorites" });
    const data = result.data as Array<{ status: string }>;
    expect(data.length).toBeGreaterThan(0);
    for (const b of data) {
      expect(b.status).toBe("favorites");
    }
  });

  it("returns movies filtered by type", () => {
    const result = getSection("movies", { type: "series" });
    const data = result.data as Array<{ type: string }>;
    expect(data.length).toBeGreaterThan(0);
    for (const m of data) {
      expect(m.type).toBe("series");
    }
  });

  it("returns cover letter with paragraphs", () => {
    const result = getSection("cover-letter");
    const data = result.data as unknown as {
      paragraphs: readonly string[];
      closing: string;
    };
    expect(data.paragraphs.length).toBeGreaterThan(5);
    expect(data.closing).toContain("Aditya");
  });

  it("returns contact info", () => {
    const result = getSection("contact");
    const data = result.data as { email: string; phone: string };
    expect(data.email).toContain("@");
    expect(data.phone).toBeTruthy();
  });

  it("returns experience data", () => {
    const result = getSection("experience");
    expect(Array.isArray(result.data)).toBe(true);
    const data = result.data as Array<{ company: string }>;
    expect(data.some((e) => e.company === "Amazon")).toBe(true);
  });

  it("returns error for unknown section", () => {
    const result = getSection("nonexistent");
    expect(result).toHaveProperty("error");
  });
});

describe("searchPortfolio", () => {
  it("finds projects by name", () => {
    const result = searchPortfolio("AutoDocs");
    expect(result.count).toBeGreaterThan(0);
    expect(result.results[0].section).toBe("projects");
  });

  it("finds experience by company", () => {
    const result = searchPortfolio("Amazon");
    expect(result.count).toBeGreaterThan(0);
    expect(result.results.some((r) => r.section === "experience")).toBe(true);
  });

  it("finds across sections with tech keyword", () => {
    const result = searchPortfolio("Python");
    expect(result.count).toBeGreaterThan(0);
  });

  it("returns empty for nonexistent query", () => {
    const result = searchPortfolio("xyznonexistent123");
    expect(result.count).toBe(0);
    expect(result.results).toEqual([]);
  });

  it("respects limit parameter", () => {
    const result = searchPortfolio("a", 3);
    expect(result.results.length).toBeLessThanOrEqual(3);
  });

  it("returns empty for empty query", () => {
    const result = searchPortfolio("   ");
    expect(result.count).toBe(0);
  });
});

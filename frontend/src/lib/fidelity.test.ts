import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultNdaData } from "./defaults";
import { standardTerms } from "./document";

/**
 * Guardrail: the Standard Terms hard-coded in `document.ts` must stay faithful
 * to the canonical Common Paper template committed at the repo root
 * (`templates/Mutual-NDA.md`, added in PL-2). This catches silent transcription
 * drift in the legal text.
 *
 * Tests run with the working directory set to `frontend/`, so the template is
 * one level up.
 */
const TEMPLATE_PATH = path.resolve(process.cwd(), "..", "templates", "Mutual-NDA.md");

/** Normalize legal prose for comparison: drop HTML spans, markdown bold, and
 * collapse whitespace. Applied identically to both sides. */
function normalize(text: string): string {
  return text
    .replace(/<\/?span[^>]*>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface ParsedSection {
  n: number;
  title: string;
  body: string;
}

/** Parse the numbered Standard Terms paragraphs out of the source template. */
function parseTemplateSections(markdown: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lineRe = /^(\d+)\.\s+\*\*(.+?)\*\*\.?\s*(.*)$/;
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(lineRe);
    if (match) {
      sections.push({
        n: Number(match[1]),
        title: normalize(match[2]),
        body: normalize(match[3]),
      });
    }
  }
  return sections;
}

describe("Standard Terms fidelity to templates/Mutual-NDA.md", () => {
  it("the source template exists at the repo root", () => {
    expect(
      existsSync(TEMPLATE_PATH),
      `Expected template at ${TEMPLATE_PATH}`,
    ).toBe(true);
  });

  const template = existsSync(TEMPLATE_PATH)
    ? parseTemplateSections(readFileSync(TEMPLATE_PATH, "utf8"))
    : [];

  it("parses all 11 sections from the template", () => {
    expect(template.map((s) => s.n)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  const ours = standardTerms(defaultNdaData);

  it("section titles match the template exactly", () => {
    expect(ours.map((s) => normalize(s.title))).toEqual(
      template.map((s) => s.title),
    );
  });

  // Sections 9 is interpolated with governing law / jurisdiction and slightly
  // reworded ("such State" / "such courts"), so it is verified structurally in
  // document.test.ts rather than by verbatim match here.
  const verbatimSections = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
  for (const n of verbatimSections) {
    it(`section ${n} body matches the template verbatim`, () => {
      const mine = ours.find((s) => s.n === n)!;
      const theirs = template.find((s) => s.n === n)!;
      expect(normalize(mine.body)).toBe(theirs.body);
    });
  }

  it("section 9 preserves the template's key legal phrases", () => {
    const theirs = template.find((s) => s.n === 9)!;
    // The template references governing law/jurisdiction via placeholders; make
    // sure our interpolation kept the surrounding operative language.
    expect(theirs.body).toContain("governed by, and construed in accordance with");
    expect(theirs.body).toContain("exclusive jurisdiction");
    const mine = standardTerms({
      ...defaultNdaData,
      governingLaw: "Delaware",
      jurisdiction: "New Castle County, Delaware",
    }).find((s) => s.n === 9)!;
    expect(mine.body).toContain("governed by, and construed in accordance with");
    expect(mine.body).toContain("exclusive jurisdiction");
  });
});

import { describe, expect, it } from "vitest";
import { defaultNdaData } from "./defaults";
import {
  PLACEHOLDER,
  confidentialityText,
  fill,
  formatEffectiveDate,
  mndaTermText,
  standardTerms,
} from "./document";
import type { NdaData } from "./types";

function makeData(overrides: Partial<NdaData> = {}): NdaData {
  return { ...defaultNdaData, ...overrides };
}

describe("fill", () => {
  it("returns the trimmed value when present", () => {
    expect(fill("  Delaware  ")).toBe("Delaware");
  });

  it("returns the default placeholder for empty/whitespace input", () => {
    expect(fill("")).toBe(PLACEHOLDER);
    expect(fill("   ")).toBe(PLACEHOLDER);
  });

  it("supports a custom placeholder", () => {
    expect(fill("", "[TBD]")).toBe("[TBD]");
  });
});

describe("formatEffectiveDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(formatEffectiveDate("2026-07-28")).toBe("July 28, 2026");
  });

  it("returns the placeholder for an empty date", () => {
    expect(formatEffectiveDate("")).toBe(PLACEHOLDER);
  });

  it("returns the raw input when it cannot be parsed", () => {
    expect(formatEffectiveDate("not-a-date")).toBe("not-a-date");
  });
});

describe("mndaTermText", () => {
  it("describes a fixed expiry with correct pluralization", () => {
    expect(mndaTermText(makeData({ mndaTerm: "expires", mndaTermYears: "1" }))).toBe(
      "Expires 1 year from the Effective Date.",
    );
    expect(mndaTermText(makeData({ mndaTerm: "expires", mndaTermYears: "3" }))).toBe(
      "Expires 3 years from the Effective Date.",
    );
  });

  it("describes an until-terminated term", () => {
    expect(mndaTermText(makeData({ mndaTerm: "untilTerminated" }))).toBe(
      "Continues until terminated in accordance with the terms of the MNDA.",
    );
  });
});

describe("confidentialityText", () => {
  it("describes a fixed number of years with trade-secret carve-out", () => {
    const text = confidentialityText(
      makeData({ confidentiality: "years", confidentialityYears: "2" }),
    );
    expect(text).toContain("2 years from the Effective Date");
    expect(text).toContain("trade secret");
  });

  it("describes perpetual confidentiality", () => {
    expect(
      confidentialityText(makeData({ confidentiality: "perpetuity" })),
    ).toBe("In perpetuity.");
  });
});

describe("standardTerms", () => {
  it("returns exactly 11 sequentially numbered sections", () => {
    const sections = standardTerms(makeData());
    expect(sections).toHaveLength(11);
    expect(sections.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("every section has a title and non-empty body", () => {
    for (const section of standardTerms(makeData())) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.body.length).toBeGreaterThan(0);
    }
  });

  it("interpolates governing law and jurisdiction into section 9", () => {
    const sections = standardTerms(
      makeData({ governingLaw: "Delaware", jurisdiction: "New Castle County, Delaware" }),
    );
    const section9 = sections.find((s) => s.n === 9)!;
    expect(section9.body).toContain("laws of the State of Delaware");
    expect(section9.body).toContain(
      "courts located in New Castle County, Delaware",
    );
  });

  it("uses bracketed placeholders in section 9 when fields are empty", () => {
    const section9 = standardTerms(makeData({ governingLaw: "", jurisdiction: "" })).find(
      (s) => s.n === 9,
    )!;
    expect(section9.body).toContain("[Governing Law]");
    expect(section9.body).toContain("[Jurisdiction]");
  });
});

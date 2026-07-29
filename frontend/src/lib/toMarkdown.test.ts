import { describe, expect, it } from "vitest";
import { defaultNdaData } from "./defaults";
import { toMarkdown } from "./toMarkdown";
import type { NdaData } from "./types";

const filled: NdaData = {
  ...defaultNdaData,
  effectiveDate: "2026-07-28",
  governingLaw: "Delaware",
  jurisdiction: "New Castle County, Delaware",
  mndaTerm: "expires",
  mndaTermYears: "2",
  confidentiality: "perpetuity",
  modifications: "",
  party1: {
    company: "Acme, Inc.",
    name: "Jane Doe",
    title: "CEO",
    notice: "legal@acme.com",
  },
  party2: {
    company: "Globex LLC",
    name: "John Roe",
    title: "General Counsel",
    notice: "123 Main St\nWilmington, DE",
  },
};

describe("toMarkdown", () => {
  it("renders the document headings", () => {
    const md = toMarkdown(filled);
    expect(md).toContain("# Mutual Non-Disclosure Agreement");
    expect(md).toContain("## Cover Page");
    expect(md).toContain("## Standard Terms");
  });

  it("includes the filled cover-page fields", () => {
    const md = toMarkdown(filled);
    expect(md).toContain("**Effective Date:** July 28, 2026");
    expect(md).toContain("**Governing Law:** Delaware");
    expect(md).toContain("**Jurisdiction:** New Castle County, Delaware");
    expect(md).toContain("**MNDA Term:** Expires 2 years from the Effective Date.");
    expect(md).toContain("**Term of Confidentiality:** In perpetuity.");
  });

  it("defaults MNDA Modifications to 'None.' when blank", () => {
    expect(toMarkdown(filled)).toContain("**MNDA Modifications:** None.");
  });

  it("renders the signature table with party details", () => {
    const md = toMarkdown(filled);
    expect(md).toContain("| Print Name | Jane Doe | John Roe |");
    expect(md).toContain("| Title | CEO | General Counsel |");
    expect(md).toContain("| Company | Acme, Inc. | Globex LLC |");
  });

  it("escapes newlines in a table cell as <br>", () => {
    const md = toMarkdown(filled);
    expect(md).toContain("| Notice Address | legal@acme.com | 123 Main St<br>Wilmington, DE |");
  });

  it("escapes pipe characters so a party value cannot break the table", () => {
    const md = toMarkdown({
      ...filled,
      party1: { ...filled.party1, company: "Smith | Jones LLP" },
    });
    expect(md).toContain("| Company | Smith \\| Jones LLP | Globex LLC |");
    // The row must still have exactly the 3 structural pipes + escaped one = 4 unescaped pipes.
    const companyRow = md.split("\n").find((l) => l.startsWith("| Company |"))!;
    expect(companyRow.match(/(?<!\\)\|/g)).toHaveLength(4);
  });

  it("includes all 11 numbered Standard Terms and the license footer", () => {
    const md = toMarkdown(filled);
    for (let n = 1; n <= 11; n += 1) {
      expect(md).toMatch(new RegExp(`^${n}\\. \\*\\*`, "m"));
    }
    expect(md).toContain("free to use under [CC BY 4.0]");
  });

  it("shows placeholders when required fields are blank", () => {
    const md = toMarkdown(defaultNdaData);
    expect(md).toContain("**Governing Law:** ————");
  });
});

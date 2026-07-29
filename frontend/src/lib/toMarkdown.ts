import { coverPageFields, standardTerms } from "./document";
import type { NdaData } from "./types";

/** Sanitize a value for use inside a single Markdown table cell: escape the
 * pipe delimiter and turn newlines into `<br>` so the table structure holds. */
function cell(value: string): string {
  const v = value
    .trim()
    .replace(/\|/g, "\\|")
    .replace(/\r?\n+/g, "<br>");
  return v.length > 0 ? v : " ";
}

/** Render the completed Mutual NDA as a portable Markdown document. */
export function toMarkdown(d: NdaData): string {
  const lines: string[] = [
    "# Mutual Non-Disclosure Agreement",
    "",
    "## Cover Page",
    "",
    ...coverPageFields(d).flatMap((f) => [`**${f.label}:** ${f.value}`, ""]),
    "By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.",
    "",
    "|  | Party 1 | Party 2 |",
    "| --- | --- | --- |",
    "| Signature |  |  |",
    `| Print Name | ${cell(d.party1.name)} | ${cell(d.party2.name)} |`,
    `| Title | ${cell(d.party1.title)} | ${cell(d.party2.title)} |`,
    `| Company | ${cell(d.party1.company)} | ${cell(d.party2.company)} |`,
    `| Notice Address | ${cell(d.party1.notice)} | ${cell(d.party2.notice)} |`,
    "| Date |  |  |",
    "",
    "## Standard Terms",
    "",
  ];

  for (const s of standardTerms(d)) {
    lines.push(`${s.n}. **${s.title}.** ${s.body}`, "");
  }

  lines.push(
    "Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).",
    "",
  );

  return lines.join("\n");
}

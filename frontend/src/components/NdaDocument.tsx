import {
  confidentialityText,
  fill,
  formatEffectiveDate,
  mndaTermText,
  standardTerms,
} from "@/lib/document";
import type { NdaData } from "@/lib/types";

function CoverField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 whitespace-pre-wrap">{children}</div>
    </div>
  );
}

export default function NdaDocument({ data }: { data: NdaData }) {
  const signatureRows: Array<[string, string, string]> = [
    ["Signature", "", ""],
    ["Print Name", data.party1.name, data.party2.name],
    ["Title", data.party1.title, data.party2.title],
    ["Company", data.party1.company, data.party2.company],
    ["Notice Address", data.party1.notice, data.party2.notice],
    ["Date", "", ""],
  ];

  return (
    <article className="font-serif text-[13px] leading-relaxed text-slate-900">
      <h1 className="text-center text-xl font-bold">
        Mutual Non-Disclosure Agreement
      </h1>

      <h2 className="mt-6 border-b border-slate-300 pb-1 text-sm font-bold uppercase tracking-wide text-slate-700">
        Cover Page
      </h2>

      <div className="mt-3">
        <CoverField label="Purpose">{fill(data.purpose)}</CoverField>
        <CoverField label="Effective Date">
          {formatEffectiveDate(data.effectiveDate)}
        </CoverField>
        <CoverField label="MNDA Term">{mndaTermText(data)}</CoverField>
        <CoverField label="Term of Confidentiality">
          {confidentialityText(data)}
        </CoverField>
        <CoverField label="Governing Law">{fill(data.governingLaw)}</CoverField>
        <CoverField label="Jurisdiction">{fill(data.jurisdiction)}</CoverField>
        <CoverField label="MNDA Modifications">
          {data.modifications.trim() || "None."}
        </CoverField>
      </div>

      <p className="mt-4">
        By signing this Cover Page, each party agrees to enter into this MNDA as
        of the Effective Date.
      </p>

      <table className="mt-4 w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="w-1/4 border border-slate-300 p-2 text-left font-semibold">
              &nbsp;
            </th>
            <th className="border border-slate-300 p-2 text-left font-semibold">
              Party 1
            </th>
            <th className="border border-slate-300 p-2 text-left font-semibold">
              Party 2
            </th>
          </tr>
        </thead>
        <tbody>
          {signatureRows.map(([label, a, b]) => (
            <tr key={label}>
              <td className="border border-slate-300 p-2 font-semibold">
                {label}
              </td>
              <td className="h-8 whitespace-pre-wrap border border-slate-300 p-2 align-top">
                {a}
              </td>
              <td className="h-8 whitespace-pre-wrap border border-slate-300 p-2 align-top">
                {b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-8 border-b border-slate-300 pb-1 text-sm font-bold uppercase tracking-wide text-slate-700">
        Standard Terms
      </h2>
      <ol className="mt-3 list-decimal space-y-3 pl-5">
        {standardTerms(data).map((section) => (
          <li key={section.n}>
            <span className="font-bold">{section.title}.</span> {section.body}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[11px] text-slate-500">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
        under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        .
      </p>
    </article>
  );
}

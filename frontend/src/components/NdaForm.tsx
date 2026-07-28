"use client";

import type { NdaData, Party } from "@/lib/types";

interface Props {
  data: NdaData;
  onChange: (patch: Partial<NdaData>) => void;
  onPartyChange: (which: "party1" | "party2", patch: Partial<Party>) => void;
}

const labelClass = "block text-sm font-medium text-slate-700";
const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";
const yearsInputClass =
  "w-16 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100 disabled:text-slate-400";

function PartyFieldset({
  title,
  party,
  onChange,
}: {
  title: string;
  party: Party;
  onChange: (patch: Partial<Party>) => void;
}) {
  const field = (
    key: keyof Party,
    label: string,
    placeholder: string,
  ) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        value={party[key]}
        placeholder={placeholder}
        onChange={(e) => onChange({ [key]: e.target.value })}
      />
    </label>
  );

  return (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-slate-800">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("company", "Company", "Acme, Inc.")}
        {field("name", "Print Name", "Jane Doe")}
        {field("title", "Title", "Chief Executive Officer")}
        {field("notice", "Notice Address", "legal@acme.com")}
      </div>
    </fieldset>
  );
}

export default function NdaForm({ data, onChange, onPartyChange }: Props) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800">
          Agreement Terms
        </legend>

        <label className="block">
          <span className={labelClass}>Purpose</span>
          <textarea
            className={inputClass}
            rows={2}
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
          />
          <span className="mt-1 block text-xs text-slate-500">
            How Confidential Information may be used.
          </span>
        </label>

        <label className="block">
          <span className={labelClass}>Effective Date</span>
          <input
            type="date"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => onChange({ effectiveDate: e.target.value })}
          />
        </label>

        <div>
          <span className={labelClass}>MNDA Term</span>
          <div className="mt-2 space-y-2">
            <label className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="mndaTerm"
                checked={data.mndaTerm === "expires"}
                onChange={() => onChange({ mndaTerm: "expires" })}
              />
              <span>Expires</span>
              <input
                type="number"
                min={1}
                className={yearsInputClass}
                value={data.mndaTermYears}
                disabled={data.mndaTerm !== "expires"}
                onChange={(e) => onChange({ mndaTermYears: e.target.value })}
              />
              <span>year(s) from the Effective Date</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="mndaTerm"
                checked={data.mndaTerm === "untilTerminated"}
                onChange={() => onChange({ mndaTerm: "untilTerminated" })}
              />
              <span>Continues until terminated</span>
            </label>
          </div>
        </div>

        <div>
          <span className={labelClass}>Term of Confidentiality</span>
          <div className="mt-2 space-y-2">
            <label className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="confidentiality"
                checked={data.confidentiality === "years"}
                onChange={() => onChange({ confidentiality: "years" })}
              />
              <input
                type="number"
                min={1}
                className={yearsInputClass}
                value={data.confidentialityYears}
                disabled={data.confidentiality !== "years"}
                onChange={(e) =>
                  onChange({ confidentialityYears: e.target.value })
                }
              />
              <span>year(s) from the Effective Date</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="confidentiality"
                checked={data.confidentiality === "perpetuity"}
                onChange={() => onChange({ confidentiality: "perpetuity" })}
              />
              <span>In perpetuity</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Governing Law (State)</span>
            <input
              className={inputClass}
              value={data.governingLaw}
              placeholder="Delaware"
              onChange={(e) => onChange({ governingLaw: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Jurisdiction</span>
            <input
              className={inputClass}
              value={data.jurisdiction}
              placeholder="New Castle County, Delaware"
              onChange={(e) => onChange({ jurisdiction: e.target.value })}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>MNDA Modifications (optional)</span>
          <textarea
            className={inputClass}
            rows={2}
            value={data.modifications}
            placeholder="List any modifications to the standard MNDA, or leave blank."
            onChange={(e) => onChange({ modifications: e.target.value })}
          />
        </label>
      </fieldset>

      <PartyFieldset
        title="Party 1"
        party={data.party1}
        onChange={(patch) => onPartyChange("party1", patch)}
      />
      <PartyFieldset
        title="Party 2"
        party={data.party2}
        onChange={(patch) => onPartyChange("party2", patch)}
      />
    </form>
  );
}

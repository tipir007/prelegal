"use client";

import type {
  ConfidentialityType,
  MndaTermType,
  NdaData,
  Party,
} from "@/lib/types";

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

interface YearsTermFieldsetProps<T extends string> {
  legend: string;
  name: string;
  /** The option value representing "a fixed number of years". */
  yearsOptionValue: T;
  /** The option value representing the alternative (e.g. perpetual). */
  altOptionValue: T;
  selected: T;
  onSelect: (value: T) => void;
  yearsValue: string;
  onYearsChange: (value: string) => void;
  /** Accessible name for the "N years" radio option. */
  yearsOptionLabel: string;
  /** Optional visible text between the radio and the number input (e.g. "Expires"). */
  yearsPrefix?: string;
  alternativeLabel: string;
}

/** A "N year(s) from the Effective Date" radio option paired with an
 * alternative option. Shared by the MNDA Term and Term of Confidentiality
 * pickers so they stay consistent. */
function YearsTermFieldset<T extends string>({
  legend,
  name,
  yearsOptionValue,
  altOptionValue,
  selected,
  onSelect,
  yearsValue,
  onYearsChange,
  yearsOptionLabel,
  yearsPrefix,
  alternativeLabel,
}: YearsTermFieldsetProps<T>) {
  const yearsSelected = selected === yearsOptionValue;
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name={name}
            aria-label={yearsOptionLabel}
            checked={yearsSelected}
            onChange={() => onSelect(yearsOptionValue)}
          />
          {yearsPrefix ? <span>{yearsPrefix}</span> : null}
          <input
            type="number"
            min={1}
            aria-label="Number of years"
            className={yearsInputClass}
            value={yearsValue}
            disabled={!yearsSelected}
            onChange={(e) => onYearsChange(e.target.value)}
          />
          <span>year(s) from the Effective Date</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name={name}
            checked={selected === altOptionValue}
            onChange={() => onSelect(altOptionValue)}
          />
          <span>{alternativeLabel}</span>
        </label>
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

        <YearsTermFieldset<MndaTermType>
          legend="MNDA Term"
          name="mndaTerm"
          yearsOptionValue="expires"
          altOptionValue="untilTerminated"
          selected={data.mndaTerm}
          onSelect={(value) => onChange({ mndaTerm: value })}
          yearsValue={data.mndaTermYears}
          onYearsChange={(value) => onChange({ mndaTermYears: value })}
          yearsPrefix="Expires"
          yearsOptionLabel="Expires a fixed number of years from the Effective Date"
          alternativeLabel="Continues until terminated"
        />

        <YearsTermFieldset<ConfidentialityType>
          legend="Term of Confidentiality"
          name="confidentiality"
          yearsOptionValue="years"
          altOptionValue="perpetuity"
          selected={data.confidentiality}
          onSelect={(value) => onChange({ confidentiality: value })}
          yearsValue={data.confidentialityYears}
          onYearsChange={(value) => onChange({ confidentialityYears: value })}
          yearsOptionLabel="A fixed number of years from the Effective Date"
          alternativeLabel="In perpetuity"
        />

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

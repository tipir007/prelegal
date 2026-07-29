import type { NdaData, Party } from "./types";

/**
 * Today's date as a local-calendar ISO string (yyyy-mm-dd).
 *
 * Uses local getters rather than `toISOString()` (which is UTC) so the default
 * matches the user's wall-clock day. Call this on the client (see page.tsx) to
 * avoid baking the build-time date into the statically prerendered HTML.
 */
export function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const emptyParty: Party = { company: "", name: "", title: "", notice: "" };

export const defaultNdaData: NdaData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  // Populated with today's local date on the client after mount (page.tsx).
  effectiveDate: "",
  mndaTerm: "expires",
  mndaTermYears: "1",
  confidentiality: "years",
  confidentialityYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { ...emptyParty },
  party2: { ...emptyParty },
};

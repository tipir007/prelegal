export type MndaTermType = "expires" | "untilTerminated";
export type ConfidentialityType = "years" | "perpetuity";

export interface Party {
  company: string;
  name: string;
  title: string;
  notice: string;
}

export interface NdaData {
  purpose: string;
  /** ISO date string (yyyy-mm-dd). */
  effectiveDate: string;
  mndaTerm: MndaTermType;
  mndaTermYears: string;
  confidentiality: ConfidentialityType;
  confidentialityYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: Party;
  party2: Party;
}

import { describe, expect, it } from "vitest";
import { defaultNdaData, todayISO } from "./defaults";

describe("todayISO", () => {
  it("returns the local calendar date as yyyy-mm-dd (not UTC)", () => {
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    expect(todayISO()).toBe(expected);
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("defaultNdaData", () => {
  it("leaves the effective date blank (populated on the client after mount)", () => {
    expect(defaultNdaData.effectiveDate).toBe("");
  });

  it("uses the Common Paper default purpose", () => {
    expect(defaultNdaData.purpose).toMatch(/Evaluating whether to enter/);
  });

  it("defaults to the 'expires' term and 'years' confidentiality with 1 year each", () => {
    expect(defaultNdaData.mndaTerm).toBe("expires");
    expect(defaultNdaData.mndaTermYears).toBe("1");
    expect(defaultNdaData.confidentiality).toBe("years");
    expect(defaultNdaData.confidentialityYears).toBe("1");
  });

  it("starts with two empty parties", () => {
    for (const party of [defaultNdaData.party1, defaultNdaData.party2]) {
      expect(party).toEqual({ company: "", name: "", title: "", notice: "" });
    }
  });

  it("does not share the same party object reference", () => {
    expect(defaultNdaData.party1).not.toBe(defaultNdaData.party2);
  });
});

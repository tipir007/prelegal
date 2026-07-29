import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultNdaData } from "@/lib/defaults";
import type { NdaData } from "@/lib/types";
import NdaDocument from "./NdaDocument";

function renderDoc(overrides: Partial<NdaData> = {}) {
  return render(<NdaDocument data={{ ...defaultNdaData, ...overrides }} />);
}

describe("NdaDocument", () => {
  it("renders the agreement title and both major sections", () => {
    renderDoc();
    expect(
      screen.getByRole("heading", { name: "Mutual Non-Disclosure Agreement" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cover Page")).toBeInTheDocument();
    expect(screen.getByText("Standard Terms")).toBeInTheDocument();
  });

  it("renders all 11 Standard Terms as list items", () => {
    renderDoc();
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(11);
  });

  it("shows a placeholder for an unfilled governing law", () => {
    renderDoc({ governingLaw: "" });
    // The cover-page "Governing Law" field falls back to the placeholder glyph.
    expect(screen.getAllByText("————").length).toBeGreaterThan(0);
  });

  it("shows filled party details in the signature table", () => {
    renderDoc({
      party1: { company: "Acme, Inc.", name: "Jane Doe", title: "CEO", notice: "a@x.com" },
    });
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Acme, Inc.")).toBeInTheDocument();
  });

  it("reflects the perpetuity confidentiality option", () => {
    renderDoc({ confidentiality: "perpetuity" });
    expect(screen.getByText("In perpetuity.")).toBeInTheDocument();
  });
});

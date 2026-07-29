import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

/**
 * Integration test for the interactive flow: typing in the form must update the
 * live document preview. This exercises the real client-side state wiring that
 * a server-rendered HTML check cannot verify.
 */
describe("Home page (form → live preview)", () => {
  it("renders the form and a document preview together", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Mutual NDA Creator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mutual Non-Disclosure Agreement" }),
    ).toBeInTheDocument();
  });

  it("populates the Effective Date with today's local date after mount", () => {
    render(<Home />);
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dateInput = screen.getByLabelText("Effective Date") as HTMLInputElement;
    expect(dateInput.value).toBe(expected);
  });

  it("reflects a typed governing law in the preview's Section 9", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Before typing, Section 9 shows the placeholder.
    expect(screen.getByText(/laws of the State of \[Governing Law\]/)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Delaware"), "California");

    expect(
      screen.getByText(/laws of the State of California/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/laws of the State of \[Governing Law\]/),
    ).not.toBeInTheDocument();
  });

  it("updates the signature table when a party name is entered", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // "Jane Doe" placeholder appears for both parties; the first is Party 1.
    await user.type(screen.getAllByPlaceholderText("Jane Doe")[0], "Ada Lovelace");

    const table = screen.getByRole("table");
    expect(within(table).getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("switches the term text to perpetuity when selected", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByLabelText(/In perpetuity/));

    // The preview's Term of Confidentiality now reads "In perpetuity."
    expect(screen.getByText("In perpetuity.")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { defaultNdaData } from "@/lib/defaults";
import NdaForm from "./NdaForm";

function setup() {
  const onChange = vi.fn();
  const onPartyChange = vi.fn();
  render(
    <NdaForm
      data={defaultNdaData}
      onChange={onChange}
      onPartyChange={onPartyChange}
    />,
  );
  return { onChange, onPartyChange };
}

describe("NdaForm", () => {
  it("renders the key agreement fields and both parties", () => {
    setup();
    expect(screen.getByText("Agreement Terms")).toBeInTheDocument();
    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.getByText("Governing Law (State)")).toBeInTheDocument();
    expect(screen.getByText("Party 1")).toBeInTheDocument();
    expect(screen.getByText("Party 2")).toBeInTheDocument();
  });

  it("calls onChange when the governing law field is edited", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.type(screen.getByPlaceholderText("Delaware"), "N");
    expect(onChange).toHaveBeenCalledWith({ governingLaw: "N" });
  });

  it("calls onChange when switching the MNDA term to until-terminated", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.click(screen.getByLabelText(/Continues until terminated/));
    expect(onChange).toHaveBeenCalledWith({ mndaTerm: "untilTerminated" });
  });

  it("disables the confidentiality years input when 'In perpetuity' is selected", () => {
    const onChange = vi.fn();
    render(
      <NdaForm
        data={{ ...defaultNdaData, confidentiality: "perpetuity" }}
        onChange={onChange}
        onPartyChange={vi.fn()}
      />,
    );
    // Two year inputs exist (MNDA term + confidentiality); the confidentiality
    // one is the second and should be disabled.
    const numberInputs = screen.getAllByRole("spinbutton");
    expect(numberInputs[1]).toBeDisabled();
  });

  it("calls onPartyChange when a party field is edited", async () => {
    const user = userEvent.setup();
    const { onPartyChange } = setup();
    // "Acme, Inc." placeholder appears in both party fieldsets; the first is Party 1.
    await user.type(screen.getAllByPlaceholderText("Acme, Inc.")[0], "X");
    expect(onPartyChange).toHaveBeenCalledWith("party1", { company: "X" });
  });
});

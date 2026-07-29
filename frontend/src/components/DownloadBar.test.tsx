import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultNdaData } from "@/lib/defaults";
import type { NdaData } from "@/lib/types";
import DownloadBar from "./DownloadBar";

const withParties: NdaData = {
  ...defaultNdaData,
  party1: { ...defaultNdaData.party1, company: "Acme, Inc." },
  party2: { ...defaultNdaData.party2, company: "Globex LLC" },
};

// jsdom does not implement the object-URL APIs; shim them so the download path runs.
function shimObjectUrl(onCreate?: (blob: Blob) => void) {
  URL.createObjectURL = vi.fn((blob: Blob) => {
    onCreate?.(blob);
    return "blob:mock";
  }) as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;
}

/** Read a Blob's text via FileReader (jsdom's Blob lacks .text()). */
function readBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

/** Capture the filename the anchor would download, then swallow the click. */
function captureDownloadName(target: { name: string }) {
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    target.name = this.download;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(URL, "createObjectURL");
  Reflect.deleteProperty(URL, "revokeObjectURL");
});

describe("DownloadBar", () => {
  it("calls window.print when 'Download PDF' is clicked", async () => {
    const user = userEvent.setup();
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<DownloadBar data={defaultNdaData} />);
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(printSpy).toHaveBeenCalledOnce();
  });

  it("downloads a .md file whose name is derived from the party companies", async () => {
    const user = userEvent.setup();

    let blob: Blob | undefined;
    shimObjectUrl((b) => {
      blob = b;
    });
    const captured = { name: "" };
    captureDownloadName(captured);

    render(<DownloadBar data={withParties} />);
    await user.click(screen.getByRole("button", { name: "Download .md" }));

    expect(captured.name).toBe("mutual-nda-acme-inc-globex-llc.md");
    expect(blob).toBeInstanceOf(Blob);
    const text = await readBlobText(blob!);
    expect(text).toContain("# Mutual Non-Disclosure Agreement");
    expect(text).toContain("| Company | Acme, Inc. | Globex LLC |");
  });

  it("falls back to 'mutual-nda.md' when no company is set", async () => {
    const user = userEvent.setup();
    shimObjectUrl();
    const captured = { name: "" };
    captureDownloadName(captured);

    render(<DownloadBar data={defaultNdaData} />);
    await user.click(screen.getByRole("button", { name: "Download .md" }));

    expect(captured.name).toBe("mutual-nda.md");
  });
});

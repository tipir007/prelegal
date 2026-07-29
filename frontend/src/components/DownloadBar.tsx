"use client";

import { toMarkdown } from "@/lib/toMarkdown";
import type { NdaData } from "@/lib/types";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileBaseName(data: NdaData): string {
  const parts = [data.party1.company, data.party2.company]
    .map(slugify)
    .filter(Boolean);
  return parts.length > 0 ? `mutual-nda-${parts.join("-")}` : "mutual-nda";
}

export default function DownloadBar({ data }: { data: NdaData }) {
  const downloadMarkdown = () => {
    const blob = new Blob([toMarkdown(data)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBaseName(data)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Download PDF
      </button>
      <button
        type="button"
        onClick={downloadMarkdown}
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
      >
        Download .md
      </button>
      <span className="text-xs text-slate-500">
        PDF uses your browser’s “Save as PDF” option.
      </span>
    </div>
  );
}

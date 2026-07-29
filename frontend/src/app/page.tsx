"use client";

import { useEffect, useState } from "react";
import DownloadBar from "@/components/DownloadBar";
import NdaDocument from "@/components/NdaDocument";
import NdaForm from "@/components/NdaForm";
import { defaultNdaData, todayISO } from "@/lib/defaults";
import type { NdaData, Party } from "@/lib/types";

export default function Home() {
  const [data, setData] = useState<NdaData>(defaultNdaData);

  // Set the default Effective Date on the client so the value reflects the
  // user's local "today" rather than a build-time date baked into static HTML.
  useEffect(() => {
    setData((prev) =>
      prev.effectiveDate ? prev : { ...prev, effectiveDate: todayISO() },
    );
  }, []);

  const update = (patch: Partial<NdaData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const updateParty = (which: "party1" | "party2", patch: Partial<Party>) =>
    setData((prev) => ({ ...prev, [which]: { ...prev[which], ...patch } }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="no-print mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Mutual NDA Creator
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Fill in the key terms below and download a ready-to-sign Common Paper
          Mutual Non-Disclosure Agreement. Everything runs in your browser —
          nothing is uploaded.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="no-print">
          <NdaForm data={data} onChange={update} onPartyChange={updateParty} />
        </section>

        <section>
          <div className="lg:sticky lg:top-8">
            <DownloadBar data={data} />
            <div className="print-area mt-4 max-h-[75vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
              <NdaDocument data={data} />
            </div>
          </div>
        </section>
      </div>

      <footer className="no-print mt-10 text-center text-xs text-slate-400">
        Prototype for informational purposes only — not legal advice.
      </footer>
    </main>
  );
}

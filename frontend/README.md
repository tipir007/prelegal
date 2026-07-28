# Prelegal Frontend — Mutual NDA Creator

A prototype web app that generates a [Common Paper Mutual Non-Disclosure
Agreement](https://commonpaper.com/standards/mutual-nda/1.0) from a short form.
Implements Jira issue **PL-3**.

The user fills in the key terms (purpose, dates, term, governing law, and party
details), sees the completed MNDA render live, and downloads it as a **PDF**
(via the browser's print dialog) or as **Markdown**.

## Stack

- [Next.js](https://nextjs.org) 15 (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling
- Fully client-side — no backend, no database, no data leaves the browser

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## How it works

- `src/lib/document.ts` — derives the display text for each Cover Page field and
  holds the 11 sections of the Common Paper MNDA Standard Terms (Version 1.0).
- `src/lib/toMarkdown.ts` — renders the same data to a portable Markdown file.
- `src/components/NdaForm.tsx` — the input form.
- `src/components/NdaDocument.tsx` — the live, print-ready document preview.
- `src/components/DownloadBar.tsx` — PDF (print) and Markdown download actions.

The underlying agreement text comes from the `templates/` directory at the repo
root and is free to use and modify under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

> This prototype is for informational purposes and does not constitute legal advice.

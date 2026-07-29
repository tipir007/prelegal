# Manual Test Plan — Mutual NDA Creator (PL-3)

The automated suite (`npm test`) covers the pure logic, component behavior, and
the form → preview wiring. This document covers what automated tests **cannot**
fully verify: real browser rendering, the actual PDF output, and cross-browser
behavior.

## Setup

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

Run through the scenarios below in at least one Chromium browser and one of
Firefox/Safari.

## Legend

- ⬜ = to test · ✅ = pass · ❌ = fail (file an issue with the step number)

---

## 1. Initial render

| # | Step | Expected | Result |
|---|------|----------|--------|
| 1.1 | Load `/` | Two-column layout: form (left), live document preview (right). No console errors. | ⬜ |
| 1.2 | Inspect the preview on first load | Title "Mutual Non-Disclosure Agreement", Cover Page with the default purpose, today's date as Effective Date, and all 11 Standard Terms. | ⬜ |
| 1.3 | Check unfilled fields | Governing Law / Jurisdiction show the `————` placeholder; Section 9 shows `[Governing Law]` / `[Jurisdiction]`. | ⬜ |

## 2. Live preview updates

| # | Step | Expected | Result |
|---|------|----------|--------|
| 2.1 | Edit **Purpose** | Cover Page "Purpose" updates as you type. | ⬜ |
| 2.2 | Change **Effective Date** | Date re-formats to e.g. "August 1, 2026". | ⬜ |
| 2.3 | Set **MNDA Term** to "Expires 3 years" | Reads "Expires 3 years from the Effective Date." (plural). Set to 1 → "1 year" (singular). | ⬜ |
| 2.4 | Select "Continues until terminated" | Years input disables; term text switches. | ⬜ |
| 2.5 | Toggle **Term of Confidentiality** to "In perpetuity" | Years input disables; text reads "In perpetuity." | ⬜ |
| 2.6 | Fill **Governing Law** = California, **Jurisdiction** = San Francisco County, California | Cover Page fields and Section 9 both reflect the values (no brackets left). | ⬜ |
| 2.7 | Fill **Party 1 / Party 2** details | Signature table Print Name / Title / Company / Notice Address cells update. | ⬜ |
| 2.8 | Enter a multi-line **Notice Address** | Line breaks preserved in the preview cell. | ⬜ |

## 3. Markdown download

| # | Step | Expected | Result |
|---|------|----------|--------|
| 3.1 | Fill both company names, click **Download .md** | File downloads as `mutual-nda-<party1>-<party2>.md`. | ⬜ |
| 3.2 | Open the `.md` in a viewer/GitHub | Renders a complete MNDA: cover fields, signature table (multi-line notice as `<br>`), all 11 sections, CC BY 4.0 footer. | ⬜ |
| 3.3 | Clear both companies, download again | Filename falls back to `mutual-nda.md`. | ⬜ |

## 4. PDF (print) download

| # | Step | Expected | Result |
|---|------|----------|--------|
| 4.1 | Click **Download PDF** | Browser print dialog opens. | ⬜ |
| 4.2 | Inspect the print preview | Only the agreement document is shown — the form, header, buttons, and footer are hidden. | ⬜ |
| 4.3 | Check layout | A4 page, sensible margins, no content clipped at page breaks, signature table intact. | ⬜ |
| 4.4 | Save as PDF and reopen | Matches the on-screen document. | ⬜ |

## 5. Responsive / accessibility

| # | Step | Expected | Result |
|---|------|----------|--------|
| 5.1 | Narrow the window to mobile width | Columns stack; no horizontal scroll; preview still readable. | ⬜ |
| 5.2 | Tab through the form | All inputs reachable; visible focus ring; radio groups labeled. | ⬜ |

## 6. Cross-browser

| # | Browser | 2.x + 3.x + 4.x pass? | Result |
|---|---------|------------------------|--------|
| 6.1 | Chrome/Edge | | ⬜ |
| 6.2 | Firefox | | ⬜ |
| 6.3 | Safari | | ⬜ |

---

### Known limitations (by design for this prototype)

- PDF is produced via the browser's print dialog rather than server-side
  generation, so exact pagination varies slightly by browser.
- No persistence — refreshing the page resets the form.

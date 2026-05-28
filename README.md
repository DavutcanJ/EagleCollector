# 🦅 EagleCollector

**Kamu harcamaları şeffaflık izleyicisi — a public-spending transparency monitor for Turkey.**

EagleCollector brings publicly available information about governmental spending
in Turkey together in one place and links each spending record to the public
officials and ministries institutionally responsible for it. The goal is to
support accountability by making open data understandable and explorable.

> [!IMPORTANT]
> **This version ships with illustrative SAMPLE DATA.**
> All figures are fictional and not official. The **people and parties are
> fictional** and do not represent any real individual — only the **ministry
> institutions are real**. Nothing here may be cited as real data or treated as
> a real allegation. The data model is designed so that real open-data sources
> can be wired in later. See the in-app **Hakkında / About** page for details.

## Features

- **Dashboard (`/`)** — totals, top spending ministries, spending by category and
  by year, and the single largest record.
- **Expenses (`/expenses`)** — searchable, filterable (ministry, category, year)
  and sortable table of spending records, each with a source reference.
- **Expense detail (`/expenses/[id]`)** — full record with linked officials and
  provenance.
- **Politicians (`/politicians`)** — officials ranked by the volume of spending
  they are institutionally associated with, with per-person breakdowns.
- **Ministries (`/ministries`)** — per-ministry totals, category/year breakdowns
  and attached officials.
- **JSON API** — `GET /api/expenses` (filters: `search`, `ministry`, `category`,
  `year`, `sort`), `GET /api/politicians`, `GET /api/ministries`.
- **About (`/about`)** — methodology, disclaimer and the real Turkish open-data
  sources intended for production integration.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS v4
- No external chart/UI libraries — lightweight CSS-based visualisations

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project structure

```
src/
├── app/                 # routes (App Router)
│   ├── page.tsx         # dashboard
│   ├── expenses/        # list + [id] detail
│   ├── politicians/     # list + [id] detail
│   ├── ministries/      # list + [id] detail
│   ├── about/           # methodology & sources
│   └── api/             # JSON endpoints
├── components/          # UI building blocks
├── data/                # sample dataset (parties, ministries, politicians, expenses)
└── lib/                 # types, query/aggregation layer, formatting
```

## Wiring in real data

All dataset access goes through `src/lib/data.ts`. Replace the in-memory arrays
in `src/data/*` with a real source (a database, or ingestion from
[data.gov.tr](https://data.gov.tr), Ministry of Treasury and Finance budget
reports, EKAP procurement notices, Sayıştay audit reports, TBMM records, or KAP
filings) — the rest of the application keeps working unchanged.

> When integrating real records about named individuals, attribute spending only
> to verifiable public sources and present institutional responsibility, not
> personal accusation.

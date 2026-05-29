# 🦅 EagleCollector

**Kamu mali şeffaflık platformu — a public-finance transparency platform for Turkey.**

EagleCollector brings publicly available information about Turkish public bodies
— **ministries, municipalities (belediye), governorships (valilik), district
governorships (kaymakamlık)** and **parliament (TBMM)** — into one platform: their
**transactions** (işlemler), **balance sheets** (bilançolar) and the **officials**
institutionally tied to them. All of it is exposed through a consistent **REST
API** and a **zero-dependency MCP server**, so a frontier LLM can query and
cross-analyse the data.

> [!IMPORTANT]
> **This version ships with illustrative SAMPLE DATA.**
> All figures are fictional. The **people and parties are fictional** and do not
> represent any real individual — only the **institution structure is real**.
> Nothing here may be cited as real data or treated as a real allegation. The
> data model is designed so that real open-data sources can be wired in later.

## Data model

A single unified model (see `src/lib/types.ts`):

- **Institution** — `type` (ministry / municipality / governorship / district-governorship / parliament), `parentId` (e.g. kaymakamlık → valilik), `province`, `headOfficialId`.
- **Official** — `role`, `partyId` (absent for appointed officials), `institutionId`.
- **Transaction** — `type` (expense / revenue / transfer / subsidy / salary), `category`, `counterparty`, `procurementMethod`, `relatedOfficialIds`, `source`.
- **BalanceSheet** — annual `budgetAllocated`, `budgetSpent`, `revenue`, `assets`, `liabilities`.

Everything is cross-linked by stable IDs. **All data access goes through one
query layer** (`src/lib/data.ts`), so the web UI, the REST API and the MCP server
share the same logic — swap the in-memory arrays in `src/data/*` for a real
database or open-data ingestion and nothing else changes.

## Web app

- **Panel (`/`)** — totals, spend by institution type / category / year, transaction-type mix, largest transaction.
- **İşlemler (`/transactions`)** — all money movements, filterable (institution, type, category, year, procurement method, search), sorted and paginated.
- **Kurumlar (`/institutions`)** — every public body, filter by type/province; detail page shows children, officials, balance sheets and transactions.
- **Görevliler (`/officials`)** — officials with their related transaction volume and breakdowns.
- **API & Hakkında (`/about`)** — data model, API reference, MCP usage, real source list.

## REST API (`/api/v1`)

Consistent `{ meta, data }` envelope (meta carries counts, pagination, applied
filters and the sample-data disclaimer).

| Endpoint | Notes |
| --- | --- |
| `GET /api/v1` | Self-describing schema + endpoint index. |
| `GET /api/v1/transactions` | Filters: `search, type, institution, institutionType, category, method, official, year, dateFrom, dateTo, minAmount, maxAmount, counterparty, sort, page, pageSize`. |
| `GET /api/v1/transactions/{id}` | Expanded with institution + officials. |
| `GET /api/v1/institutions` | Filters: `search, type, province, parentId`. |
| `GET /api/v1/institutions/{id}` | + children, officials, balance sheets, summary. |
| `GET /api/v1/officials` | Filters: `search, role, party, institution, province`. |
| `GET /api/v1/officials/{id}` | + related transactions. |
| `GET /api/v1/balance-sheets` | Filters: `institution, year`. |
| `GET /api/v1/stats` | Aggregation: `groupBy` (institution/institutionType/category/year/type/official/party/province) × `metric` (sum/count/avg) + all transaction filters. |

Legacy routes (`/expenses`, `/politicians`, `/ministries`, `/api/expenses`, …)
permanently redirect to their new equivalents.

## MCP server (LLM access)

A zero-dependency MCP server in [`mcp/`](./mcp) wraps the REST API as tools
(`get_schema`, `list_transactions`, `aggregate`, `get_institution`, …) so a
frontier LLM can query and cross-analyse the data directly. See
[`mcp/README.md`](./mcp/README.md). A ready-to-use `.mcp.json` is in the repo
root.

```bash
npm run dev                       # 1) run the app (serves /api/v1)
node mcp/server.mjs               # 2) MCP server (stdio) — or register .mcp.json
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- No external chart/UI libraries; MCP server has zero dependencies

## Wiring in real data

Replace the arrays in `src/data/*` (`institutions`, `officials`, `transactions`,
`balanceSheets`) with real sources — [data.gov.tr](https://data.gov.tr), Treasury
& Finance budget tables, EKAP procurement notices, Sayıştay audit reports, TBMM
records, and municipal/governorship activity reports. The query layer, REST API
and MCP tools stay unchanged.

> When integrating real records about named individuals, attribute spending only
> to verifiable public sources and present institutional responsibility, not
> personal accusation.

# EagleCollector MCP Server

A **zero-dependency** [Model Context Protocol](https://modelcontextprotocol.io)
server that exposes the EagleCollector REST API (`/api/v1`) as tools, so a
frontier LLM (Claude Desktop, Claude Code, Cursor, …) can query Turkish
public-spending data and reason across it.

It is a thin client over the HTTP API — no build step, no packages. Start the
web app first, then point your MCP client at this server.

## Tools

| Tool | Description |
| --- | --- |
| `get_schema` | Data model, entities, fields and relationships. Call first to orient. |
| `list_institutions` | Institutions, filterable by `type`, `province`, `parentId`, `search`. |
| `get_institution` | One institution + children, officials, balance sheets, summary. |
| `list_officials` | Officials, filterable by `role`, `party`, `institution`, `province`. |
| `get_official` | One official + all related transactions + category breakdown. |
| `list_transactions` | Transactions with rich filters (type, institution, category, method, official, year, date range, amount range, counterparty). |
| `get_transaction` | One transaction with institution + officials expanded. |
| `list_balance_sheets` | Annual balance sheets, by `institution` / `year`. |
| `aggregate` | Group transactions by institution / type / category / year / official / party / province; metric `sum` \| `count` \| `avg`. Ideal for cross-queries. |

## Usage

1. **Run the app** (serves the API the MCP server calls):

   ```bash
   npm run dev          # http://localhost:3000
   ```

2. **Register the server** with your MCP client. A ready-made `.mcp.json` is in
   the repo root (works with Claude Code):

   ```json
   {
     "mcpServers": {
       "eaglecollector": {
         "command": "node",
         "args": ["mcp/server.mjs"],
         "env": { "EAGLECOLLECTOR_API_URL": "http://localhost:3000" }
       }
     }
   }
   ```

   For **Claude Desktop**, add the same `mcpServers` block to its config file
   (use an absolute path to `server.mjs`).

3. **Ask away**, e.g.:
   - “İle göre toplam harcamayı çıkar” → `aggregate(groupBy: "province")`
   - “Belediyelerin 2025 doğrudan temin işlemlerini listele” →
     `list_transactions(institutionType: "municipality", method: "direct-procurement", year: 2025)`
   - “Sağlık Bakanlığı'nın bilançosu ile işlem toplamını karşılaştır” →
     `get_institution(id: "saglik")` + `aggregate(...)`

## Config

| Env | Default | Purpose |
| --- | --- | --- |
| `EAGLECOLLECTOR_API_URL` | `http://localhost:3000` | Base URL of the running app. Point at a deployed instance for production. |

## Notes

- Transport: stdio, newline-delimited JSON-RPC 2.0, protocol `2024-11-05`.
- All responses are the API's JSON, including a `disclaimer` field — the data
  is illustrative sample data (fictional persons/parties; real institutions).

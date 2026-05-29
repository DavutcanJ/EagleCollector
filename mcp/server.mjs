#!/usr/bin/env node
// EagleCollector MCP server.
//
// A zero-dependency Model Context Protocol server (stdio transport, JSON-RPC
// 2.0, newline-delimited messages) that exposes the EagleCollector REST API as
// tools. Point a frontier LLM (Claude Desktop, Claude Code, etc.) at this and
// it can query Turkish public-spending data — institutions, officials,
// transactions, balance sheets — and aggregate across them.
//
// It is a thin client over /api/v1, so it always matches the API and needs no
// build step. Run the web app (npm run dev / start) first, then this server.
//
// Config:
//   EAGLECOLLECTOR_API_URL   Base URL of the running app (default http://localhost:3000)

import process from "node:process";

const BASE = (process.env.EAGLECOLLECTOR_API_URL || "http://localhost:3000").replace(/\/$/, "");
const SERVER_INFO = { name: "eaglecollector", version: "1.0.0" };
const PROTOCOL_VERSION = "2024-11-05";

const log = (...args) => process.stderr.write(`[eaglecollector-mcp] ${args.join(" ")}\n`);

// --- REST helper ----------------------------------------------------------

async function api(path, query = {}) {
  const url = new URL(path, BASE + "/");
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) return `API error ${res.status} for ${url.pathname}: ${text}`;
    return text; // already JSON
  } catch (err) {
    return `Failed to reach EagleCollector API at ${url}. Is the app running? (${err.message})`;
  }
}

// --- Tool definitions ------------------------------------------------------

const str = { type: "string" };
const int = { type: "integer" };

const tools = [
  {
    name: "get_schema",
    description:
      "Veri modelini, varlıkları, alanları ve ilişkileri döndürür. Diğer araçları kullanmadan önce sistemi tanımak için çağırın.",
    inputSchema: { type: "object", properties: {} },
    run: () => api("api/v1"),
  },
  {
    name: "list_institutions",
    description:
      "Kamu kurumlarını listeler (bakanlık, belediye, valilik, kaymakamlık, meclis). Türe, ile, üst kuruma veya metne göre filtreler.",
    inputSchema: {
      type: "object",
      properties: {
        type: { ...str, enum: ["ministry", "municipality", "governorship", "district-governorship", "parliament", "agency"] },
        province: str,
        parentId: str,
        search: str,
        page: int,
        pageSize: int,
      },
    },
    run: (a) => api("api/v1/institutions", a),
  },
  {
    name: "get_institution",
    description:
      "Tek bir kurumu döndürür: alt birimleri, görevlileri, bilançoları ve işlem özeti (kategori/yıl bazında) dahil.",
    inputSchema: { type: "object", properties: { id: str }, required: ["id"] },
    run: (a) => api(`api/v1/institutions/${encodeURIComponent(a.id)}`),
  },
  {
    name: "list_officials",
    description:
      "Kamu görevlilerini listeler (bakan, milletvekili, başkan, vali, kaymakam). Role, partiye, kuruma, ile veya metne göre filtreler.",
    inputSchema: {
      type: "object",
      properties: {
        role: str,
        party: str,
        institution: str,
        province: str,
        search: str,
        page: int,
        pageSize: int,
      },
    },
    run: (a) => api("api/v1/officials", a),
  },
  {
    name: "get_official",
    description: "Tek bir görevliyi, ilişkili tüm işlemleri ve kategori dağılımıyla döndürür.",
    inputSchema: { type: "object", properties: { id: str }, required: ["id"] },
    run: (a) => api(`api/v1/officials/${encodeURIComponent(a.id)}`),
  },
  {
    name: "list_transactions",
    description:
      "Mali işlemleri (harcama/gelir/aktarım/destek/maaş) zengin filtrelerle listeler. Tutar TRY cinsindendir.",
    inputSchema: {
      type: "object",
      properties: {
        search: str,
        type: { ...str, enum: ["expense", "revenue", "transfer", "subsidy", "salary"] },
        institution: str,
        institutionType: str,
        category: str,
        method: str,
        official: str,
        year: int,
        dateFrom: { ...str, description: "ISO tarih, dahil (>=)" },
        dateTo: { ...str, description: "ISO tarih, dahil (<=)" },
        minAmount: { type: "number" },
        maxAmount: { type: "number" },
        counterparty: str,
        sort: { ...str, enum: ["date-desc", "date-asc", "amount-desc", "amount-asc", "title-asc"] },
        page: int,
        pageSize: int,
      },
    },
    run: (a) => api("api/v1/transactions", a),
  },
  {
    name: "get_transaction",
    description: "Tek bir işlemi, kurum ve ilgili görevliler genişletilmiş olarak döndürür.",
    inputSchema: { type: "object", properties: { id: str }, required: ["id"] },
    run: (a) => api(`api/v1/transactions/${encodeURIComponent(a.id)}`),
  },
  {
    name: "list_balance_sheets",
    description: "Kurumların yıllık bilançolarını (bütçe/gelir/varlık/borç) döndürür.",
    inputSchema: {
      type: "object",
      properties: { institution: str, year: int },
    },
    run: (a) => api("api/v1/balance-sheets", a),
  },
  {
    name: "aggregate",
    description:
      "İşlemleri bir boyuta göre toplulaştırır. Çapraz sorgular için idealdir (ör. ile göre toplam harcama, partiye göre, yıla göre). Tüm işlem filtreleri uygulanabilir.",
    inputSchema: {
      type: "object",
      properties: {
        groupBy: {
          ...str,
          enum: ["institution", "institutionType", "category", "year", "type", "official", "party", "province"],
        },
        metric: { ...str, enum: ["sum", "count", "avg"] },
        type: str,
        institution: str,
        institutionType: str,
        category: str,
        year: int,
        dateFrom: str,
        dateTo: str,
        minAmount: { type: "number" },
        maxAmount: { type: "number" },
      },
      required: ["groupBy"],
    },
    run: (a) => api("api/v1/stats", a),
  },
];

const toolByName = new Map(tools.map((t) => [t.name, t]));

// --- JSON-RPC plumbing -----------------------------------------------------

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function replyError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handle(msg) {
  const { id, method, params } = msg;
  const isNotification = id === undefined || id === null;

  switch (method) {
    case "initialize":
      reply(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
      return;

    case "notifications/initialized":
      return; // notification, no response

    case "ping":
      if (!isNotification) reply(id, {});
      return;

    case "tools/list":
      reply(id, {
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
      return;

    case "tools/call": {
      const tool = toolByName.get(params?.name);
      if (!tool) {
        replyError(id, -32602, `Unknown tool: ${params?.name}`);
        return;
      }
      try {
        const text = await tool.run(params.arguments || {});
        reply(id, { content: [{ type: "text", text }] });
      } catch (err) {
        reply(id, {
          content: [{ type: "text", text: `Tool error: ${err.message}` }],
          isError: true,
        });
      }
      return;
    }

    default:
      if (!isNotification) replyError(id, -32601, `Method not found: ${method}`);
  }
}

// --- stdio transport (newline-delimited JSON) ------------------------------

let buffer = "";
let inFlight = 0;
let ended = false;
const maybeExit = () => {
  if (ended && inFlight === 0) process.exit(0);
};

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      log("Failed to parse line:", line);
      continue;
    }
    inFlight++;
    handle(msg)
      .catch((err) => log("Handler error:", err.message))
      .finally(() => {
        inFlight--;
        maybeExit();
      });
  }
});

// Don't exit while async tool calls are still in flight (the stdin pipe may
// close immediately in non-interactive use).
process.stdin.on("end", () => {
  ended = true;
  maybeExit();
});
log(`ready · API base = ${BASE}`);

// Shared helpers for the /api/v1 REST surface: a consistent JSON envelope and
// query-parameter parsing. The same shapes are wrapped by the MCP server.

export const DISCLAIMER =
  "Sample data — figures are illustrative; persons and parties are fictional. Only institution structure is real.";

export interface Meta {
  count: number;
  total?: number;
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
  disclaimer: string;
  [key: string]: unknown;
}

/** Build a consistent JSON response with caching headers suitable for an LLM/API client. */
export function ok(data: unknown, meta: Partial<Meta> = {}) {
  const count = Array.isArray(data) ? data.length : 1;
  const body = {
    meta: { count, disclaimer: DISCLAIMER, ...meta },
    data,
  };
  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}

export function notFound(message = "Not found") {
  return Response.json(
    { error: { status: 404, message }, disclaimer: DISCLAIMER },
    { status: 404 },
  );
}

/** Drop undefined/empty entries so `meta.filters` only echoes applied filters. */
export function cleanFilters<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out as Partial<T>;
}

export function num(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function str(value: string | null): string | undefined {
  return value == null || value === "" ? undefined : value;
}

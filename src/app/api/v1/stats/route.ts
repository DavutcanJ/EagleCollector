import type { NextRequest } from "next/server";
import { ok, cleanFilters, num, str } from "@/lib/api";
import {
  queryTransactions,
  aggregateTransactions,
  type TransactionQuery,
  type GroupBy,
  type Metric,
} from "@/lib/data";

const GROUPS: GroupBy[] = [
  "institution",
  "institutionType",
  "category",
  "year",
  "type",
  "official",
  "party",
  "province",
];
const METRICS: Metric[] = ["sum", "count", "avg"];

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const groupBy = (str(sp.get("groupBy")) as GroupBy) ?? "institution";
  const metric = (str(sp.get("metric")) as Metric) ?? "sum";

  if (!GROUPS.includes(groupBy)) {
    return Response.json(
      { error: { status: 400, message: `groupBy must be one of: ${GROUPS.join(", ")}` } },
      { status: 400 },
    );
  }
  if (!METRICS.includes(metric)) {
    return Response.json(
      { error: { status: 400, message: `metric must be one of: ${METRICS.join(", ")}` } },
      { status: 400 },
    );
  }

  // Apply the same transaction filters as the list endpoint, then aggregate.
  const query: TransactionQuery = {
    search: str(sp.get("search")),
    type: str(sp.get("type")),
    institutionId: str(sp.get("institution")),
    institutionType: str(sp.get("institutionType")),
    category: str(sp.get("category")),
    procurementMethod: str(sp.get("method")),
    officialId: str(sp.get("official")),
    year: num(sp.get("year")),
    dateFrom: str(sp.get("dateFrom")),
    dateTo: str(sp.get("dateTo")),
    minAmount: num(sp.get("minAmount")),
    maxAmount: num(sp.get("maxAmount")),
    pageSize: 0,
  };

  const items = queryTransactions(query).data;
  const groups = aggregateTransactions(items, groupBy, metric);

  return ok(groups, {
    groupBy,
    metric,
    matchedTransactions: items.length,
    totalTry: items.reduce((s, t) => s + t.amountTry, 0),
    filters: cleanFilters({ ...query, pageSize: undefined }),
  });
}

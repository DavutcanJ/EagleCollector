import type { NextRequest } from "next/server";
import { ok, cleanFilters, num, str } from "@/lib/api";
import { queryTransactions, type TransactionQuery } from "@/lib/data";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

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
    counterparty: str(sp.get("counterparty")),
    sort: (str(sp.get("sort")) as TransactionQuery["sort"]) ?? "date-desc",
    page: num(sp.get("page")) ?? 1,
    pageSize: num(sp.get("pageSize")) ?? 50,
  };

  const { data, total, page, pageSize } = queryTransactions(query);
  const sumTry = data.reduce((s, t) => s + t.amountTry, 0);

  return ok(data, {
    total,
    page,
    pageSize,
    sumTryOnPage: sumTry,
    filters: cleanFilters({ ...query, page: undefined, pageSize: undefined, sort: query.sort }),
  });
}

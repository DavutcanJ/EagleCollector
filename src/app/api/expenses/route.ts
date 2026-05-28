import type { NextRequest } from "next/server";
import { getExpenses, type ExpenseFilters } from "@/lib/data";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const filters: ExpenseFilters = {
    search: sp.get("search") ?? undefined,
    ministryId: sp.get("ministry") ?? undefined,
    category: sp.get("category") ?? undefined,
    year: sp.get("year") ?? undefined,
    sort: (sp.get("sort") as ExpenseFilters["sort"]) ?? undefined,
  };

  const data = getExpenses(filters);
  const total = data.reduce((s, e) => s + e.amountTry, 0);

  return Response.json({
    meta: {
      count: data.length,
      totalTry: total,
      disclaimer:
        "Sample data — figures, persons and parties are illustrative and not official.",
    },
    data,
  });
}

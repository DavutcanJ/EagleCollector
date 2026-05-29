import type { NextRequest } from "next/server";
import { ok, cleanFilters, num, str } from "@/lib/api";
import { queryBalanceSheets } from "@/lib/data";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const institutionId = str(sp.get("institution"));
  const year = num(sp.get("year"));

  const data = queryBalanceSheets({ institutionId, year });
  return ok(data, { filters: cleanFilters({ institution: institutionId, year }) });
}

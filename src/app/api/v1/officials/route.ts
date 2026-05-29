import type { NextRequest } from "next/server";
import { ok, cleanFilters, num, str } from "@/lib/api";
import { queryOfficials, transactionsForOfficial, isSpend, type OfficialQuery } from "@/lib/data";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const query: OfficialQuery = {
    search: str(sp.get("search")),
    role: str(sp.get("role")),
    partyId: str(sp.get("party")),
    institutionId: str(sp.get("institution")),
    province: str(sp.get("province")),
    page: num(sp.get("page")) ?? 1,
    pageSize: num(sp.get("pageSize")) ?? 100,
  };

  const { data, total, page, pageSize } = queryOfficials(query);

  const enriched = data.map((o) => {
    const txs = transactionsForOfficial(o.id);
    return {
      ...o,
      relatedTransactionCount: txs.length,
      relatedSpendTry: txs.filter(isSpend).reduce((s, t) => s + t.amountTry, 0),
    };
  });

  return ok(enriched, {
    total,
    page,
    pageSize,
    filters: cleanFilters({
      search: query.search,
      role: query.role,
      party: query.partyId,
      institution: query.institutionId,
      province: query.province,
    }),
  });
}

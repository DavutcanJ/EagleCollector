import type { NextRequest } from "next/server";
import { ok, cleanFilters, num, str } from "@/lib/api";
import { queryInstitutions, type InstitutionQuery } from "@/lib/data";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const query: InstitutionQuery = {
    search: str(sp.get("search")),
    type: str(sp.get("type")),
    province: str(sp.get("province")),
    parentId: str(sp.get("parentId")),
    page: num(sp.get("page")) ?? 1,
    pageSize: num(sp.get("pageSize")) ?? 100,
  };

  const { data, total, page, pageSize } = queryInstitutions(query);
  return ok(data, {
    total,
    page,
    pageSize,
    filters: cleanFilters({ search: query.search, type: query.type, province: query.province, parentId: query.parentId }),
  });
}

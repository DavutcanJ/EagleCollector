import type { NextRequest } from "next/server";
import { ok, notFound } from "@/lib/api";
import { transactionById } from "@/data/transactions";
import { institutionById } from "@/data/institutions";
import { officialById } from "@/data/officials";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/v1/transactions/[id]">) {
  const { id } = await ctx.params;
  const tx = transactionById(id);
  if (!tx) return notFound(`Transaction '${id}' not found`);

  return ok({
    ...tx,
    institution: institutionById(tx.institutionId) ?? null,
    relatedOfficials: tx.relatedOfficialIds
      .map((oid) => officialById(oid))
      .filter((o) => o !== undefined),
  });
}

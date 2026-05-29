import type { NextRequest } from "next/server";
import { ok, notFound } from "@/lib/api";
import { officialById } from "@/data/officials";
import { institutionById } from "@/data/institutions";
import { partyById } from "@/data/parties";
import { transactionsForOfficial, aggregateTransactions, isSpend } from "@/lib/data";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/v1/officials/[id]">) {
  const { id } = await ctx.params;
  const official = officialById(id);
  if (!official) return notFound(`Official '${id}' not found`);

  const txs = transactionsForOfficial(official.id);
  const spendTxs = txs.filter(isSpend);

  return ok({
    ...official,
    party: official.partyId ? partyById(official.partyId) ?? null : null,
    institution: official.institutionId ? institutionById(official.institutionId) ?? null : null,
    transactions: txs,
    summary: {
      transactionCount: txs.length,
      spendTry: spendTxs.reduce((s, t) => s + t.amountTry, 0),
      byCategory: aggregateTransactions(spendTxs, "category"),
    },
  });
}

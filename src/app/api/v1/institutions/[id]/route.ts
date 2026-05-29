import type { NextRequest } from "next/server";
import { ok, notFound } from "@/lib/api";
import { institutionById } from "@/data/institutions";
import {
  childrenOf,
  officialsForInstitution,
  transactionsForInstitution,
  balanceSheetsForInstitution,
  aggregateTransactions,
  isSpend,
} from "@/lib/data";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/v1/institutions/[id]">) {
  const { id } = await ctx.params;
  const inst = institutionById(id);
  if (!inst) return notFound(`Institution '${id}' not found`);

  const txs = transactionsForInstitution(inst.id);
  const spendTxs = txs.filter(isSpend);

  return ok({
    ...inst,
    parent: inst.parentId ? institutionById(inst.parentId) ?? null : null,
    children: childrenOf(inst.id),
    officials: officialsForInstitution(inst.id),
    balanceSheets: balanceSheetsForInstitution(inst.id),
    summary: {
      transactionCount: txs.length,
      spendTry: spendTxs.reduce((s, t) => s + t.amountTry, 0),
      revenueTry: txs.filter((t) => t.type === "revenue").reduce((s, t) => s + t.amountTry, 0),
      byCategory: aggregateTransactions(spendTxs, "category"),
      byYear: aggregateTransactions(spendTxs, "year"),
    },
  });
}

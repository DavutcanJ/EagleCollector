import Link from "next/link";
import type { Transaction } from "@/lib/types";
import { institutionById } from "@/data/institutions";
import { formatDate, formatTry } from "@/lib/format";
import { CategoryBadge, TransactionTypeBadge } from "@/components/Badge";

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
        Bu filtrelerle eşleşen işlem bulunamadı.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">İşlem</th>
            <th className="px-4 py-3 font-medium">Kurum</th>
            <th className="px-4 py-3 font-medium">Tür</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Tarih</th>
            <th className="px-4 py-3 text-right font-medium">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const inst = institutionById(t.institutionId);
            return (
              <tr
                key={t.id}
                className="border-b border-border last:border-0 hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/transactions/${t.id}`}
                    className="font-medium text-foreground hover:text-brand"
                  >
                    {t.title}
                  </Link>
                  {t.counterparty ? (
                    <p className="mt-0.5 text-xs text-muted">{t.counterparty}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted">
                  {inst ? (
                    <Link href={`/institutions/${inst.id}`} className="hover:text-brand">
                      {inst.shortName}
                    </Link>
                  ) : (
                    t.institutionId
                  )}
                </td>
                <td className="px-4 py-3">
                  <TransactionTypeBadge type={t.type} />
                </td>
                <td className="px-4 py-3">
                  {t.category ? <CategoryBadge category={t.category} /> : <span className="text-muted">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatTry(t.amountTry)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

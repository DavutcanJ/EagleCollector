import Link from "next/link";
import type { Expense } from "@/lib/types";
import { ministryById } from "@/data/ministries";
import { formatDate, formatTry } from "@/lib/format";
import { CategoryBadge } from "@/components/Badge";

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-muted">
        Bu filtrelerle eşleşen harcama kaydı bulunamadı.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Harcama</th>
            <th className="px-4 py-3 font-medium">Bakanlık</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Tarih</th>
            <th className="px-4 py-3 text-right font-medium">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr
              key={e.id}
              className="border-b border-border last:border-0 hover:bg-surface-muted/60"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/expenses/${e.id}`}
                  className="font-medium text-foreground hover:text-brand"
                >
                  {e.title}
                </Link>
                {e.vendor ? (
                  <p className="mt-0.5 text-xs text-muted">Yüklenici: {e.vendor}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-muted">
                {ministryById(e.ministryId)?.shortName ?? e.ministryId}
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={e.category} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted">
                {formatDate(e.date)}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">
                {formatTry(e.amountTry)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

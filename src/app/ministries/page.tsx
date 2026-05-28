import type { Metadata } from "next";
import Link from "next/link";
import { ministries, expensesForMinistry } from "@/lib/data";
import { politicianById } from "@/data/politicians";
import { formatTry, formatTryCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bakanlıklar",
  description: "Bakanlık bazında toplam harcama ve kayıt sayıları.",
};

export default function MinistriesPage() {
  const rows = ministries
    .map((m) => {
      const items = expensesForMinistry(m.id);
      return {
        ministry: m,
        count: items.length,
        total: items.reduce((s, e) => s + e.amountTry, 0),
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Bakanlıklar</h1>
        <p className="mt-2 text-muted">
          Bakanlık kurumları gerçektir; bütçe ve harcama rakamları örnek veridir.
          Toplam, veri kümesindeki kayıtlardan hesaplanır.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(({ ministry: m, count, total }) => {
          const minister = m.ministerId ? politicianById(m.ministerId) : undefined;
          return (
            <Link
              key={m.id}
              href={`/ministries/${m.id}`}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-brand"
            >
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-muted">{m.nameEn}</p>
              {minister ? (
                <p className="mt-2 text-sm text-muted">Bakan: {minister.name}</p>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted">İzlenen harcama</p>
                  <p className="font-semibold tabular-nums">
                    {formatTryCompact(total)}
                  </p>
                  <p className="text-xs text-muted">{count} kayıt</p>
                </div>
                <div>
                  <p className="text-xs text-muted">
                    {m.budgetYear} bütçesi (örnek)
                  </p>
                  <p className="font-semibold tabular-nums">
                    {formatTryCompact(m.annualBudgetTry)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-muted">
        Toplam izlenen bütçe (örnek):{" "}
        {formatTry(ministries.reduce((s, m) => s + m.annualBudgetTry, 0))}
      </p>
    </div>
  );
}

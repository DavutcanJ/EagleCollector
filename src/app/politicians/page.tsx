import type { Metadata } from "next";
import Link from "next/link";
import { politicians, expensesForPolitician } from "@/lib/data";
import { ministryById } from "@/data/ministries";
import { PartyBadge } from "@/components/Badge";
import { formatTryCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Siyasetçiler",
  description: "Kamu görevlileri ve ilişkilendirildikleri harcama hacmi.",
};

export default function PoliticiansPage() {
  const rows = politicians
    .map((p) => {
      const items = expensesForPolitician(p.id);
      return {
        politician: p,
        count: items.length,
        total: items.reduce((s, e) => s + e.amountTry, 0),
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Siyasetçiler</h1>
        <p className="mt-2 text-muted">
          Kamu görevlilerinin rolleri ve ilişkilendirildikleri harcama kayıtları.
          Bağlantı, görevlinin harcamayı kişisel olarak yaptığı anlamına gelmez;
          ilgili kurumsal sorumluluğu gösterir.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ politician: p, count, total }) => (
          <Link
            key={p.id}
            href={`/politicians/${p.id}`}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-brand"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted">{p.role}</p>
              </div>
              <PartyBadge partyId={p.partyId} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {p.ministryId
                ? ministryById(p.ministryId)?.shortName
                : (p.region ?? "—")}
            </p>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-xs text-muted">{count} kayıt</span>
              <span className="font-semibold tabular-nums">
                {formatTryCompact(total)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

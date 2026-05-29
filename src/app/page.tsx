import Link from "next/link";
import StatCard from "@/components/StatCard";
import BarList from "@/components/BarList";
import { CategoryBadge, TransactionTypeBadge } from "@/components/Badge";
import { getDashboardStats } from "@/lib/data";
import { institutionById } from "@/data/institutions";
import { formatTry, formatTryCompact, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Kamu Mali Şeffaflık Panosu
        </h1>
        <p className="mt-2 max-w-3xl text-muted">
          Türkiye&apos;de bakanlıklar, belediyeler, valilikler ve kaymakamlıklar
          gibi kamu kurumlarının mali işlemlerini, görevlilerini ve bilançolarını
          tek platformda izleyin. Veriler tutarlı bir REST API ve MCP üzerinden de
          sorgulanabilir.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Toplam Harcama"
          value={formatTryCompact(stats.totalSpend)}
          hint={formatTry(stats.totalSpend)}
        />
        <StatCard
          label="Toplam Gelir"
          value={formatTryCompact(stats.totalRevenue)}
          hint="izlenen gelir"
        />
        <StatCard
          label="Kurum"
          value={String(stats.institutionCount)}
          hint="bakanlık/belediye/valilik…"
        />
        <StatCard
          label="Görevli"
          value={String(stats.officialCount)}
          hint="izlenen kişi"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Kurum türüne göre harcama</h2>
            <Link href="/institutions" className="text-sm text-brand hover:underline">
              Kurumlar →
            </Link>
          </div>
          <BarList items={stats.byInstitutionType} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Kategoriye göre harcama</h2>
            <Link href="/transactions" className="text-sm text-brand hover:underline">
              İşlemler →
            </Link>
          </div>
          <BarList items={stats.byCategory} color="var(--accent)" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">En çok harcayan kurumlar</h2>
          <BarList items={stats.topInstitutions} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Yıllara göre harcama</h2>
          <BarList items={stats.byYear} color="#16a34a" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">İşlem türü dağılımı</h2>
          <BarList items={stats.byType} color="#9333ea" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold">En büyük tek işlem</h2>
          <Link
            href={`/transactions/${stats.largestTransaction.id}`}
            className="block rounded-lg border border-border p-4 transition-colors hover:border-brand hover:bg-surface-muted/50"
          >
            <div className="flex flex-wrap items-center gap-2">
              <TransactionTypeBadge type={stats.largestTransaction.type} />
              {stats.largestTransaction.category ? (
                <CategoryBadge category={stats.largestTransaction.category} />
              ) : null}
              <span className="text-xs text-muted">
                {institutionById(stats.largestTransaction.institutionId)?.shortName}
              </span>
            </div>
            <p className="mt-2 font-medium">{stats.largestTransaction.title}</p>
            <p className="mt-1 text-sm text-muted">
              {formatDate(stats.largestTransaction.date)}
            </p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {formatTry(stats.largestTransaction.amountTry)}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

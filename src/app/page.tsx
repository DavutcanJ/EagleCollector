import Link from "next/link";
import StatCard from "@/components/StatCard";
import BarList from "@/components/BarList";
import { CategoryBadge } from "@/components/Badge";
import { getDashboardStats } from "@/lib/data";
import { ministryById } from "@/data/ministries";
import { formatTry, formatTryCompact, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Kamu Harcamaları Panosu
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Türkiye&apos;de bakanlık bazında kamu harcamalarını ve bu harcamalarla
          ilişkili kamu görevlilerini açık veri ilkesiyle izleyin. Aşağıdaki
          özet, veri kümesindeki tüm kayıtları kapsar.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Toplam Harcama"
          value={formatTryCompact(stats.totalSpend)}
          hint={formatTry(stats.totalSpend)}
        />
        <StatCard label="Kayıt Sayısı" value={String(stats.recordCount)} hint="harcama kaydı" />
        <StatCard label="Bakanlık" value={String(stats.ministryCount)} hint="izlenen kurum" />
        <StatCard
          label="Kamu Görevlisi"
          value={String(stats.politicianCount)}
          hint="izlenen kişi"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">En çok harcayan bakanlıklar</h2>
            <Link href="/ministries" className="text-sm text-brand hover:underline">
              Tümü →
            </Link>
          </div>
          <BarList items={stats.topMinistries} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Kategoriye göre harcama</h2>
            <Link href="/expenses" className="text-sm text-brand hover:underline">
              Filtrele →
            </Link>
          </div>
          <BarList items={stats.topCategories} color="var(--accent)" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:col-span-1">
          <h2 className="mb-4 font-semibold">Yıllara göre harcama</h2>
          <BarList items={stats.byYear} color="#16a34a" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold">En büyük tek harcama kaydı</h2>
          <Link
            href={`/expenses/${stats.largestExpense.id}`}
            className="block rounded-lg border border-border p-4 transition-colors hover:border-brand hover:bg-surface-muted/50"
          >
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={stats.largestExpense.category} />
              <span className="text-xs text-muted">
                {ministryById(stats.largestExpense.ministryId)?.shortName}
              </span>
            </div>
            <p className="mt-2 font-medium">{stats.largestExpense.title}</p>
            <p className="mt-1 text-sm text-muted">
              {formatDate(stats.largestExpense.date)}
            </p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {formatTry(stats.largestExpense.amountTry)}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

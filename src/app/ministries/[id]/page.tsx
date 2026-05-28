import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ministryById,
  expensesForMinistry,
  totalsByCategory,
  totalsByYear,
  politicians,
} from "@/lib/data";
import { ministries } from "@/data/ministries";
import { politicianById } from "@/data/politicians";
import ExpenseTable from "@/components/ExpenseTable";
import BarList from "@/components/BarList";
import StatCard from "@/components/StatCard";
import { PartyBadge } from "@/components/Badge";
import { formatTry, formatTryCompact } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return ministries.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const m = ministryById(id);
  return { title: m?.name ?? "Bakanlık bulunamadı" };
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const ministry = ministryById(id);
  if (!ministry) notFound();

  const items = expensesForMinistry(ministry.id);
  const total = items.reduce((s, e) => s + e.amountTry, 0);
  const minister = ministry.ministerId
    ? politicianById(ministry.ministerId)
    : undefined;
  const officials = politicians.filter((p) => p.ministryId === ministry.id);
  const byCategory = totalsByCategory(items);
  const byYear = totalsByYear(items);

  return (
    <div className="space-y-6">
      <Link href="/ministries" className="text-sm text-brand hover:underline">
        ← Bakanlıklara dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{ministry.name}</h1>
        <p className="mt-1 text-muted">{ministry.nameEn}</p>
        {minister ? (
          <p className="mt-3 text-sm">
            Bakan:{" "}
            <Link
              href={`/politicians/${minister.id}`}
              className="text-brand hover:underline"
            >
              {minister.name}
            </Link>
          </p>
        ) : null}
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="İzlenen harcama"
          value={formatTryCompact(total)}
          hint={formatTry(total)}
        />
        <StatCard label="Kayıt" value={String(items.length)} hint="harcama kaydı" />
        <StatCard
          label={`${ministry.budgetYear} bütçesi`}
          value={formatTryCompact(ministry.annualBudgetTry)}
          hint="örnek bütçe"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Kategoriye göre</h2>
          <BarList items={byCategory} color="var(--accent)" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Yıllara göre</h2>
          <BarList items={byYear} color="#16a34a" />
        </div>
      </div>

      {officials.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Bağlı kamu görevlileri</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {officials.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/politicians/${p.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-brand hover:bg-surface-muted/50"
                >
                  <span>
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-xs text-muted">{p.role}</span>
                  </span>
                  <PartyBadge partyId={p.partyId} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold">Harcama kayıtları</h2>
        <ExpenseTable expenses={items} />
      </section>
    </div>
  );
}

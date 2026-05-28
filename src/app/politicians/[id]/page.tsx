import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { politicianById, expensesForPolitician, totalsByCategory } from "@/lib/data";
import { politicians } from "@/data/politicians";
import { partyById } from "@/data/parties";
import { ministryById } from "@/data/ministries";
import ExpenseTable from "@/components/ExpenseTable";
import BarList from "@/components/BarList";
import { PartyBadge } from "@/components/Badge";
import { formatTry, formatDate } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return politicians.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const p = politicianById(id);
  return { title: p?.name ?? "Kişi bulunamadı" };
}

export default async function PoliticianDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const politician = politicianById(id);
  if (!politician) notFound();

  const party = partyById(politician.partyId);
  const ministry = politician.ministryId
    ? ministryById(politician.ministryId)
    : undefined;
  const items = expensesForPolitician(politician.id);
  const total = items.reduce((s, e) => s + e.amountTry, 0);
  const byCategory = totalsByCategory(items);

  return (
    <div className="space-y-6">
      <Link href="/politicians" className="text-sm text-brand hover:underline">
        ← Siyasetçilere dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {politician.name}
          </h1>
          <PartyBadge partyId={politician.partyId} />
        </div>
        <p className="mt-1 text-muted">
          {politician.role}
          {party ? ` · ${party.name}` : ""}
          {politician.region ? ` · ${politician.region}` : ""}
        </p>
        <p className="mt-4 max-w-3xl text-muted">{politician.bio}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">
              İlişkili toplam
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatTry(total)}
            </p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Kayıt</p>
            <p className="mt-1 text-xl font-semibold">{items.length}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Göreve başlama</p>
            <p className="mt-1 text-lg font-medium">{formatDate(politician.since)}</p>
          </div>
        </div>

        {ministry ? (
          <p className="mt-4 text-sm text-muted">
            Bağlı kurum:{" "}
            <Link href={`/ministries/${ministry.id}`} className="text-brand hover:underline">
              {ministry.name}
            </Link>
          </p>
        ) : null}
      </div>

      {byCategory.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Kategoriye göre dağılım</h2>
          <BarList items={byCategory} color="var(--accent)" />
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold">İlişkili harcama kayıtları</h2>
        <ExpenseTable expenses={items} />
      </section>
    </div>
  );
}

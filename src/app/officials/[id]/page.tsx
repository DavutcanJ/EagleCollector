import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { officials, officialById, officialRoleLabels } from "@/data/officials";
import { partyById } from "@/data/parties";
import { institutionById } from "@/data/institutions";
import {
  transactionsForOfficial,
  aggregateTransactions,
  isSpend,
} from "@/lib/data";
import TransactionTable from "@/components/TransactionTable";
import BarList from "@/components/BarList";
import { PartyBadge } from "@/components/Badge";
import { formatTry, formatDate } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return officials.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: officialById(id)?.name ?? "Görevli bulunamadı" };
}

export default async function OfficialDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const official = officialById(id);
  if (!official) notFound();

  const party = official.partyId ? partyById(official.partyId) : undefined;
  const inst = official.institutionId ? institutionById(official.institutionId) : undefined;
  const txs = transactionsForOfficial(official.id);
  const spendTxs = txs.filter(isSpend);
  const spend = spendTxs.reduce((s, t) => s + t.amountTry, 0);
  const byCategory = aggregateTransactions(spendTxs, "category");

  return (
    <div className="space-y-6">
      <Link href="/officials" className="text-sm text-brand hover:underline">
        ← Görevlilere dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{official.name}</h1>
          <PartyBadge partyId={official.partyId} />
        </div>
        <p className="mt-1 text-muted">
          {officialRoleLabels[official.role]}
          {party ? ` · ${party.name}` : ""}
          {official.province ? ` · ${official.province}` : ""}
          {official.district ? ` / ${official.district}` : ""}
        </p>
        <p className="mt-4 max-w-3xl text-muted">{official.bio}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">İlişkili harcama</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatTry(spend)}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">İşlem</p>
            <p className="mt-1 text-xl font-semibold">{txs.length}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Göreve başlama</p>
            <p className="mt-1 text-lg font-medium">{formatDate(official.since)}</p>
          </div>
        </div>

        {inst ? (
          <p className="mt-4 text-sm text-muted">
            Kurum:{" "}
            <Link href={`/institutions/${inst.id}`} className="text-brand hover:underline">
              {inst.name}
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
        <h2 className="mb-3 font-semibold">İlişkili işlemler</h2>
        <TransactionTable transactions={txs} />
      </section>
    </div>
  );
}

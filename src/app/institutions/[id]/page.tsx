import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { institutions, institutionById } from "@/data/institutions";
import { officialById } from "@/data/officials";
import {
  transactionsForInstitution,
  officialsForInstitution,
  childrenOf,
  balanceSheetsForInstitution,
  aggregateTransactions,
  isSpend,
} from "@/lib/data";
import TransactionTable from "@/components/TransactionTable";
import BarList from "@/components/BarList";
import StatCard from "@/components/StatCard";
import { InstitutionTypeBadge, PartyBadge } from "@/components/Badge";
import { formatTry, formatTryCompact } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return institutions.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: institutionById(id)?.name ?? "Kurum bulunamadı" };
}

export default async function InstitutionDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const inst = institutionById(id);
  if (!inst) notFound();

  const head = inst.headOfficialId ? officialById(inst.headOfficialId) : undefined;
  const parent = inst.parentId ? institutionById(inst.parentId) : undefined;
  const children = childrenOf(inst.id);
  const officials = officialsForInstitution(inst.id);
  const txs = transactionsForInstitution(inst.id);
  const spendTxs = txs.filter(isSpend);
  const spend = spendTxs.reduce((s, t) => s + t.amountTry, 0);
  const revenue = txs.filter((t) => t.type === "revenue").reduce((s, t) => s + t.amountTry, 0);
  const byCategory = aggregateTransactions(spendTxs, "category");
  const byYear = aggregateTransactions(spendTxs, "year").sort((a, b) => a.key.localeCompare(b.key));
  const sheets = balanceSheetsForInstitution(inst.id);

  return (
    <div className="space-y-6">
      <Link href="/institutions" className="text-sm text-brand hover:underline">
        ← Kurumlara dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <InstitutionTypeBadge type={inst.type} />
          {parent ? (
            <Link href={`/institutions/${parent.id}`} className="text-xs text-muted hover:text-brand">
              {parent.name} ↑
            </Link>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{inst.name}</h1>
        <p className="mt-1 text-muted">{inst.nameEn}</p>
        <p className="mt-2 text-sm text-muted">
          {inst.province ? `İl: ${inst.province}` : ""}
          {inst.district ? ` · İlçe: ${inst.district}` : ""}
        </p>
        {head ? (
          <p className="mt-3 text-sm">
            Yönetici:{" "}
            <Link href={`/officials/${head.id}`} className="text-brand hover:underline">
              {head.name}
            </Link>{" "}
            <span className="text-muted">({head.role})</span>
          </p>
        ) : null}
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="İzlenen harcama" value={formatTryCompact(spend)} hint={formatTry(spend)} />
        <StatCard label="İzlenen gelir" value={formatTryCompact(revenue)} hint="gelir işlemleri" />
        <StatCard label="İşlem" value={String(txs.length)} hint="kayıt" />
        <StatCard label="Görevli" value={String(officials.length)} hint="bağlı kişi" />
      </section>

      {sheets.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Bilançolar (örnek)</h2>
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4 font-medium">Yıl</th>
                <th className="py-2 pr-4 text-right font-medium">Bütçe</th>
                <th className="py-2 pr-4 text-right font-medium">Harcanan</th>
                <th className="py-2 pr-4 text-right font-medium">Gelir</th>
                <th className="py-2 pr-4 text-right font-medium">Varlık</th>
                <th className="py-2 text-right font-medium">Borç</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium">{b.year}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatTryCompact(b.budgetAllocatedTry)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatTryCompact(b.budgetSpentTry)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatTryCompact(b.revenueTry)}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatTryCompact(b.assetsTry)}</td>
                  <td className="py-2 text-right tabular-nums">{formatTryCompact(b.liabilitiesTry)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {spendTxs.length > 0 ? (
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
      ) : null}

      {children.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Alt birimler</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {children.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/institutions/${c.id}`}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 hover:border-brand hover:bg-surface-muted/50"
                >
                  <InstitutionTypeBadge type={c.type} />
                  <span className="font-medium">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {officials.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Bağlı görevliler</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {officials.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/officials/${o.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-brand hover:bg-surface-muted/50"
                >
                  <span>
                    <span className="font-medium">{o.name}</span>
                    <span className="ml-2 text-xs text-muted">{o.role}</span>
                  </span>
                  <PartyBadge partyId={o.partyId} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold">İşlemler</h2>
        <TransactionTable transactions={txs} />
      </section>
    </div>
  );
}

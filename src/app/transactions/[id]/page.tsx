import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { transactions, transactionById, procurementMethodLabels } from "@/data/transactions";
import { institutionById } from "@/data/institutions";
import { officialById } from "@/data/officials";
import {
  CategoryBadge,
  PartyBadge,
  TransactionTypeBadge,
  InstitutionTypeBadge,
} from "@/components/Badge";
import { formatTry, formatDate } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return transactions.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: transactionById(id)?.title ?? "İşlem bulunamadı" };
}

export default async function TransactionDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const tx = transactionById(id);
  if (!tx) notFound();

  const inst = institutionById(tx.institutionId);
  const related = tx.relatedOfficialIds
    .map((oid) => officialById(oid))
    .filter((o) => o !== undefined);

  return (
    <div className="space-y-6">
      <Link href="/transactions" className="text-sm text-brand hover:underline">
        ← İşlemlere dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <TransactionTypeBadge type={tx.type} />
          {tx.category ? <CategoryBadge category={tx.category} /> : null}
          {inst ? (
            <Link href={`/institutions/${inst.id}`} className="text-xs text-muted hover:text-brand">
              {inst.name}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{tx.title}</h1>
        <p className="mt-3 max-w-3xl text-muted">{tx.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Tutar</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatTry(tx.amountTry)}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Tarih</p>
            <p className="mt-1 text-lg font-medium">{formatDate(tx.date)}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Taraf</p>
            <p className="mt-1 text-lg font-medium">{tx.counterparty ?? "—"}</p>
          </div>
        </div>

        {tx.procurementMethod ? (
          <p className="mt-4 text-sm text-muted">
            İhale usulü:{" "}
            <span className="font-medium text-foreground">
              {procurementMethodLabels[tx.procurementMethod]}
            </span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold">İlgili görevliler</h2>
          {related.length === 0 ? (
            <p className="mt-3 text-sm text-muted">İlişkilendirilmiş görevli yok.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {related.map((o) => (
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
          )}
          {inst ? (
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
              <InstitutionTypeBadge type={inst.type} />
              <Link href={`/institutions/${inst.id}`} className="text-brand hover:underline">
                {inst.name}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold">Kaynak</h2>
          {tx.source ? (
            <>
              <p className="mt-3 text-sm font-medium">{tx.source.name}</p>
              <p className="mt-1 text-sm text-muted">
                Yayın tarihi: {formatDate(tx.source.publishedAt)}
              </p>
              <a
                href={tx.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-brand hover:underline"
              >
                Kaynağı görüntüle →
              </a>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Bu kayıt için kaynak belirtilmemiş.</p>
          )}
          <p className="mt-4 rounded-lg bg-amber-100 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Bu kayıt örnek veridir. Kaynak bağlantısı gerçek açık veri
            portallarının türünü temsil eder.
          </p>
        </div>
      </div>
    </div>
  );
}

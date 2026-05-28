import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpenseById } from "@/lib/data";
import { ministryById } from "@/data/ministries";
import { politicianById } from "@/data/politicians";
import { expenses } from "@/data/expenses";
import { CategoryBadge, PartyBadge } from "@/components/Badge";
import { formatTry, formatDate } from "@/lib/format";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return expenses.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const expense = getExpenseById(id);
  return { title: expense?.title ?? "Harcama bulunamadı" };
}

export default async function ExpenseDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const expense = getExpenseById(id);
  if (!expense) notFound();

  const ministry = ministryById(expense.ministryId);
  const related = expense.relatedPoliticianIds
    .map((pid) => politicianById(pid))
    .filter((p) => p !== undefined);

  return (
    <div className="space-y-6">
      <Link href="/expenses" className="text-sm text-brand hover:underline">
        ← Harcamalara dön
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={expense.category} />
          {ministry ? (
            <Link
              href={`/ministries/${ministry.id}`}
              className="text-xs text-muted hover:text-brand"
            >
              {ministry.name}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {expense.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted">{expense.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Tutar</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatTry(expense.amountTry)}
            </p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Tarih</p>
            <p className="mt-1 text-lg font-medium">{formatDate(expense.date)}</p>
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Yüklenici</p>
            <p className="mt-1 text-lg font-medium">{expense.vendor ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold">İlgili kamu görevlileri</h2>
          {related.length === 0 ? (
            <p className="mt-3 text-sm text-muted">İlişkilendirilmiş kişi yok.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {related.map((p) => (
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
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold">Kaynak</h2>
          <p className="mt-3 text-sm">
            <span className="font-medium">{expense.source.name}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Yayın tarihi: {formatDate(expense.source.publishedAt)}
          </p>
          <a
            href={expense.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-brand hover:underline"
          >
            Kaynağı görüntüle →
          </a>
          <p className="mt-4 rounded-lg bg-amber-100 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Bu kayıt örnek veridir. Kaynak bağlantısı gerçek açık veri
            portallarının türünü temsil eder.
          </p>
        </div>
      </div>
    </div>
  );
}

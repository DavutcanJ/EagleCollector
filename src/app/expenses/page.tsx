import type { Metadata } from "next";
import { Suspense } from "react";
import ExpenseFilters from "@/components/ExpenseFilters";
import ExpenseTable from "@/components/ExpenseTable";
import {
  getExpenses,
  allCategories,
  allYears,
  ministries,
  type ExpenseFilters as Filters,
} from "@/lib/data";
import { formatTry } from "@/lib/format";

export const metadata: Metadata = {
  title: "Harcamalar",
  description: "Kamu harcama kayıtlarını bakanlık, kategori ve yıla göre filtreleyin.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const filters: Filters = {
    search: first(sp.search),
    ministryId: first(sp.ministry),
    category: first(sp.category),
    year: first(sp.year),
    sort: (first(sp.sort) as Filters["sort"]) ?? "date-desc",
  };

  const results = getExpenses(filters);
  const total = results.reduce((s, e) => s + e.amountTry, 0);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Harcamalar</h1>
        <p className="mt-2 text-muted">
          Kamu harcama kayıtlarını arayın ve filtreleyin. Her kayıt bir kaynak
          referansı ve ilgili kamu görevlileriyle ilişkilendirilmiştir.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted shadow-sm">
            Filtreler yükleniyor…
          </div>
        }
      >
        <ExpenseFilters
          ministries={ministries.map((m) => ({ value: m.id, label: m.shortName }))}
          categories={allCategories().map((c) => ({ value: c, label: c }))}
          years={allYears().map((y) => ({ value: String(y), label: String(y) }))}
        />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          <strong className="text-foreground">{results.length}</strong> kayıt
          bulundu
        </span>
        <span>
          Toplam:{" "}
          <strong className="text-foreground tabular-nums">
            {formatTry(total)}
          </strong>
        </span>
      </div>

      <ExpenseTable expenses={results} />
    </div>
  );
}

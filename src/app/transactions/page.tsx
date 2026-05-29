import type { Metadata } from "next";
import { Suspense } from "react";
import TransactionFilters from "@/components/TransactionFilters";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import {
  queryTransactions,
  allCategories,
  allYears,
  institutions,
  transactionTypeLabels,
  procurementMethodLabels,
  type TransactionQuery,
} from "@/lib/data";
import { formatTry } from "@/lib/format";

export const metadata: Metadata = {
  title: "İşlemler",
  description:
    "Tüm kamu kurumlarının mali işlemlerini tür, kurum, kategori, yıl ve ihale usulüne göre filtreleyin.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const PAGE_SIZE = 20;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Number(first(sp.page)) || 1;

  const query: TransactionQuery = {
    search: first(sp.search),
    institutionId: first(sp.institution),
    type: first(sp.type),
    category: first(sp.category),
    year: first(sp.year),
    procurementMethod: first(sp.method),
    sort: (first(sp.sort) as TransactionQuery["sort"]) ?? "date-desc",
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, total } = queryTransactions(query);

  // Total across the full (unpaginated) filtered set.
  const fullTotal = queryTransactions({ ...query, page: 1, pageSize: 0 }).data.reduce(
    (s, t) => s + t.amountTry,
    0,
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">İşlemler</h1>
        <p className="mt-2 text-muted">
          Bakanlık, belediye, valilik ve kaymakamlık işlemleri tek listede. Her
          kayıt bir kuruma, ilgili görevlilere ve bir kaynağa bağlıdır.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted shadow-sm">
            Filtreler yükleniyor…
          </div>
        }
      >
        <TransactionFilters
          institutions={institutions.map((i) => ({ value: i.id, label: i.shortName }))}
          types={Object.entries(transactionTypeLabels).map(([value, label]) => ({ value, label }))}
          categories={allCategories().map((c) => ({ value: c, label: c }))}
          years={allYears().map((y) => ({ value: String(y), label: String(y) }))}
          methods={Object.entries(procurementMethodLabels).map(([value, label]) => ({ value, label }))}
        />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          <strong className="text-foreground">{total}</strong> işlem bulundu
        </span>
        <span>
          Toplam:{" "}
          <strong className="text-foreground tabular-nums">{formatTry(fullTotal)}</strong>
        </span>
      </div>

      <TransactionTable transactions={data} />

      <Suspense fallback={null}>
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} />
      </Suspense>
    </div>
  );
}

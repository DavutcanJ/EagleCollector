import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import InstitutionFilters from "@/components/InstitutionFilters";
import { InstitutionTypeBadge } from "@/components/Badge";
import {
  queryInstitutions,
  transactionsForInstitution,
  institutionTypeLabels,
  allProvinces,
  type InstitutionQuery,
} from "@/lib/data";
import { officialById } from "@/data/officials";
import { isSpend } from "@/lib/data";
import { formatTryCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kurumlar",
  description:
    "Bakanlıklar, belediyeler, valilikler ve kaymakamlıklar — tür ve ile göre filtreleyin.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function InstitutionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const query: InstitutionQuery = {
    search: first(sp.search),
    type: first(sp.type),
    province: first(sp.province),
  };
  const { data } = queryInstitutions(query);

  const rows = data
    .map((inst) => {
      const txs = transactionsForInstitution(inst.id);
      const spend = txs.filter(isSpend).reduce((s, t) => s + t.amountTry, 0);
      return { inst, count: txs.length, spend };
    })
    .sort((a, b) => b.spend - a.spend);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Kurumlar</h1>
        <p className="mt-2 text-muted">
          Bakanlık kurumları gerçektir; tüm mali rakamlar örnek veridir. Bir kuruma
          tıklayarak alt birimlerini, görevlilerini, bilançolarını ve işlemlerini
          görebilirsiniz.
        </p>
      </section>

      <Suspense fallback={null}>
        <InstitutionFilters
          types={Object.entries(institutionTypeLabels).map(([value, label]) => ({ value, label }))}
          provinces={allProvinces().map((p) => ({ value: p, label: p }))}
        />
      </Suspense>

      <p className="text-sm text-muted">
        <strong className="text-foreground">{rows.length}</strong> kurum
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ inst, count, spend }) => {
          const head = inst.headOfficialId ? officialById(inst.headOfficialId) : undefined;
          return (
            <Link
              key={inst.id}
              href={`/institutions/${inst.id}`}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-brand"
            >
              <InstitutionTypeBadge type={inst.type} />
              <p className="mt-2 font-semibold leading-snug">{inst.name}</p>
              <p className="text-sm text-muted">{inst.province ?? "—"}</p>
              {head ? (
                <p className="mt-2 text-sm text-muted">Yönetici: {head.name}</p>
              ) : null}
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-xs text-muted">{count} işlem</span>
                <span className="font-semibold tabular-nums">{formatTryCompact(spend)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

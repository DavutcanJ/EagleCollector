import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import OfficialFilters from "@/components/OfficialFilters";
import { PartyBadge } from "@/components/Badge";
import {
  queryOfficials,
  transactionsForOfficial,
  officialRoleLabels,
  parties,
  allProvinces,
  isSpend,
  type OfficialQuery,
} from "@/lib/data";
import { institutionById } from "@/data/institutions";
import { formatTryCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Görevliler",
  description:
    "Bakanlar, milletvekilleri, belediye başkanları, valiler ve kaymakamlar.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function OfficialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const query: OfficialQuery = {
    search: first(sp.search),
    role: first(sp.role),
    partyId: first(sp.party),
    province: first(sp.province),
  };
  const { data } = queryOfficials(query);

  const rows = data
    .map((o) => {
      const txs = transactionsForOfficial(o.id);
      const spend = txs.filter(isSpend).reduce((s, t) => s + t.amountTry, 0);
      return { official: o, count: txs.length, spend };
    })
    .sort((a, b) => b.spend - a.spend);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Görevliler</h1>
        <p className="mt-2 text-muted">
          Görevlilerin rolleri, kurumları ve ilişkilendirildikleri işlem hacmi.
          Bağlantı, kişinin parayı kişisel harcadığı anlamına gelmez; kurumsal
          sorumluluğu gösterir.
        </p>
      </section>

      <Suspense fallback={null}>
        <OfficialFilters
          roles={Object.entries(officialRoleLabels).map(([value, label]) => ({ value, label }))}
          parties={parties.map((p) => ({ value: p.id, label: p.shortName }))}
          provinces={allProvinces().map((p) => ({ value: p, label: p }))}
        />
      </Suspense>

      <p className="text-sm text-muted">
        <strong className="text-foreground">{rows.length}</strong> görevli
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ official: o, count, spend }) => {
          const inst = o.institutionId ? institutionById(o.institutionId) : undefined;
          return (
            <Link
              key={o.id}
              href={`/officials/${o.id}`}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-brand"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-sm text-muted">{officialRoleLabels[o.role]}</p>
                </div>
                <PartyBadge partyId={o.partyId} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {inst ? inst.shortName : (o.province ?? "—")}
              </p>
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

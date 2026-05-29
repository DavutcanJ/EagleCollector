"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const go = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const btn =
    "rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface-muted disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted">
      <span>
        {from}–{to} / {total}
      </span>
      <div className="flex items-center gap-2">
        <button className={btn} onClick={() => go(page - 1)} disabled={page <= 1}>
          ← Önceki
        </button>
        <span className="tabular-nums">
          {page} / {pageCount}
        </span>
        <button
          className={btn}
          onClick={() => go(page + 1)}
          disabled={page >= pageCount}
        >
          Sonraki →
        </button>
      </div>
    </div>
  );
}

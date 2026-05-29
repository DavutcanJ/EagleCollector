"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

const selectClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

export default function InstitutionFilters({
  types,
  provinces,
}: {
  types: Option[];
  provinces: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/institutions?${next.toString()}`);
    },
    [params, router],
  );

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-muted">
        Ara
        <input
          type="search"
          defaultValue={params.get("search") ?? ""}
          placeholder="Kurum adı…"
          onChange={(e) => update("search", e.target.value)}
          className={selectClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Tür
        <select
          value={params.get("type") ?? ""}
          onChange={(e) => update("type", e.target.value)}
          className={selectClass}
        >
          <option value="">Tümü</option>
          {types.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        İl
        <select
          value={params.get("province") ?? ""}
          onChange={(e) => update("province", e.target.value)}
          className={selectClass}
        >
          <option value="">Tümü</option>
          {provinces.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

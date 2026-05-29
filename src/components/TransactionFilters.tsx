"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

const selectClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

export default function TransactionFilters({
  institutions,
  types,
  categories,
  years,
  methods,
}: {
  institutions: Option[];
  types: Option[];
  categories: Option[];
  years: Option[];
  methods: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page"); // reset pagination on any filter change
      router.push(`/transactions?${next.toString()}`);
    },
    [params, router],
  );

  const field = (
    label: string,
    key: string,
    options: Option[],
    allLabel = "Tümü",
  ) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted">
      {label}
      <select
        value={params.get(key) ?? ""}
        onChange={(e) => update(key, e.target.value)}
        className={selectClass}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-muted">
        Ara
        <input
          type="search"
          defaultValue={params.get("search") ?? ""}
          placeholder="Başlık, açıklama veya taraf…"
          onChange={(e) => update("search", e.target.value)}
          className={selectClass}
        />
      </label>
      {field("Kurum", "institution", institutions)}
      {field("Tür", "type", types)}
      {field("Kategori", "category", categories)}
      {field("Yıl", "year", years)}
      {field("İhale usulü", "method", methods)}
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Sırala
        <select
          value={params.get("sort") ?? "date-desc"}
          onChange={(e) => update("sort", e.target.value)}
          className={selectClass}
        >
          <option value="date-desc">Tarih (yeni → eski)</option>
          <option value="date-asc">Tarih (eski → yeni)</option>
          <option value="amount-desc">Tutar (çok → az)</option>
          <option value="amount-asc">Tutar (az → çok)</option>
          <option value="title-asc">Başlık (A → Z)</option>
        </select>
      </label>
    </div>
  );
}

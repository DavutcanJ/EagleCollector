"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

const selectClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

export default function OfficialFilters({
  roles,
  parties,
  provinces,
}: {
  roles: Option[];
  parties: Option[];
  provinces: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/officials?${next.toString()}`);
    },
    [params, router],
  );

  const field = (label: string, key: string, options: Option[]) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted">
      {label}
      <select
        value={params.get(key) ?? ""}
        onChange={(e) => update(key, e.target.value)}
        className={selectClass}
      >
        <option value="">Tümü</option>
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
          placeholder="İsim…"
          onChange={(e) => update("search", e.target.value)}
          className={selectClass}
        />
      </label>
      {field("Görev", "role", roles)}
      {field("Parti", "party", parties)}
      {field("İl", "province", provinces)}
    </div>
  );
}

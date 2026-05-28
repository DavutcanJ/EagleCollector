import type { Aggregate } from "@/lib/data";
import { formatTryCompact } from "@/lib/format";

/** A simple horizontal bar chart driven by aggregate totals (no chart lib). */
export default function BarList({
  items,
  color = "var(--brand)",
}: {
  items: Aggregate[];
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.total));

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const pct = Math.round((item.total / max) * 100);
        return (
          <li key={item.key}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium">{item.label}</span>
              <span className="shrink-0 tabular-nums text-muted">
                {formatTryCompact(item.total)}
                <span className="ml-1 text-xs">({item.count})</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

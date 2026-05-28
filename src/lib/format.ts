// Formatting helpers, locale-aware for a Turkish audience.

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/** Full currency string, e.g. "₺48.500.000.000". */
export function formatTry(amount: number): string {
  return tryFormatter.format(amount);
}

/**
 * Compact currency for dense UI, e.g. "₺48,5 mlr" / "₺6,2 mlr" / "₺720 mln".
 * Uses Turkish-style scale words (mln = million, mlr = billion, trl = trillion).
 */
export function formatTryCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  const fmt = (n: number) =>
    n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });

  if (abs >= 1_000_000_000_000) return `${sign}₺${fmt(abs / 1_000_000_000_000)} trl`;
  if (abs >= 1_000_000_000) return `${sign}₺${fmt(abs / 1_000_000_000)} mlr`;
  if (abs >= 1_000_000) return `${sign}₺${fmt(abs / 1_000_000)} mln`;
  if (abs >= 1_000) return `${sign}₺${fmt(abs / 1_000)} bin`;
  return `${sign}₺${fmt(abs)}`;
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Localised long date, e.g. "12 Mart 2024". */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** Year as a number from an ISO date. */
export function yearOf(iso: string): number {
  return new Date(iso).getFullYear();
}

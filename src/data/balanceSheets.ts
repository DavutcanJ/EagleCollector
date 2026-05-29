import type { BalanceSheet, SourceRef } from "@/lib/types";
import { institutions } from "./institutions";
import { ministries } from "./ministries";

// Per-institution approved annual budget base (TRY). Ministries reuse their
// declared annual budget; other bodies have illustrative base figures.
const ministryBudget = new Map(
  ministries.map((m) => [m.id, m.annualBudgetTry] as const),
);

const nonMinistryBudget: Record<string, number> = {
  // Municipalities
  "mun-istanbul": 250_000_000_000,
  "mun-ankara": 120_000_000_000,
  "mun-izmir": 85_000_000_000,
  "mun-diyarbakir": 18_000_000_000,
  "mun-kayseri": 22_000_000_000,
  // Governorships
  "gov-istanbul": 14_000_000_000,
  "gov-ankara": 9_000_000_000,
  "gov-izmir": 6_500_000_000,
  "gov-diyarbakir": 5_200_000_000,
  // District governorships
  "dist-kadikoy": 900_000_000,
  "dist-uskudar": 850_000_000,
  "dist-cankaya": 1_100_000_000,
  // Parliament
  tbmm: 12_000_000_000,
};

const baseBudget = (institutionId: string): number | undefined =>
  ministryBudget.get(institutionId) ?? nonMinistryBudget[institutionId];

// Deterministic per-year ratios (no randomness): 2024 is a closed year with
// high execution; 2025 is in progress with partial execution.
const yearProfile: Record<number, { spent: number; revenue: number }> = {
  2024: { spent: 0.96, revenue: 0.88 },
  2025: { spent: 0.61, revenue: 0.55 },
};

const round = (n: number) => Math.round(n / 1_000_000) * 1_000_000;

const src = (institutionId: string, year: number): SourceRef => ({
  name: `Bütçe Kesin Hesap / Faaliyet Raporu (${year})`,
  url: "https://www.hmb.gov.tr/kamu-harcama-ve-muhasebe",
  publishedAt: `${year + 1}-03-01`,
});

function buildSheets(): BalanceSheet[] {
  const sheets: BalanceSheet[] = [];
  const years = [2024, 2025];

  for (const inst of institutions) {
    const allocated = baseBudget(inst.id);
    if (allocated === undefined) continue;

    for (const year of years) {
      const profile = yearProfile[year];
      const spent = round(allocated * profile.spent);
      const revenue = round(allocated * profile.revenue);
      const assets = round(allocated * 1.4);
      const liabilities = round(allocated * 0.45);

      sheets.push({
        id: `bs-${inst.id}-${year}`,
        institutionId: inst.id,
        year,
        budgetAllocatedTry: allocated,
        budgetSpentTry: spent,
        revenueTry: revenue,
        assetsTry: assets,
        liabilitiesTry: liabilities,
        source: src(inst.id, year),
      });
    }
  }
  return sheets;
}

export const balanceSheets: BalanceSheet[] = buildSheets();

export const balanceSheetsForInstitution = (institutionId: string) =>
  balanceSheets
    .filter((b) => b.institutionId === institutionId)
    .sort((a, b) => b.year - a.year);

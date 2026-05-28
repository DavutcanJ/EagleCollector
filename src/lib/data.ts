// Query + aggregation layer over the bundled sample data.
//
// All access to the dataset goes through this module so that swapping the
// in-memory arrays for a real database or open-data API later only touches
// this file.

import { expenses } from "@/data/expenses";
import { ministries, ministryById } from "@/data/ministries";
import { politicians, politicianById } from "@/data/politicians";
import { parties, partyById } from "@/data/parties";
import type { Expense, ExpenseCategory } from "@/lib/types";
import { yearOf } from "@/lib/format";

export { ministries, ministryById, politicians, politicianById, parties, partyById };

export interface ExpenseFilters {
  search?: string;
  ministryId?: string;
  category?: ExpenseCategory | string;
  year?: number | string;
  politicianId?: string;
  sort?: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
}

/** Filter + sort the expense list. Pure function over the dataset. */
export function getExpenses(filters: ExpenseFilters = {}): Expense[] {
  const { search, ministryId, category, year, politicianId, sort = "date-desc" } = filters;

  let result = expenses.slice();

  if (search) {
    const q = search.toLocaleLowerCase("tr-TR");
    result = result.filter(
      (e) =>
        e.title.toLocaleLowerCase("tr-TR").includes(q) ||
        e.description.toLocaleLowerCase("tr-TR").includes(q) ||
        (e.vendor?.toLocaleLowerCase("tr-TR").includes(q) ?? false),
    );
  }
  if (ministryId) result = result.filter((e) => e.ministryId === ministryId);
  if (category) result = result.filter((e) => e.category === category);
  if (year) result = result.filter((e) => yearOf(e.date) === Number(year));
  if (politicianId)
    result = result.filter((e) => e.relatedPoliticianIds.includes(politicianId));

  switch (sort) {
    case "date-asc":
      result.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "amount-desc":
      result.sort((a, b) => b.amountTry - a.amountTry);
      break;
    case "amount-asc":
      result.sort((a, b) => a.amountTry - b.amountTry);
      break;
    case "date-desc":
    default:
      result.sort((a, b) => b.date.localeCompare(a.date));
      break;
  }
  return result;
}

export function getExpenseById(id: string): Expense | undefined {
  return expenses.find((e) => e.id === id);
}

export function expensesForPolitician(politicianId: string): Expense[] {
  return getExpenses({ politicianId });
}

export function expensesForMinistry(ministryId: string): Expense[] {
  return getExpenses({ ministryId });
}

/** Distinct categories present in the dataset. */
export function allCategories(): ExpenseCategory[] {
  return Array.from(new Set(expenses.map((e) => e.category))).sort();
}

/** Distinct years present in the dataset, newest first. */
export function allYears(): number[] {
  return Array.from(new Set(expenses.map((e) => yearOf(e.date)))).sort(
    (a, b) => b - a,
  );
}

export interface Aggregate {
  key: string;
  label: string;
  total: number;
  count: number;
}

function sumBy<T extends string>(
  items: Expense[],
  keyFn: (e: Expense) => T,
  labelFn: (key: T) => string,
): Aggregate[] {
  const map = new Map<T, { total: number; count: number }>();
  for (const e of items) {
    const k = keyFn(e);
    const cur = map.get(k) ?? { total: 0, count: 0 };
    cur.total += e.amountTry;
    cur.count += 1;
    map.set(k, cur);
  }
  return Array.from(map.entries())
    .map(([key, v]) => ({ key, label: labelFn(key), total: v.total, count: v.count }))
    .sort((a, b) => b.total - a.total);
}

export function totalsByMinistry(items: Expense[] = expenses): Aggregate[] {
  return sumBy(
    items,
    (e) => e.ministryId,
    (id) => ministryById(id)?.shortName ?? id,
  );
}

export function totalsByCategory(items: Expense[] = expenses): Aggregate[] {
  return sumBy(
    items,
    (e) => e.category,
    (c) => c,
  );
}

export function totalsByYear(items: Expense[] = expenses): Aggregate[] {
  return sumBy(
    items,
    (e) => String(yearOf(e.date)),
    (y) => y,
  ).sort((a, b) => a.key.localeCompare(b.key));
}

export interface DashboardStats {
  totalSpend: number;
  recordCount: number;
  ministryCount: number;
  politicianCount: number;
  largestExpense: Expense;
  topMinistries: Aggregate[];
  topCategories: Aggregate[];
  byYear: Aggregate[];
}

export function getDashboardStats(): DashboardStats {
  const totalSpend = expenses.reduce((s, e) => s + e.amountTry, 0);
  const largestExpense = expenses.reduce((max, e) =>
    e.amountTry > max.amountTry ? e : max,
  );
  return {
    totalSpend,
    recordCount: expenses.length,
    ministryCount: ministries.length,
    politicianCount: politicians.length,
    largestExpense,
    topMinistries: totalsByMinistry().slice(0, 6),
    topCategories: totalsByCategory(),
    byYear: totalsByYear(),
  };
}

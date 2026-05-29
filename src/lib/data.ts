// Unified query + aggregation layer over the bundled sample data.
//
// Every consumer — the web UI, the REST API (/api/v1) and the MCP server —
// goes through this module. Swapping the in-memory arrays in src/data/* for a
// real database or open-data ingestion later only touches the data files; this
// query surface (and therefore the API and MCP tools) stays stable.

import {
  institutions,
  institutionById,
  institutionsByType,
  institutionTypeLabels,
} from "@/data/institutions";
import { officials, officialById, officialRoleLabels } from "@/data/officials";
import {
  transactions,
  transactionById,
  transactionTypeLabels,
  procurementMethodLabels,
} from "@/data/transactions";
import {
  balanceSheets,
  balanceSheetsForInstitution,
} from "@/data/balanceSheets";
import { parties, partyById } from "@/data/parties";
import { yearOf } from "@/lib/format";
import type {
  BalanceSheet,
  Institution,
  Official,
  Transaction,
  TransactionType,
} from "@/lib/types";

export {
  institutions,
  institutionById,
  institutionsByType,
  institutionTypeLabels,
  officials,
  officialById,
  officialRoleLabels,
  transactions,
  transactionById,
  transactionTypeLabels,
  procurementMethodLabels,
  balanceSheets,
  balanceSheetsForInstitution,
  parties,
  partyById,
};

// --------------------------------------------------------------------------
// Pagination
// --------------------------------------------------------------------------

export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

function paginate<T>(items: T[], page = 1, pageSize = 0): Page<T> {
  const total = items.length;
  if (!pageSize || pageSize <= 0) {
    return { data: items, total, page: 1, pageSize: total };
  }
  const p = Math.max(1, page);
  const start = (p - 1) * pageSize;
  return { data: items.slice(start, start + pageSize), total, page: p, pageSize };
}

const norm = (s: string) => s.toLocaleLowerCase("tr-TR");

// --------------------------------------------------------------------------
// Transactions
// --------------------------------------------------------------------------

export interface TransactionQuery {
  search?: string;
  type?: TransactionType | string;
  institutionId?: string;
  institutionType?: string;
  category?: string;
  procurementMethod?: string;
  officialId?: string;
  year?: number | string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  counterparty?: string;
  sort?: "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "title-asc";
  page?: number;
  pageSize?: number;
}

export function queryTransactions(q: TransactionQuery = {}): Page<Transaction> {
  let result = transactions.slice();

  if (q.search) {
    const t = norm(q.search);
    result = result.filter(
      (x) =>
        norm(x.title).includes(t) ||
        norm(x.description).includes(t) ||
        (x.counterparty ? norm(x.counterparty).includes(t) : false),
    );
  }
  if (q.type) result = result.filter((x) => x.type === q.type);
  if (q.institutionId)
    result = result.filter((x) => x.institutionId === q.institutionId);
  if (q.institutionType)
    result = result.filter(
      (x) => institutionById(x.institutionId)?.type === q.institutionType,
    );
  if (q.category) result = result.filter((x) => x.category === q.category);
  if (q.procurementMethod)
    result = result.filter((x) => x.procurementMethod === q.procurementMethod);
  if (q.officialId)
    result = result.filter((x) => x.relatedOfficialIds.includes(q.officialId!));
  if (q.year) result = result.filter((x) => yearOf(x.date) === Number(q.year));
  if (q.dateFrom) result = result.filter((x) => x.date >= q.dateFrom!);
  if (q.dateTo) result = result.filter((x) => x.date <= q.dateTo!);
  if (q.minAmount != null)
    result = result.filter((x) => x.amountTry >= q.minAmount!);
  if (q.maxAmount != null)
    result = result.filter((x) => x.amountTry <= q.maxAmount!);
  if (q.counterparty) {
    const c = norm(q.counterparty);
    result = result.filter((x) => (x.counterparty ? norm(x.counterparty).includes(c) : false));
  }

  switch (q.sort) {
    case "date-asc":
      result.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "amount-desc":
      result.sort((a, b) => b.amountTry - a.amountTry);
      break;
    case "amount-asc":
      result.sort((a, b) => a.amountTry - b.amountTry);
      break;
    case "title-asc":
      result.sort((a, b) => a.title.localeCompare(b.title, "tr-TR"));
      break;
    case "date-desc":
    default:
      result.sort((a, b) => b.date.localeCompare(a.date));
      break;
  }

  return paginate(result, q.page, q.pageSize);
}

export const transactionsForInstitution = (institutionId: string) =>
  queryTransactions({ institutionId, sort: "date-desc" }).data;

export const transactionsForOfficial = (officialId: string) =>
  queryTransactions({ officialId, sort: "date-desc" }).data;

// --------------------------------------------------------------------------
// Institutions
// --------------------------------------------------------------------------

export interface InstitutionQuery {
  search?: string;
  type?: string;
  province?: string;
  parentId?: string;
  page?: number;
  pageSize?: number;
}

export function queryInstitutions(q: InstitutionQuery = {}): Page<Institution> {
  let result = institutions.slice();
  if (q.search) {
    const s = norm(q.search);
    result = result.filter(
      (i) => norm(i.name).includes(s) || norm(i.nameEn).includes(s),
    );
  }
  if (q.type) result = result.filter((i) => i.type === q.type);
  if (q.province) result = result.filter((i) => i.province === q.province);
  if (q.parentId) result = result.filter((i) => i.parentId === q.parentId);
  result.sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
  return paginate(result, q.page, q.pageSize);
}

export const childrenOf = (institutionId: string) =>
  institutions.filter((i) => i.parentId === institutionId);

export const officialsForInstitution = (institutionId: string) =>
  officials.filter((o) => o.institutionId === institutionId);

// --------------------------------------------------------------------------
// Officials
// --------------------------------------------------------------------------

export interface OfficialQuery {
  search?: string;
  role?: string;
  partyId?: string;
  institutionId?: string;
  province?: string;
  page?: number;
  pageSize?: number;
}

export function queryOfficials(q: OfficialQuery = {}): Page<Official> {
  let result = officials.slice();
  if (q.search) {
    const s = norm(q.search);
    result = result.filter((o) => norm(o.name).includes(s) || norm(o.bio).includes(s));
  }
  if (q.role) result = result.filter((o) => o.role === q.role);
  if (q.partyId) result = result.filter((o) => o.partyId === q.partyId);
  if (q.institutionId)
    result = result.filter((o) => o.institutionId === q.institutionId);
  if (q.province) result = result.filter((o) => o.province === q.province);
  return paginate(result, q.page, q.pageSize);
}

// --------------------------------------------------------------------------
// Balance sheets
// --------------------------------------------------------------------------

export interface BalanceSheetQuery {
  institutionId?: string;
  year?: number | string;
}

export function queryBalanceSheets(q: BalanceSheetQuery = {}): BalanceSheet[] {
  let result = balanceSheets.slice();
  if (q.institutionId)
    result = result.filter((b) => b.institutionId === q.institutionId);
  if (q.year) result = result.filter((b) => b.year === Number(q.year));
  return result.sort((a, b) => b.year - a.year);
}

// --------------------------------------------------------------------------
// Aggregation
// --------------------------------------------------------------------------

export type GroupBy =
  | "institution"
  | "institutionType"
  | "category"
  | "year"
  | "type"
  | "official"
  | "party"
  | "province";

export type Metric = "sum" | "count" | "avg";

export interface Aggregate {
  key: string;
  label: string;
  total: number;
  count: number;
}

function groupKeysAndLabels(
  tx: Transaction,
  groupBy: GroupBy,
): Array<{ key: string; label: string }> {
  switch (groupBy) {
    case "institution": {
      const i = institutionById(tx.institutionId);
      return [{ key: tx.institutionId, label: i?.shortName ?? tx.institutionId }];
    }
    case "institutionType": {
      const i = institutionById(tx.institutionId);
      const type = i?.type ?? "agency";
      return [{ key: type, label: institutionTypeLabels[type] }];
    }
    case "category":
      return tx.category ? [{ key: tx.category, label: tx.category }] : [];
    case "year":
      return [{ key: String(yearOf(tx.date)), label: String(yearOf(tx.date)) }];
    case "type":
      return [{ key: tx.type, label: transactionTypeLabels[tx.type] }];
    case "province": {
      const i = institutionById(tx.institutionId);
      return i?.province ? [{ key: i.province, label: i.province }] : [];
    }
    case "official":
      return tx.relatedOfficialIds.map((id) => ({
        key: id,
        label: officialById(id)?.name ?? id,
      }));
    case "party": {
      const set = new Set<string>();
      for (const id of tx.relatedOfficialIds) {
        const p = officialById(id)?.partyId;
        if (p) set.add(p);
      }
      return Array.from(set).map((p) => ({
        key: p,
        label: partyById(p)?.shortName ?? p,
      }));
    }
    default:
      return [];
  }
}

export function aggregateTransactions(
  items: Transaction[],
  groupBy: GroupBy,
  metric: Metric = "sum",
): Aggregate[] {
  const map = new Map<string, { label: string; total: number; count: number }>();
  for (const tx of items) {
    for (const { key, label } of groupKeysAndLabels(tx, groupBy)) {
      const cur = map.get(key) ?? { label, total: 0, count: 0 };
      cur.total += tx.amountTry;
      cur.count += 1;
      map.set(key, cur);
    }
  }
  const out: Aggregate[] = Array.from(map.entries()).map(([key, v]) => ({
    key,
    label: v.label,
    total: metric === "avg" ? Math.round(v.total / v.count) : v.total,
    count: v.count,
  }));
  if (metric === "count") out.sort((a, b) => b.count - a.count);
  else out.sort((a, b) => b.total - a.total);
  return out;
}

// --------------------------------------------------------------------------
// Convenience lists
// --------------------------------------------------------------------------

export const SPEND_TYPES: TransactionType[] = [
  "expense",
  "salary",
  "subsidy",
  "transfer",
];

export const isSpend = (t: Transaction) => t.type !== "revenue";

export function allCategories(): string[] {
  return Array.from(
    new Set(
      transactions
        .map((t) => t.category)
        .filter((c): c is NonNullable<typeof c> => !!c),
    ),
  ).sort();
}

export function allYears(): number[] {
  return Array.from(new Set(transactions.map((t) => yearOf(t.date)))).sort(
    (a, b) => b - a,
  );
}

export function allProvinces(): string[] {
  return Array.from(
    new Set(institutions.map((i) => i.province).filter((p): p is string => !!p)),
  ).sort((a, b) => a.localeCompare(b, "tr-TR"));
}

// --------------------------------------------------------------------------
// Dashboard
// --------------------------------------------------------------------------

export interface DashboardStats {
  totalSpend: number;
  totalRevenue: number;
  transactionCount: number;
  institutionCount: number;
  officialCount: number;
  largestTransaction: Transaction;
  byInstitutionType: Aggregate[];
  topInstitutions: Aggregate[];
  byCategory: Aggregate[];
  byYear: Aggregate[];
  byType: Aggregate[];
}

export function getDashboardStats(): DashboardStats {
  const spend = transactions.filter(isSpend);
  const revenue = transactions.filter((t) => t.type === "revenue");
  const largestTransaction = spend.reduce((max, t) =>
    t.amountTry > max.amountTry ? t : max,
  );
  return {
    totalSpend: spend.reduce((s, t) => s + t.amountTry, 0),
    totalRevenue: revenue.reduce((s, t) => s + t.amountTry, 0),
    transactionCount: transactions.length,
    institutionCount: institutions.length,
    officialCount: officials.length,
    largestTransaction,
    byInstitutionType: aggregateTransactions(spend, "institutionType"),
    topInstitutions: aggregateTransactions(spend, "institution").slice(0, 7),
    byCategory: aggregateTransactions(spend, "category"),
    byYear: aggregateTransactions(spend, "year").sort((a, b) =>
      a.key.localeCompare(b.key),
    ),
    byType: aggregateTransactions(transactions, "type"),
  };
}

// --------------------------------------------------------------------------
// Self-describing schema (consumed by /api/v1 and the MCP `get_schema` tool)
// --------------------------------------------------------------------------

export function getDataModelSchema() {
  return {
    description:
      "EagleCollector — Türkiye kamu kurumları, görevlileri, mali işlemleri ve bilançoları. TÜM VERİ ÖRNEKTİR (sample); kişiler ve partiler kurgusaldır, yalnızca bakanlık/kurum yapısı gerçektir.",
    currency: "TRY",
    entities: {
      institution: {
        description: "Kamu kurumu (bakanlık/belediye/valilik/kaymakamlık/meclis).",
        fields: ["id", "type", "name", "nameEn", "shortName", "parentId", "province", "district", "headOfficialId"],
        types: Object.keys(institutionTypeLabels),
      },
      official: {
        description: "Kamu görevlisi (bakan/milletvekili/başkan/vali/kaymakam vb.).",
        fields: ["id", "name", "partyId", "role", "institutionId", "province", "district", "since", "bio"],
        roles: Object.keys(officialRoleLabels),
      },
      transaction: {
        description: "Mali işlem (harcama/gelir/aktarım/destek/maaş).",
        fields: ["id", "type", "institutionId", "title", "description", "amountTry", "date", "category", "counterparty", "procurementMethod", "budgetYear", "relatedOfficialIds", "source"],
        types: Object.keys(transactionTypeLabels),
        procurementMethods: Object.keys(procurementMethodLabels),
        categories: allCategories(),
      },
      balanceSheet: {
        description: "Kurumun yıllık mali özeti (bütçe/gelir/varlık/borç).",
        fields: ["id", "institutionId", "year", "budgetAllocatedTry", "budgetSpentTry", "revenueTry", "assetsTry", "liabilitiesTry", "source"],
      },
    },
    relationships: [
      "institution.parentId -> institution.id (kaymakamlık -> valilik)",
      "institution.headOfficialId -> official.id",
      "official.institutionId -> institution.id",
      "transaction.institutionId -> institution.id",
      "transaction.relatedOfficialIds[] -> official.id",
      "balanceSheet.institutionId -> institution.id",
    ],
    coverage: {
      institutions: institutions.length,
      officials: officials.length,
      transactions: transactions.length,
      balanceSheets: balanceSheets.length,
      years: allYears(),
    },
  };
}

// Core domain model for EagleCollector — a public-spending transparency monitor.
//
// IMPORTANT: All persons and parties in the bundled dataset are FICTIONAL and
// the figures are illustrative SAMPLE DATA. Only the ministry institutions are
// real. The schema is designed so that real open-data sources (data.gov.tr,
// official budget tables, KAP, TBMM records, EKAP procurement notices) can be
// wired in later without changing the application code.

/** A political party. Fictional in the sample dataset. */
export interface Party {
  id: string;
  name: string;
  /** Short abbreviation, e.g. "UKP". */
  shortName: string;
  /** Tailwind-friendly accent colour (hex) used in the UI. */
  color: string;
}

/** A government ministry / institution. Institutions are real. */
export interface Ministry {
  id: string;
  /** Official Turkish name. */
  name: string;
  /** English translation, for non-Turkish readers. */
  nameEn: string;
  shortName: string;
  /** Politician id of the current minister, if known. */
  ministerId?: string;
  /** Approved annual budget for the latest year, in Turkish Lira (TRY). */
  annualBudgetTry: number;
  budgetYear: number;
}

export type PoliticianRole =
  | "Minister"
  | "Deputy Minister"
  | "Member of Parliament"
  | "Mayor"
  | "Bureaucrat";

/** A public official. Fictional in the sample dataset. */
export interface Politician {
  id: string;
  name: string;
  partyId: string;
  role: PoliticianRole;
  /** Ministry the official is attached to, if any. */
  ministryId?: string;
  /** Province / electoral region. */
  region?: string;
  /** ISO date the official took the current role. */
  since: string;
  bio: string;
}

export type ExpenseCategory =
  | "Infrastructure"
  | "Defense & Security"
  | "Health"
  | "Education"
  | "Social Welfare"
  | "Personnel"
  | "Procurement"
  | "Travel & Representation"
  | "Subsidies & Grants"
  | "IT & Digital"
  | "Energy";

/** Provenance for a record, so every figure is traceable to a source. */
export interface SourceRef {
  /** Human-readable name of the publishing body / document. */
  name: string;
  /** Link to the source document or portal. */
  url: string;
  /** ISO date the record was published / last verified. */
  publishedAt: string;
}

/** A single public-spending record. Figures are illustrative sample data. */
export interface Expense {
  id: string;
  title: string;
  description: string;
  /** Amount in Turkish Lira (TRY). */
  amountTry: number;
  /** ISO date the spending was recorded. */
  date: string;
  category: ExpenseCategory;
  ministryId: string;
  /** Officials connected to authorising or overseeing this spending. */
  relatedPoliticianIds: string[];
  /** Awarded vendor / contractor, where applicable. */
  vendor?: string;
  source: SourceRef;
}

// ---------------------------------------------------------------------------
// Unified platform model (v2)
//
// The platform generalises beyond ministries to cover every public body:
// ministries, municipalities (belediye), governorships (valilik), district
// governorships (kaymakamlık) and parliament (TBMM). Money movements are
// modelled as Transactions, and each institution can publish BalanceSheets.
// A rule-based engine derives Anomalies (cross-data inconsistencies) on top.
// ---------------------------------------------------------------------------

export type InstitutionType =
  | "ministry" // Bakanlık
  | "municipality" // Belediye
  | "governorship" // Valilik
  | "district-governorship" // Kaymakamlık
  | "parliament" // TBMM
  | "agency"; // Bağlı/ilgili kurum

/** Any public body tracked by the platform. */
export interface Institution {
  id: string;
  type: InstitutionType;
  /** Official Turkish name. */
  name: string;
  /** English translation. */
  nameEn: string;
  shortName: string;
  /** Parent body, e.g. a kaymakamlık's parent valilik. */
  parentId?: string;
  /** Province (il). */
  province?: string;
  /** District (ilçe), for district-level bodies. */
  district?: string;
  /** Official currently heading the body. */
  headOfficialId?: string;
}

export type OfficialRole =
  | "Minister"
  | "Deputy Minister"
  | "Member of Parliament"
  | "Mayor"
  | "Governor"
  | "District Governor"
  | "Bureaucrat"
  | "Council Member";

/** A public official. Appointed officials (governors) have no party. */
export interface Official {
  id: string;
  name: string;
  /** Undefined for appointed, non-partisan officials. */
  partyId?: string;
  role: OfficialRole;
  institutionId?: string;
  province?: string;
  district?: string;
  since: string;
  bio: string;
}

export type TransactionType =
  | "expense" // harcama / ödeme
  | "revenue" // gelir / tahsilat
  | "transfer" // kurumlar arası aktarım
  | "subsidy" // destek / hibe
  | "salary"; // personel ödemesi

export type ProcurementMethod =
  | "open-tender" // açık ihale
  | "restricted-tender" // belli istekliler arası
  | "negotiated" // pazarlık
  | "direct-procurement" // doğrudan temin
  | "exception"; // istisna kapsamı

/** Categories reuse the existing expense taxonomy. */
export type TransactionCategory = ExpenseCategory;

/** A single money movement for any institution. */
export interface Transaction {
  id: string;
  type: TransactionType;
  institutionId: string;
  title: string;
  description: string;
  /** Amount in Turkish Lira (TRY). Always positive; direction is given by type. */
  amountTry: number;
  /** ISO date. */
  date: string;
  category?: TransactionCategory;
  /** Vendor, payee or, for revenue, the source. */
  counterparty?: string;
  /** Procurement route, for expense transactions awarded via tender. */
  procurementMethod?: ProcurementMethod;
  /** Optional link to a balance-sheet budget line / fiscal year. */
  budgetYear?: number;
  relatedOfficialIds: string[];
  /** Provenance. Intentionally optional so missing sources can be flagged. */
  source?: SourceRef;
}

/** Annual financial summary published by an institution. */
export interface BalanceSheet {
  id: string;
  institutionId: string;
  year: number;
  budgetAllocatedTry: number;
  budgetSpentTry: number;
  revenueTry: number;
  assetsTry: number;
  liabilitiesTry: number;
  source?: SourceRef;
}

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

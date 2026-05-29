import { partyById } from "@/data/parties";
import { institutionTypeLabels } from "@/data/institutions";
import { transactionTypeLabels } from "@/data/transactions";
import type { InstitutionType, TransactionType } from "@/lib/types";

const categoryColors: Record<string, string> = {
  Infrastructure: "#0ea5e9",
  "Defense & Security": "#64748b",
  Health: "#ef4444",
  Education: "#f59e0b",
  "Social Welfare": "#ec4899",
  Personnel: "#8b5cf6",
  Procurement: "#14b8a6",
  "Travel & Representation": "#a855f7",
  "Subsidies & Grants": "#22c55e",
  "IT & Digital": "#3b82f6",
  Energy: "#eab308",
};

function Pill({ color, children, title }: { color: string; children: React.ReactNode; title?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
      title={title}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "#64748b";
  return (
    <Pill color={color}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {category}
    </Pill>
  );
}

export function PartyBadge({ partyId }: { partyId?: string }) {
  if (!partyId) {
    return <Pill color="#64748b" title="Atanmış / bağımsız">Atanmış</Pill>;
  }
  const party = partyById(partyId);
  const color = party?.color ?? "#64748b";
  return (
    <Pill color={color} title={party?.name}>
      {party?.shortName ?? partyId}
    </Pill>
  );
}

const institutionTypeColors: Record<InstitutionType, string> = {
  ministry: "#1d4ed8",
  municipality: "#0d9488",
  governorship: "#b45309",
  "district-governorship": "#a16207",
  parliament: "#7c3aed",
  agency: "#64748b",
};

export function InstitutionTypeBadge({ type }: { type: InstitutionType }) {
  return <Pill color={institutionTypeColors[type]}>{institutionTypeLabels[type]}</Pill>;
}

const transactionTypeColors: Record<TransactionType, string> = {
  expense: "#dc2626",
  revenue: "#16a34a",
  transfer: "#0891b2",
  subsidy: "#db2777",
  salary: "#9333ea",
};

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return <Pill color={transactionTypeColors[type]}>{transactionTypeLabels[type]}</Pill>;
}

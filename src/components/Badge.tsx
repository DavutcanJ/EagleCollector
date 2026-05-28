import { partyById } from "@/data/parties";

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

export function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "#64748b";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {category}
    </span>
  );
}

export function PartyBadge({ partyId }: { partyId: string }) {
  const party = partyById(partyId);
  const color = party?.color ?? "#64748b";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
      title={party?.name}
    >
      {party?.shortName ?? partyId}
    </span>
  );
}

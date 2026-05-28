import { politicians, expensesForPolitician } from "@/lib/data";

export function GET() {
  const data = politicians.map((p) => {
    const items = expensesForPolitician(p.id);
    return {
      ...p,
      relatedExpenseCount: items.length,
      relatedTotalTry: items.reduce((s, e) => s + e.amountTry, 0),
    };
  });

  return Response.json({
    meta: {
      count: data.length,
      disclaimer:
        "Sample data — all persons and parties are fictional and not real individuals.",
    },
    data,
  });
}

import { ministries, expensesForMinistry } from "@/lib/data";

export function GET() {
  const data = ministries.map((m) => {
    const items = expensesForMinistry(m.id);
    return {
      ...m,
      trackedExpenseCount: items.length,
      trackedTotalTry: items.reduce((s, e) => s + e.amountTry, 0),
    };
  });

  return Response.json({
    meta: {
      count: data.length,
      disclaimer:
        "Ministry institutions are real; budget and expense figures are sample data.",
    },
    data,
  });
}

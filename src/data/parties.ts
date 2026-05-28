import type { Party } from "@/lib/types";

// NOTE: These parties are FICTIONAL. Any resemblance to real parties is
// coincidental — the data is sample data used to demonstrate the application.
export const parties: Party[] = [
  { id: "ukp", name: "Ulusal Kalkınma Partisi", shortName: "UKP", color: "#2563eb" },
  { id: "dhh", name: "Demokratik Halk Hareketi", shortName: "DHH", color: "#dc2626" },
  { id: "cbp", name: "Cumhuriyetçi Birlik Partisi", shortName: "CBP", color: "#16a34a" },
  { id: "oap", name: "Özgürlük ve Adalet Partisi", shortName: "ÖAP", color: "#9333ea" },
  { id: "bagimsiz", name: "Bağımsız", shortName: "BĞZ", color: "#64748b" },
];

export const partyById = (id: string) => parties.find((p) => p.id === id);

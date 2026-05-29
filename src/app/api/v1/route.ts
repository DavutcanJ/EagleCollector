import { DISCLAIMER } from "@/lib/api";
import { getDataModelSchema } from "@/lib/data";

export function GET() {
  return Response.json({
    name: "EagleCollector API",
    version: "v1",
    disclaimer: DISCLAIMER,
    endpoints: {
      "GET /api/v1": "Bu indeks: şema ve uç nokta listesi.",
      "GET /api/v1/transactions":
        "Mali işlemler. Filtreler: search, type, institution, institutionType, category, method, official, year, dateFrom, dateTo, minAmount, maxAmount, counterparty, sort, page, pageSize.",
      "GET /api/v1/transactions/{id}": "Tek işlem (kurum + görevliler genişletilmiş).",
      "GET /api/v1/institutions":
        "Kurumlar. Filtreler: search, type, province, parentId, page, pageSize.",
      "GET /api/v1/institutions/{id}":
        "Tek kurum (alt birimler, görevliler, bilançolar, işlem özeti).",
      "GET /api/v1/officials":
        "Görevliler. Filtreler: search, role, party, institution, province, page, pageSize.",
      "GET /api/v1/officials/{id}": "Tek görevli (ilişkili işlemler).",
      "GET /api/v1/balance-sheets": "Bilançolar. Filtreler: institution, year.",
      "GET /api/v1/stats":
        "Toplulaştırma. Parametreler: groupBy (institution|institutionType|category|year|type|official|party|province), metric (sum|count|avg) + tüm işlem filtreleri.",
    },
    schema: getDataModelSchema(),
  });
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API & Hakkında",
  description:
    "EagleCollector'ın amacı, veri modeli, REST API'si ve MCP üzerinden LLM erişimi.",
};

const endpoints = [
  ["GET /api/v1", "Şema ve uç nokta listesi (kendini tanımlar)."],
  ["GET /api/v1/transactions", "Mali işlemler — zengin filtre + sayfalama."],
  ["GET /api/v1/transactions/{id}", "Tek işlem (kurum + görevliler genişletilmiş)."],
  ["GET /api/v1/institutions", "Kurumlar (tür, il, üst kurum)."],
  ["GET /api/v1/institutions/{id}", "Kurum + alt birimler, görevliler, bilançolar, özet."],
  ["GET /api/v1/officials", "Görevliler (rol, parti, kurum, il)."],
  ["GET /api/v1/officials/{id}", "Görevli + ilişkili işlemler."],
  ["GET /api/v1/balance-sheets", "Yıllık bilançolar (kurum, yıl)."],
  ["GET /api/v1/stats", "Toplulaştırma: groupBy + metric + işlem filtreleri."],
];

const sources = [
  ["data.gov.tr", "Ulusal Açık Veri Portalı.", "https://data.gov.tr"],
  ["Hazine ve Maliye Bakanlığı", "Bütçe gerçekleşmeleri ve harcama istatistikleri.", "https://www.hmb.gov.tr"],
  ["EKAP / Kamu İhale Kurumu", "İhale ilanları ve sözleşmeler.", "https://ekap.kik.gov.tr"],
  ["Sayıştay", "Kamu denetim raporları.", "https://www.sayistay.gov.tr"],
  ["TBMM", "Yasama kayıtları, bütçe görüşmeleri.", "https://www.tbmm.gov.tr"],
  ["Belediyeler / Valilikler", "Faaliyet raporları ve kesin hesaplar.", "https://www.icisleri.gov.tr"],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">API & Hakkında</h1>
        <p className="mt-3 text-muted">
          EagleCollector, Türkiye&apos;deki kamu kurumlarının (bakanlık, belediye,
          valilik, kaymakamlık, meclis) mali işlemlerini, görevlilerini ve
          bilançolarını açık veri ilkesiyle tek platformda toplar. Tüm veri
          tutarlı bir REST API ve bir MCP sunucusu üzerinden program ve LLM
          erişimine açıktır.
        </p>
      </section>

      <section className="rounded-xl border border-amber-300/60 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
        <h2 className="font-semibold">Önemli uyarı — örnek veri</h2>
        <p className="mt-2 text-sm">
          Tüm rakamlar gösterim amaçlı <strong>örnek (sample)</strong> veridir.
          <strong> Kişiler ve partiler kurgusaldır</strong>; yalnızca <strong>kurum
          yapısı</strong> gerçektir. Hiçbir rakam resmi veri veya gerçek iddia olarak
          kullanılamaz.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Veri modeli</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li><strong className="text-foreground">Kurum (Institution)</strong> — tür, il, üst kurum, yönetici.</li>
          <li><strong className="text-foreground">Görevli (Official)</strong> — rol, parti (atanmışlarda yok), kurum.</li>
          <li><strong className="text-foreground">İşlem (Transaction)</strong> — harcama/gelir/aktarım/destek/maaş, kategori, taraf, ihale usulü, kaynak.</li>
          <li><strong className="text-foreground">Bilanço (BalanceSheet)</strong> — yıllık bütçe, harcanan, gelir, varlık, borç.</li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Tüm veri erişimi tek bir sorgu katmanından (<code className="rounded bg-surface-muted px-1.5 py-0.5">src/lib/data.ts</code>)
          geçer; gerçek kaynaklar bağlandığında API ve MCP olduğu gibi kalır.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">REST API (v1)</h2>
        <ul className="mt-3 space-y-1 font-mono text-sm">
          {endpoints.map(([path, desc]) => (
            <li key={path} className="text-muted">
              <code className="rounded bg-surface-muted px-1.5 py-0.5 text-foreground">{path}</code>
              <span className="ml-2">{desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Yanıtlar tutarlı bir zarf kullanır:{" "}
          <code className="rounded bg-surface-muted px-1.5 py-0.5">{`{ meta, data }`}</code>{" "}
          — <code className="rounded bg-surface-muted px-1.5 py-0.5">meta</code> sayıları,
          sayfalamayı, uygulanan filtreleri ve uyarıyı içerir.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">MCP ile LLM erişimi</h2>
        <p className="mt-2 text-sm text-muted">
          Depodaki sıfır-bağımlılıklı MCP sunucusu (<code className="rounded bg-surface-muted px-1.5 py-0.5">mcp/server.mjs</code>)
          API&apos;yi araç (tool) olarak sunar; böylece bir frontier LLM veriyi
          doğrudan sorgulayıp kurumlar/işlemler/görevliler arasında çapraz
          analiz yapabilir. Araçlar: <code className="rounded bg-surface-muted px-1.5 py-0.5">get_schema</code>,
          {" "}<code className="rounded bg-surface-muted px-1.5 py-0.5">list_transactions</code>,
          {" "}<code className="rounded bg-surface-muted px-1.5 py-0.5">aggregate</code> ve diğerleri.
          Kurulum için <code className="rounded bg-surface-muted px-1.5 py-0.5">mcp/README.md</code>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Gerçek veri kaynakları (entegrasyon için)</h2>
        <ul className="mt-3 space-y-3">
          {sources.map(([name, desc, url]) => (
            <li key={name} className="rounded-lg border border-border bg-surface p-4">
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                {name} ↗
              </a>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

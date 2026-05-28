import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "EagleCollector'ın amacı, veri kaynakları ve metodolojisi hakkında bilgi.",
};

const sources = [
  {
    name: "data.gov.tr",
    desc: "Türkiye Ulusal Açık Veri Portalı — kurumların yayımladığı açık veri kümeleri.",
    url: "https://data.gov.tr",
  },
  {
    name: "Hazine ve Maliye Bakanlığı — Bütçe Gerçekleşmeleri",
    desc: "Merkezi yönetim bütçe gerçekleşme raporları ve harcama istatistikleri.",
    url: "https://www.hmb.gov.tr",
  },
  {
    name: "EKAP / Kamu İhale Kurumu",
    desc: "Elektronik Kamu Alımları Platformu ve Kamu İhale Bülteni ihale ilanları.",
    url: "https://ekap.kik.gov.tr",
  },
  {
    name: "Sayıştay",
    desc: "Kamu kurumlarının denetim raporları ve kamu mali yönetimi incelemeleri.",
    url: "https://www.sayistay.gov.tr",
  },
  {
    name: "TBMM",
    desc: "Türkiye Büyük Millet Meclisi — yasama kayıtları, bütçe görüşmeleri ve soru önergeleri.",
    url: "https://www.tbmm.gov.tr",
  },
  {
    name: "KAP — Kamuyu Aydınlatma Platformu",
    desc: "Kamu iştiraki şirketlerin finansal bildirimleri.",
    url: "https://www.kap.org.tr",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Hakkında</h1>
        <p className="mt-3 text-muted">
          EagleCollector, Türkiye&apos;deki kamu harcamalarını ve bu harcamalarla
          kurumsal olarak ilişkili kamu görevlilerini açık veri ilkesiyle
          izlemeyi amaçlayan bir şeffaflık panosudur. Amaç, kamuya açık
          bilgileri tek bir yerde toplayıp anlaşılır biçimde sunarak hesap
          verebilirliği desteklemektir.
        </p>
      </section>

      <section className="rounded-xl border border-amber-300/60 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
        <h2 className="font-semibold">Önemli uyarı — örnek veri</h2>
        <p className="mt-2 text-sm">
          Bu sürümdeki tüm rakamlar gösterim amaçlı <strong>örnek (sample)</strong>{" "}
          veridir. Uygulamadaki <strong>kişiler ve partiler kurgusaldır</strong>{" "}
          ve gerçek bireyleri temsil etmez. Yalnızca <strong>bakanlık
          kurumları</strong> gerçektir. Buradaki hiçbir rakam resmi veri olarak
          kullanılamaz veya gerçek bir iddia olarak yorumlanamaz.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Metodoloji</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>
            Her harcama kaydı bir kaynak referansıyla (yayın adı, tarih ve
            bağlantı) ilişkilendirilir; böylece her rakam izlenebilir olur.
          </li>
          <li>
            Bir kamu görevlisinin bir harcamaya bağlanması, o kişinin parayı
            kişisel olarak harcadığı anlamına gelmez; ilgili dönemdeki kurumsal
            sorumluluğu gösterir.
          </li>
          <li>
            Tüm tutarlar Türk Lirası (TRY) cinsindendir ve toplulaştırmalar veri
            kümesindeki kayıtlardan hesaplanır.
          </li>
          <li>
            Veri modeli, gerçek açık veri kaynaklarının (aşağıda) doğrudan
            bağlanabilmesi için tasarlanmıştır.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          Gerçek veri kaynakları (entegrasyon için)
        </h2>
        <p className="mt-2 text-sm text-muted">
          Üretim sürümünde aşağıdaki kamuya açık kaynaklar veri besleme için
          kullanılabilir:
        </p>
        <ul className="mt-3 space-y-3">
          {sources.map((s) => (
            <li
              key={s.name}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                {s.name} ↗
              </a>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">API</h2>
        <p className="mt-2 text-sm text-muted">
          Veriler basit bir JSON API üzerinden de erişilebilir:
        </p>
        <ul className="mt-3 space-y-1 font-mono text-sm text-muted">
          <li>
            <code className="rounded bg-surface-muted px-1.5 py-0.5">GET /api/expenses</code>{" "}
            — filtreler: <code>search, ministry, category, year, sort</code>
          </li>
          <li>
            <code className="rounded bg-surface-muted px-1.5 py-0.5">GET /api/politicians</code>
          </li>
          <li>
            <code className="rounded bg-surface-muted px-1.5 py-0.5">GET /api/ministries</code>
          </li>
        </ul>
      </section>
    </div>
  );
}

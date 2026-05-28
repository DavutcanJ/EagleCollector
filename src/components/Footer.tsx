import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted">
        <p className="font-medium text-foreground">
          EagleCollector — Kamu harcamaları şeffaflık izleyicisi
        </p>
        <p className="mt-1">
          Tüm rakamlar, kişiler ve partiler örnek (sample) veridir; gerçek resmi
          veri değildir. Gerçek kaynaklar için{" "}
          <Link href="/about" className="text-brand underline-offset-2 hover:underline">
            Hakkında
          </Link>{" "}
          sayfasına bakın.
        </p>
        <p className="mt-3 text-xs">
          Açık veri ilkesiyle geliştirilmiştir · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

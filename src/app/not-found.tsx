import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl">🦅</p>
      <h1 className="mt-4 text-2xl font-semibold">Kayıt bulunamadı</h1>
      <p className="mt-2 text-muted">
        Aradığınız sayfa veya kayıt mevcut değil.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:opacity-90"
      >
        Panele dön
      </Link>
    </div>
  );
}

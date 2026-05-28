"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Panel" },
  { href: "/expenses", label: "Harcamalar" },
  { href: "/politicians", label: "Siyasetçiler" },
  { href: "/ministries", label: "Bakanlıklar" },
  { href: "/about", label: "Hakkında" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="text-xl">🦅</span>
          <span className="text-lg tracking-tight">
            Eagle<span className="text-brand">Collector</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                isActive(item.href)
                  ? "bg-brand text-brand-fg"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

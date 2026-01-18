"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonClasses } from "@/components/Button";

const navLinks = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl"
        >
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-rose-300 via-rose-400 to-rose-500 shadow-sm" />
          <span className="text-slate-900">
            BeMy<span className="text-rose-600">Valentine</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition ${
                  isActive
                    ? "font-semibold text-rose-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-rose-400"
                    : "text-slate-700 hover:text-rose-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/builder?template=cute-classic"
          className={buttonClasses("outline")}
        >
          Start building
        </Link>
      </div>
      <div className="flex items-center justify-center gap-6 px-6 pb-4 text-xs text-slate-600 md:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "font-semibold text-rose-600" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

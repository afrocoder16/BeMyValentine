"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const hideChrome =
    pathname?.startsWith("/builder") ||
    pathname?.startsWith("/build") ||
    pathname?.startsWith("/v");

  return (
    <div className="relative min-h-screen bg-[#fff7f4] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] h-80 w-80 rounded-full bg-gradient-to-br from-amber-200 via-rose-200 to-pink-200 blur-3xl" />
      </div>
      {!hideChrome ? <Navbar /> : null}
      {children}
      {!hideChrome ? <Footer /> : null}
    </div>
  );
}

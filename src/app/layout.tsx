import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Fraunces,
  Great_Vibes,
  Manrope,
} from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "BeMyValentine",
  description: "Create a Valentine page in minutes and share it instantly.",
  verification: {
    google: "fzbO1uEwuvsXAsEVXNi7AKqhg37ILWdTv-TAvxC2si4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${cormorant.variable} ${dmSerif.variable} ${greatVibes.variable}`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

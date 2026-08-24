import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageIntro from "@/components/ui/PageIntro";
import CursorTracker from "@/components/ui/CursorTracker";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "PriorityPlus Financial — Combine Every Balance Into One Lower Payment",
  description:
    "Check your rate in 60 seconds without touching your credit score. Compare real debt-consolidation offers from 35+ trusted lending partners.",
  openGraph: {
    title: "PriorityPlus Financial",
    description:
      "Combine every balance into one lower monthly payment. Check your rate in 60 seconds — it won't touch your credit score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <PageIntro />
        <CursorTracker />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

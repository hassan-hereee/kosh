"use client";


import Link from "next/link";
import QuoteWizard from "./QuoteWizard";
import { ArrowShareIcon } from "@/components/ui/icons";
import { Rise, SplitWords, Magnetic } from "@/components/ui/motion";
import { HERO_STATS } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-hero pt-[120px] lg:pb-[40px] lg:pt-[128px]"
    >
      <div className="shell relative lg:h-full">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_524px] lg:gap-[64px]">
          {/* ---------------- copy column ---------------- */}
          <div>
            <Rise delay={0}>
              {/* Fast • Secure • Trusted rule */}
              <div className="flex items-center gap-[10px]">
                <span aria-hidden className="h-[1px] w-6 shrink-0 bg-gradient-to-r from-brand-700/0 to-brand-700/45 sm:w-[62px]" />
                <span aria-hidden className="h-[4px] w-[4px] shrink-0 rounded-full bg-brand-700" />
                <p className="text-[12.5px] font-bold tracking-[-0.005em] text-brand-700">
                  Fast • Secure • Trusted
                </p>
                <span aria-hidden className="h-[4px] w-[4px] shrink-0 rounded-full bg-brand-700/70" />
                <span aria-hidden className="h-[1px] w-8 shrink-0 bg-gradient-to-r from-brand-700/45 to-brand-700/0 sm:w-[86px]" />
              </div>
            </Rise>

            <h1 className="mt-[18px] text-[46px] font-bold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[62px]">
              <SplitWords text="Let's See" />
              <span className="text-brand-700">
                <SplitWords text="What's" baseDelay={3 * 55 + 70} />
              </span>
              <br />
              <SplitWords text="Possible" baseDelay={5 * 55 + 140} wordClassName="text-gradient" />
              <SplitWords text="." baseDelay={6 * 55 + 140} />
            </h1>

            <Rise delay={220}>
              <p className="mt-[22px] max-w-[452px] text-[16px] leading-[1.7] text-ink-600">
                Combine every balance into one lower monthly payment. Check your rate in 60 seconds
                it won&apos;t touch your credit score.
              </p>
            </Rise>

            <Rise delay={320} className="mt-[24px]">
              <Magnetic strength={0.28}>
                <Link
                  href="#savings"
                  className="btn-primary btn-sheen h-[52px] px-[30px] text-[14px]"
                >
                  See my savings
                  <ArrowShareIcon className="h-[17px] w-[17px] transition-transform duration-300 hover:translate-x-[2px]" />
                </Link>
              </Magnetic>
            </Rise>

            {/* ---------------- stats row ---------------- */}
            <dl className="mt-[54px] grid max-w-[760px] grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-x-6">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-[21px] font-bold tracking-[-0.025em] text-brand-700">
                      {stat.value}
                    </span>
                    <span className="mt-[7px] block whitespace-nowrap text-[10px] font-medium leading-[1.3] tracking-[-0.01em] text-brand-700">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ---------------- wizard column ---------------- */}
          <Rise delay={260} className="relative mt-[16px] h-full">
            <QuoteWizard />
          </Rise>
        </div>
      </div>
    </section>
  );
}

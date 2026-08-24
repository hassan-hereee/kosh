"use client";

import { LOAN_OFFERS } from "@/lib/data";
import Stagger from "@/components/ui/Stagger";
import SectionHeading from "@/components/ui/SectionHeading";

const LENDER_LOGOS: Record<string, { src: string; w: number; h: number }> = {
  SoFi: { src: "/logos/sofi.svg", w: 67, h: 23 },
  Prosper: { src: "/logos/prosper.svg", w: 110, h: 38 },
  Upgrade: { src: "/logos/upgrade.svg", w: 100, h: 21 },
  "Best Egg": { src: "/logos/best-egg.svg", w: 105, h: 30 },
};

export default function LoanOffers() {
  return (
    <section id="loan-options" className="bg-soft-sky py-16 lg:py-20 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading lead="Sample Personal" accent="Loan Offers." />

        <Stagger
          step={110}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
        {LOAN_OFFERS.map((offer) => (
          <article
            key={offer.lender}
            data-stagger
            className="card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
          >
            <div className="flex h-[44px] items-center">
              <img
                src={LENDER_LOGOS[offer.lender].src}
                alt={offer.lender}
                width={LENDER_LOGOS[offer.lender].w}
                height={LENDER_LOGOS[offer.lender].h}
                className="block"
              />
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Amount</dt>
                <dd className="mt-[6px] text-[15px] font-bold tracking-[-0.01em] text-ink">{offer.amount}</dd>
              </div>
              <div>
                <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">APR</dt>
                <dd className="mt-[6px] text-[15px] font-bold tracking-[-0.01em] text-brand-700">{offer.apr}</dd>
              </div>
              <div>
                <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Term</dt>
                <dd className="mt-[6px] text-[15px] font-bold tracking-[-0.01em] text-ink">{offer.term}</dd>
              </div>
            </dl>

            <a
              href="#quote"
              className="mt-auto border-t border-slate-100 pt-[18px] text-center text-[12.5px] font-bold text-brand-700 transition-colors hover:text-brand-500"
            >
              View Offer
            </a>
          </article>
        ))}
        </Stagger>
      </div>
    </section>
  );
}

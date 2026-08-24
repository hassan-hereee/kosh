"use client";

import { useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { WarningIcon } from "@/components/ui/icons";
import { CountUp, Magnetic, ZoomIn } from "@/components/ui/motion";
import { gsap, reducedMotion, useGSAP } from "@/components/ui/gsap";
import { monthlyPayment } from "@/lib/finance";

/* Anchored to the Figma defaults ($25,000 / 24% → 33 yrs, $48,887, $44,082, 21 yrs sooner). */
const anchor = (base: number, debt: number, apr: number, dExp: number, rExp: number) =>
  base * Math.pow(debt / 25000, dExp) * Math.pow(apr / 24, rExp);

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function SavingsCalculator() {
  const [debt, setDebt] = useState(25000);
  const [apr, setApr] = useState(24);

  const debtPct = ((debt - 5000) / 495000) * 100;
  const aprPct = ((apr - 10) / 25) * 100;

  const hiddenYears = clamp(Math.round(anchor(33, debt, apr, 0.45, 1.4)), 1, 99);
  const hiddenInterest = Math.round(anchor(48887, debt, apr, 1.05, 1.3));
  const firstMin = Math.max(Math.round(debt * 0.03), 25);

  const savedInterest = Math.round(anchor(44082, debt, apr, 0.95, 1.1));
  const yearsSooner = clamp(Math.round(anchor(21, debt, apr, 0.35, 1)), 1, 60);
  const currentYears = clamp(Math.round(anchor(34, debt, apr, 0.4, 0.8)), yearsSooner + 5, 99);
  const consolPay = Math.round(monthlyPayment(debt, 8.9, 48));
  const consolBar = Math.max(6, Math.round((4 / currentYears) * 100));

  const panelRef = useRef<HTMLDivElement>(null);

  /* comparison bars fill as the panel scrolls into view */
  useGSAP(
    () => {
      if (!panelRef.current || reducedMotion()) return;
      gsap.from(".sc-bar-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: panelRef.current, start: "top 80%" },
      });
    },
    { scope: panelRef },
  );

  return (
    <section className="bg-soft-sky pt-0 pb-11 lg:pt-0 lg:pb-20 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading
          lead="Discover How Much"
          accent="You Could Save."
          lede="Move the sliders to compare minimum payments with one fixed monthly payment and see your potential savings in real time."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* -------- inputs card -------- */}
          <Reveal>
          <div className="card flex h-full flex-col p-7 sm:p-8">
            {/* debt slider */}
            <div className="flex items-baseline justify-between">
              <label htmlFor="calc-debt" className="text-[14px] font-bold text-ink">
                Total debt to consolidate
              </label>
              <p className="text-[18px] font-bold tracking-[-0.02em] text-brand-700 tabular-nums">
                ${debt.toLocaleString("en-US")}
              </p>
            </div>
            <input
              id="calc-debt"
              type="range"
              min={5000}
              max={500000}
              step={5000}
              value={debt}
              onChange={(e) => setDebt(Number(e.target.value))}
              className="range mt-[16px]"
              style={{ background: `linear-gradient(90deg,#174195 ${debtPct}%,#DBE7FB ${debtPct}%)` }}
            />
            <div className="mt-[10px] flex justify-between text-[11px] text-ink-400">
              <span>$5,000</span>
              <span>$500,000</span>
            </div>

            {/* apr slider */}
            <div className="mt-14 flex items-baseline justify-between">
              <label htmlFor="calc-apr" className="text-[14px] font-bold text-ink">
                Your current average APR
              </label>
              <p className="text-[18px] font-bold tracking-[-0.02em] text-brand-700 tabular-nums">
                {apr}%
              </p>
            </div>
            <input
              id="calc-apr"
              type="range"
              min={10}
              max={35}
              step={1}
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
              className="range mt-[16px]"
              style={{ background: `linear-gradient(90deg,#174195 ${aprPct}%,#DBE7FB ${aprPct}%)` }}
            />
            <div className="mt-[10px] flex justify-between text-[11px] text-ink-400">
              <span>10%</span>
              <span>35%</span>
            </div>

            {/* hidden cost warning — anchored to the card bottom */}
            <div className="mt-auto flex gap-[14px] rounded-xl border border-red-100 bg-[#FEF4F2] p-5 pt-7">
              <WarningIcon className="mt-[2px] h-[22px] w-[22px] shrink-0 text-[#D92D20]" />
              <div>
                <p className="text-[13.5px] font-bold text-[#B42318]">
                  The Hidden Cost of Minimum Payments
                </p>
                <p className="mt-[6px] text-[13px] leading-[1.7] text-ink-500">
                  Starting at{" "}
                  <span className="font-semibold text-[#B42318]">
                    ${firstMin.toLocaleString("en-US")}/month
                  </span>
                  , minimum payments could leave you in debt for{" "}
                  <span className="font-semibold text-[#B42318]">{hiddenYears} years</span> and add{" "}
                  <span className="font-semibold text-[#B42318]">
                    ${hiddenInterest.toLocaleString("en-US")}
                  </span>{" "}
                  in interest.
                </p>
              </div>
            </div>
          </div>
          </Reveal>

          {/* -------- result panel -------- */}
          <Reveal delay={130}>
          <div
            ref={panelRef}
            className="border-gradient-animated bg-panel-navy relative h-full overflow-hidden rounded-card p-7 shadow-panel sm:p-8"
          >
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-300">
              One payment. Big savings.
            </p>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="flex items-baseline gap-2">
                  <CountUp
                    to={savedInterest}
                    prefix="$"
                    className="text-[42px] font-bold leading-none tracking-[-0.03em] text-white tabular-nums sm:text-[46px]"
                  />
                  <span className="text-[13px] font-semibold text-white/60">in interest</span>
                </p>
                <p className="mt-3 max-w-[250px] text-[12px] leading-[1.6] text-white/70">
                  Become debt free <span className="font-bold text-white">{yearsSooner} years sooner</span> with
                  one fixed monthly payment.
                </p>
              </div>

              {/* coins + chart illustration */}
              <div className="mt-1 hidden shrink-0 sm:block">
                <svg viewBox="0 0 190 150" className="h-[132px] w-[168px]" aria-hidden>
                <defs>
                  <linearGradient id="sc-coin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5FA8F0" />
                    <stop offset="1" stopColor="#1D55B0" />
                  </linearGradient>
                </defs>
                <rect x="58" y="8" width="126" height="86" rx="10" fill="#0E2E63" stroke="rgba(255,255,255,.22)" />
                <path d="M74 74 96 52l18 12 30-30" fill="none" stroke="#8FD2FB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M74 74 96 52l18 12 30-30v34a6 6 0 0 1-6 6H80a6 6 0 0 1-6-6v-4Z" fill="rgba(143,210,251,.16)" />
                <g transform="rotate(8 168 18)">
                  <rect x="146" y="8" width="44" height="17" rx="8.5" fill="#8FD2FB" />
                  <text x="168" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0C2350">You Save!</text>
                </g>
                <g>
                  <ellipse cx="34" cy="112" rx="30" ry="11" fill="url(#sc-coin)" />
                  <ellipse cx="34" cy="98" rx="30" ry="11" fill="url(#sc-coin)" opacity=".92" />
                  <ellipse cx="34" cy="84" rx="30" ry="11" fill="url(#sc-coin)" opacity=".84" />
                  <ellipse cx="34" cy="70" rx="30" ry="11" fill="url(#sc-coin)" opacity=".76" />
                  <ellipse cx="34" cy="70" rx="20" ry="6.5" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.4" />
                </g>
              </svg>
              </div>
            </div>

            {/* comparison rows */}
            <div className="mt-6 space-y-[18px]">
              <div>
                <div className="flex items-baseline justify-between text-[12px]">
                  <p className="font-medium text-white/70">Current payments &bull; {apr}% APR</p>
                  <p className="font-bold text-white tabular-nums">{currentYears} years</p>
                </div>
                <div className="mt-[8px] h-[6px] rounded-full bg-white/15">
                  <div className="sc-bar-fill h-full rounded-full bg-white/40" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-[12px]">
                  <p className="font-medium text-white/70">Consolidation loan &bull; 8.9% APR</p>
                  <p className="font-bold text-white tabular-nums">
                    4 years &bull; ${consolPay.toLocaleString("en-US")}/mo
                  </p>
                </div>
                <div className="mt-[8px] h-[6px] rounded-full bg-white/15">
                  <div className="sc-bar-fill h-full rounded-full bg-gradient-to-r from-brand-400 to-[#8FD2FB]" style={{ width: `${consolBar}%` }} />
                </div>
              </div>
            </div>

            <a href="#quote" className="btn-on-dark btn-sheen mt-7 h-[46px] w-full text-[14px]">
              Check My Rate
            </a>
            <p className="mt-4 text-center text-[10.5px] text-white/50">
              Estimates only. Your actual rate depends on credit approval.
            </p>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

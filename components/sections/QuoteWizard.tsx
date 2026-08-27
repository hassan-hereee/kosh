"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { compact } from "@/lib/finance";

const PURPOSES = [
  "Consolidate debt",
  "Pay off credit cards",
  "Home improvement",
  "Major purchase",
  "Something else",
];
const CREDIT = ["Excellent (720+)", "Good (680-719)", "Fair (640-679)", "Building (<640)"];

const STEPS = [
  { title: "How much are you looking to borrow?", hint: "This helps us find the right options for you." },
  { title: "What's the purpose of your loan?", hint: "We'll match you with lenders who specialise in it." },
  { title: "How would you rate your credit?", hint: "An estimate is fine — this never affects your score." },
  { title: "Where should we send your options?", hint: "Soft check only. No impact on your credit score." },
];

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(25000);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [credit, setCredit] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const pct = ((amount - 5000) / 95000) * 100;
  const progress = done ? 100 : ((step + 1) / 4) * 100;

  const canAdvance =
    step === 0 ? true : step === 1 ? !!purpose : step === 2 ? !!credit : /\S+@\S+\.\S+/.test(email);

  const next = () => (step < 3 ? setStep(step + 1) : setDone(true));

  return (
    <div
      id="quote"
      className="w-full h-[480px] sm:h-[520px] flex flex-col rounded-[22px] border border-white/70 bg-surface-muted/95 px-5 pt-6 pb-8 shadow-[0_30px_70px_-24px_rgba(15,26,46,0.25),0_4px_14px_-6px_rgba(15,26,46,0.08)] backdrop-blur-sm sm:px-[36px] sm:pt-[36px] sm:pb-[48px]"
    >
      {/* header + progress */}
      <div className="flex items-baseline justify-between">
        <p className="text-[17px] font-bold tracking-[-0.01em] text-ink">Start with Confidence</p>
        <p className="text-[12.5px] font-bold text-brand-700">
          {done ? "Complete" : `Step ${step + 1} of 4`}
        </p>
      </div>
      <div className="mt-[16px] h-[8px] w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-brand-700 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-brand-700">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <path d="m5 12.8 4.4 4.4L19 7.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-5 text-[24px] font-bold leading-tight tracking-[-0.02em] text-ink">
            You&apos;re all set
          </p>
          <p className="mx-auto mt-2 max-w-[340px] text-[13.5px] leading-relaxed text-ink-500">
            We&apos;re matching {compact(amount)} against {purpose?.toLowerCase()} offers from 35+ partners. Your options land in your inbox shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setStep(0);
            }}
            className="mt-6 text-[13.5px] font-bold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
          >
            Start over
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="mt-[26px] max-w-[360px] text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-ink">
              {STEPS[step].title}
            </h3>
            <p className="mt-[14px] text-[14px] text-ink-500">{STEPS[step].hint}</p>

            <div className="flex-1 overflow-y-auto min-h-0">
              {/* --- Step 1: amount slider --- */}
              {step === 0 && (
                <div className="mt-[24px]">
                  <p className="flex items-baseline justify-center gap-[6px]">
                    <span className="text-[21px] font-medium text-ink-400">$</span>
                    <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-brand-700 tabular-nums">
                      {amount.toLocaleString("en-US")}
                    </span>
                  </p>
                  <input
                    type="range"
                    min={5000}
                    max={100000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    aria-label="Loan amount"
                    className="range mt-[26px]"
                    style={{
                      background: `linear-gradient(90deg,#174195 ${pct}%,#DBE7FB ${pct}%)`,
                    }}
                  />
                  <div className="mt-[12px] flex justify-between text-[12.5px] text-ink-400">
                    <span>$5,000</span>
                    <span>$100,000</span>
                  </div>
                </div>
              )}

              {/* --- Step 2 / 3: option chips --- */}
              {(step === 1 || step === 2) && (
                <div className="mt-[22px] grid gap-[10px]">
                  {(step === 1 ? PURPOSES : CREDIT).map((opt) => {
                    const selected = (step === 1 ? purpose : credit) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => (step === 1 ? setPurpose(opt) : setCredit(opt))}
                        className={cn(
                          "flex items-center justify-between rounded-[14px] border px-[18px] py-[15px] text-left text-[14px] font-medium transition-all",
                          selected
                            ? "border-brand-700 bg-brand-100 text-brand-700"
                            : "border-slate-200 bg-white text-ink hover:border-brand-400 hover:bg-brand-50",
                        )}
                      >
                        {opt}
                        <span
                          className={cn(
                            "grid h-[20px] w-[20px] place-items-center rounded-full border-2 transition-colors",
                            selected ? "border-brand-700 bg-brand-700" : "border-slate-300",
                          )}
                        >
                          {selected && <span className="h-[7px] w-[7px] rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* --- Step 4: email --- */}
              {step === 3 && (
                <div className="mt-[22px]">
                  <label htmlFor="wizard-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="wizard-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-[18px] py-[16px] text-[14px] text-ink outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                  <p className="mt-[12px] text-[12px] leading-relaxed text-ink-400">
                    Checking your rate uses a soft inquiry and won&apos;t affect your credit score.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-[34px] flex items-center gap-3 shrink-0">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn h-[52px] shrink-0 px-5 text-[14px] text-ink-500 hover:text-brand-700"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="btn-primary h-[52px] flex-1 text-[14px] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:bg-brand-500"
            >
              {step === 3 ? "See my options" : STEPS[step + 1].title}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

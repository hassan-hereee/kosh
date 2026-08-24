"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Stagger from "@/components/ui/Stagger";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import { BoltIcon, StarIcon } from "@/components/ui/icons";
import { CALL_PROMISE, CALL_SLOTS, CALL_TIMELINE, CONSULTANTS } from "@/lib/data";
import { TiltCard } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export default function Consultants() {
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F7FC_100%)] pt-20 pb-16 lg:pt-20 lg:pb-20 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading lead="10 Minutes That Could" accent="Change Your Finances." />

        {/* consultant cards */}
        <Stagger step={120} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONSULTANTS.map((c) => (
            <TiltCard key={c.name} max={5}>
              <article
                data-stagger
                className="card group flex h-full flex-col items-center p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
              >
                <span className="block overflow-hidden rounded-full ring-2 ring-brand-100 transition-all duration-300 group-hover:ring-brand-300">
                  <Image
                    src={c.photo}
                    alt={c.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-110"
                  />
                </span>
                <h3 className="mt-4 text-[15px] font-bold tracking-[-0.01em] text-ink">{c.name}</h3>
                <p className="mt-[5px] text-[13px] text-ink-500">
                  {c.role} &middot; {c.tenure}
                </p>
                <p className="mt-3 flex items-center gap-[7px] text-[11.5px] font-semibold text-ink-600">
                  <StarIcon className="h-[13px] w-[13px] text-[#F5A623]" />
                  {c.badge}
                </p>
                <a href="#book" className="btn-outline mt-5 h-[40px] px-5 text-[12.5px]">
                  {c.cta}
                </a>
              </article>
            </TiltCard>
          ))}
        </Stagger>

        {/* call walkthrough + booking */}
        <div id="book" className="mt-8 grid gap-6 lg:grid-cols-[1fr_470px]">
          <Reveal>
            <div className="card h-full p-7 sm:p-8">
            <h3 className="text-[14px] font-bold tracking-[-0.01em] text-ink">
              What the call is actually like
            </h3>

            <ul className="mt-1 divide-y divide-slate-100">
              {CALL_TIMELINE.map((row) => (
                <li key={row.when} className="grid grid-cols-[74px_1fr] gap-4 py-[15px]">
                  <span className="pt-[2px] text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-400">
                    {row.when}
                  </span>
                  <span className="text-[14px] leading-[1.65] text-ink-600">{row.what}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-slate-100 bg-surface-muted p-[18px] text-[14px] leading-[1.7] text-ink-500">
              <span className="font-bold text-ink">Our promise:</span> {CALL_PROMISE}
            </div>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <div className="bg-panel-navy h-full rounded-card p-7 shadow-panel sm:p-8">
            <h3 className="text-[13.5px] font-bold tracking-[-0.01em] text-white">
              Pick a time, your consultant calls you.
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {CALL_SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  aria-pressed={slot === s}
                  className={cn(
                    "rounded-lg border px-3 py-[13px] text-[12px] font-semibold transition-all",
                    slot === s
                      ? "border-white bg-white text-brand-800"
                      : "border-white/20 bg-white/5 text-white hover:border-white/45 hover:bg-white/10",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <button type="button" className="btn-on-dark mt-4 h-[46px] w-full text-[13.5px]">
              Call me in the next 2 minutes
              <BoltIcon className="h-[14px] w-[14px] text-[#F5A623]" />
            </button>

            <p className="mt-4 text-[11px] leading-[1.65] text-white/60">
              Enter your number and your consultant will already know your situation when they call.
              No repeating yourself.
            </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

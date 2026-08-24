"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Stagger from "@/components/ui/Stagger";
import { SquareBullet } from "@/components/ui/icons";
import { THREE_STEPS } from "@/lib/data";

export default function ThreeSteps() {
  return (
    <section id="how-it-works" className="bg-[linear-gradient(180deg,#EAF1FB_0%,#F3F7FC_100%)] py-16 lg:py-20 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading lead="Three Steps To" accent="Financial Freedom." breakAfterLead />

        <Stagger
          step={130}
          className="mx-auto mt-12 grid max-w-[1020px] gap-6 sm:grid-cols-3"
        >
          {THREE_STEPS.map((step) => (
            <div
              key={step.title}
              data-stagger
              className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
            >
              <div className="flex items-center gap-[9px]">
                <SquareBullet className="h-[13px] w-[13px] text-brand-700" />
                <h3 className="text-[14px] font-bold tracking-[-0.01em] text-ink">{step.title}</h3>
              </div>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-500">{step.body}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

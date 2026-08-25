"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Stagger from "@/components/ui/Stagger";
import SlideIn from "@/components/ui/SlideIn";
import { HorizontalPin } from "@/components/ui/scroll-fx";
import { JOURNEY_NOTE, JOURNEY_STEPS } from "@/lib/data";

export default function Journey() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white relative overflow-hidden max-[519px]:pt-[40px]">
      <HorizontalPin
        trackRef={trackRef}
        lineRef={lineRef}
        dotCount={JOURNEY_STEPS.length}
        className="bg-white overflow-hidden relative z-10"
      >
        {/* Pinned viewport (desktop) — heading + horizontal track + note */}
        <div className="flex min-h-[560px] flex-col justify-center py-0 lg:h-screen lg:min-h-0 lg:py-0">
          <div className="shell relative z-10">
            <SectionHeading lead="From Your First Call to" accent="Financial Freedom" breakAfterLead />
          </div>

          <Stagger
            step={130}
            className="mt-12 max-lg:snap-x max-lg:overflow-x-auto max-lg:no-scrollbar lg:mt-16"
          >
            <div
              ref={trackRef}
              className="relative grid w-full gap-10 px-6 sm:grid-cols-2 lg:flex lg:w-max lg:gap-[72px] lg:pl-[max(24px,calc((100vw-1200px)/2))] lg:pr-[max(48px,calc((100vw-1200px)/2))]"
            >
              {/* progress rail — draws across the whole scroll range (desktop) */}
              <div
                aria-hidden
                className="absolute left-0 top-[17px] hidden h-[2px] w-full bg-brand-100 lg:block"
              >
                <div
                  ref={lineRef}
                  className="h-full w-full origin-left bg-gradient-to-r from-brand-500 to-brand-700"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              {JOURNEY_STEPS.map((step, i) => (
                <article
                  key={step.title}
                  data-stagger
                  className="relative w-full shrink-0 snap-start lg:w-[360px]"
                >
                  <span className="tl-dot relative z-10 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-brand-500 to-brand-700 text-[13px] font-bold text-white shadow-pill">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[14px] font-bold tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-[9px] max-w-[300px] text-[13px] leading-[1.7] text-ink-500 lg:text-[14px]">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </Stagger>

          {/* warning note — stays inside the pinned viewport */}
          <div className="shell mt-14">
            <SlideIn
              direction="up"
              delay={150}
              className="mx-auto max-w-[1080px] rounded-xl border border-red-100 bg-[#FEF4F2] px-7 py-5"
            >
              <p className="text-[12.5px] font-bold text-[#B42318]">{JOURNEY_NOTE.title}</p>
              <p className="mt-[6px] text-[13px] leading-[1.65] text-ink-500">
                {JOURNEY_NOTE.body}
              </p>
            </SlideIn>
          </div>
        </div>
      </HorizontalPin>
    </section>
  );
}

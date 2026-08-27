"use client";

import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Stagger from "@/components/ui/Stagger";
import SlideIn from "@/components/ui/SlideIn";
import { gsap, reducedMotion } from "@/components/ui/gsap";
import { JOURNEY_NOTE, JOURNEY_STEPS } from "@/lib/data";

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport || reducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Desktop: pin the section and scroll the track sideways as you scroll. */
      mm.add("(min-width: 1024px)", () => {
        const distance = () =>
          Math.max(track.scrollWidth - section.offsetWidth, 0);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * 2}`,
            scrub: 1.5,
            pin: section,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.round(self.progress * (JOURNEY_STEPS.length - 1));
              track.querySelectorAll(".tl-dot").forEach((d, i) => {
                d.classList.toggle("is-active", i === active && self.progress > 0.02);
              });
            },
          },
        });

        tl.to(track, { x: () => -distance(), ease: "none" }, 0);
        if (line) {
          tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        }
      });

      /* Mobile: pin the section and scroll the track vertically as you scroll. */
      mm.add("(max-width: 1023px)", () => {
        const distance = () => Math.max(track.scrollHeight - viewport.offsetHeight, 0);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * 2.5}`,
            scrub: 1.5,
            pin: section,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.round(self.progress * (JOURNEY_STEPS.length - 1));
              track.querySelectorAll(".tl-dot").forEach((d, i) => {
                d.classList.toggle("is-active", i === active && self.progress > 0.02);
              });
            },
          },
        });

        tl.to(track, { y: () => -distance(), ease: "none" }, 0);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white relative max-[519px]:pt-[40px]"
    >
      <div className="flex min-h-[560px] flex-col justify-center py-0 lg:h-screen lg:min-h-0 lg:py-0">
        <div className="shell relative z-10">
          <SectionHeading lead="From Your First Call to" accent="Financial Freedom" breakAfterLead />
        </div>

        {/* Track viewport — clips on mobile, unconstrained on desktop */}
        <div
          ref={viewportRef}
          className="relative mx-auto mt-12 h-[55dvh] min-h-[280px] max-w-[1100px] overflow-hidden px-6 lg:mx-0 lg:mt-12 lg:h-auto lg:min-h-0 lg:max-w-none lg:overflow-visible lg:px-0"
        >

          <Stagger step={130}>
            <div
              ref={trackRef}
              className="relative grid w-full gap-8 sm:grid-cols-2 sm:gap-10 lg:flex lg:w-max lg:gap-[72px] lg:pl-[max(24px,calc((100vw-1200px)/2))] lg:pr-[max(48px,calc((100vw-1200px)/2))]"
            >
              {/* progress rail — draws across the whole scroll range (desktop) */}
              <div
                aria-hidden
                className="absolute left-0 top-[17px] hidden h-[2px] w-full bg-brand-100/50 lg:block"
              >
                {/* Glow base */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400/30 via-brand-500/30 to-brand-600/30 blur-[3px]" />
                {/* Animated fill */}
                <div
                  ref={lineRef}
                  className="h-full w-full origin-left"
                  style={{ transform: "scaleX(0)" }}
                >
                  {/* Main line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 blur-[4px] opacity-70" />
                  {/* Bright core */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 blur-[1px] opacity-90" />
                  {/* Traveling pulse at the end */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[8px] h-[8px] bg-brand-300 rounded-full blur-[2px] opacity-90" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[4px] h-[4px] bg-white rounded-full" />
                </div>
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
        </div>

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
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import MaskReveal from "@/components/ui/MaskReveal";
import { StarIcon } from "@/components/ui/icons";
import { TESTIMONIALS, TESTIMONIAL_SUMMARY } from "@/lib/data";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0 });
  const viewport = useRef<HTMLDivElement>(null);
  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);

  /* cards visible per view: 1 mobile / 2 sm / 3 lg — drives slide step + dots */
  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const apply = () => setPerView(mqLg.matches ? 3 : mqSm.matches ? 2 : 1);
    apply();
    mqLg.addEventListener("change", apply);
    mqSm.addEventListener("change", apply);
    return () => {
      mqLg.removeEventListener("change", apply);
      mqSm.removeEventListener("change", apply);
    };
  }, []);

  /* keep index in range when the visible count changes across breakpoints */
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  /* autoplay — pauses on hover/focus/drag */
  useEffect(() => {
    if (paused || dragging) return;
    const t = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      AUTOPLAY_MS,
    );
    return () => clearInterval(t);
  }, [paused, dragging, maxIndex]);

  const go = (next: number) =>
    setIndex(Math.max(0, Math.min(maxIndex, next)));

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current.startX = e.clientX;
    setDragging(true);
    setDragX(0);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) viewport.current?.setPointerCapture?.(e.pointerId);
    setDragX(dx);
  };
  const endDrag = () => {
    if (!dragging) return;
    const threshold = 70;
    if (dragX <= -threshold) go(index + 1);
    else if (dragX >= threshold) go(index - 1);
    setDragging(false);
    setDragX(0);
  };

  return (
    <section className="bg-white pt-16 pb-0 lg:pt-20 lg:pb-0 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading lead="Real stories." accent="Real results." />

        {/* rating summary pill */}
        <div className="mx-auto mt-7 flex w-fit items-center gap-4 rounded-full border border-slate-200/80 bg-white py-[9px] pl-3 pr-5 shadow-card">
          <span className="flex gap-[2px]" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-[13px] w-[13px] text-[#F5A623]" />
            ))}
          </span>
          <p className="text-[12px] text-ink-500">
            <span className="font-bold text-ink">{TESTIMONIAL_SUMMARY.score}</span>{" "}
            {TESTIMONIAL_SUMMARY.outOf}
          </p>
        </div>

        {/* carousel */}
        <MaskReveal wipe="left" zoom={1.03} className="mt-12">
          <div
            ref={viewport}
            className="touch-pan-y overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
          >
          <div
            className={cn(
              "flex select-none",
              !dragging && "transition-transform duration-500 ease-out",
              dragging && "cursor-grabbing",
            )}
            style={{ transform: `translateX(calc(${-(index * 100) / perView}% + ${dragX}px))` }}
          >
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.name} className="w-full shrink-0 px-[10px] sm:w-1/2 lg:w-1/3">
                <div className="bg-panel-navy flex h-full flex-col rounded-2xl p-7 shadow-panel">
                  <span className="flex gap-[3px]" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <StarIcon key={s} className="h-[15px] w-[15px] text-[#F5C044]" />
                    ))}
                  </span>
                  <figcaption className="mt-4 text-[15px] font-bold tracking-[-0.01em] text-white">
                    {t.name}
                  </figcaption>
                  <p className="mt-[6px] text-[12.5px] font-semibold text-white/90">{t.headline}</p>
                  <blockquote className="mt-3 flex-1 text-[12.5px] leading-[1.75] text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
              </figure>
            ))}
          </div>
          </div>
        </MaskReveal>

        {/* dots */}
        <div className="mt-9 flex justify-center gap-[7px]">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={index === i}
              className={`h-[7px] rounded-full transition-all duration-300 ${
                index === i ? "w-[22px] bg-brand-500" : "w-[7px] bg-slate-300 hover:bg-brand-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

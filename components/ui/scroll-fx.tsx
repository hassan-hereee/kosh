"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, reducedMotion, useGSAP } from "@/components/ui/gsap";

/* ------------------------------------------------------------------ */
/* Legacy GsapParallax (kept for backward compatibility)              */
/* ------------------------------------------------------------------ */
export function GsapParallax({
  children,
  speed = 0.12,
  className,
}: {
  children: ReactNode;
  /** positive = moves slower/up as you scroll down */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || reducedMotion()) return;
      gsap.to(ref.current, {
        y: () => speed * -220,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current?.parentElement ?? ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic scrub tween — animates `to` vars, progress-linked to scroll */
/* ------------------------------------------------------------------ */
export function ScrollScrub({
  children,
  to,
  from,
  start = "top 88%",
  end = "top 30%",
  className,
}: {
  children: ReactNode;
  /** destination tween vars, e.g. { scale: 1, opacity: 1 } */
  to: gsap.TweenVars;
  /** optional starting vars (set before scroll linkage) */
  from?: gsap.TweenVars;
  start?: string;
  end?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      if (from) gsap.set(el, from);
      gsap.to(el, {
        ...to,
        ease: "none",
        scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Horizontal pin — pins the section while its track scrolls sideways. */
/* Falls back to native horizontal swipe below lg / reduced motion.    */
/* ------------------------------------------------------------------ */
export function HorizontalPin({
  trackRef,
  lineRef,
  dotCount = 0,
  onProgress,
  children,
  className,
}: {
  trackRef: React.RefObject<HTMLElement>;
  /** progress line element drawn left→right across the whole scroll range */
  lineRef?: React.RefObject<HTMLElement>;
  /** number of .tl-dot elements inside track; nearest one gains .is-active */
  dotCount?: number;
  onProgress?: (p: number) => void;
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = root.current;
      const track = trackRef.current;
      if (!wrap || !track || reducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = () => Math.max(track.scrollWidth - wrap.offsetWidth, 0);
        if (distance() === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              onProgress?.(self.progress);
              if (dotCount > 0) {
                const active = Math.round(self.progress * (dotCount - 1));
                track.querySelectorAll(".tl-dot").forEach((d, i) => {
                  d.classList.toggle("is-active", i === active && self.progress > 0.02);
                });
              }
            },
          },
        });

        tl.to(track, { x: () => -distance(), ease: "none" }, 0);
        if (lineRef?.current) {
          tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Velocity marquee — CSS-free GSAP loop that speeds up with scrolling */
/* ------------------------------------------------------------------ */
export function VelocityMarquee({
  children,
  baseDuration = 26,
  maxBoost = 3.2,
  className,
}: {
  children: ReactNode;
  baseDuration?: number;
  maxBoost?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;

      const loop = gsap.to(el, {
        xPercent: -50,
        duration: baseDuration,
        ease: "none",
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = Math.abs(self.getVelocity());
          const boost = 1 + Math.min(v / 900, maxBoost - 1);
          gsap.to(loop, { timeScale: boost, duration: 0.35, overwrite: true });
        },
      });

      const settle = () => gsap.to(loop, { timeScale: 1, duration: 0.9, overwrite: true });
      const idle = setInterval(settle, 260);
      el.addEventListener("mouseenter", () => gsap.to(loop, { timeScale: 0, duration: 0.4, overwrite: true }));
      el.addEventListener("mouseleave", settle);

      return () => {
        clearInterval(idle);
        st.kill();
        loop.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("flex w-max items-center", className)}>
      {children}
    </div>
  );
}

/* Re-export so sections can import everything motion-related from one place */
export { ScrollTrigger };

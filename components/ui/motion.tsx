"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Shared in-view hook                                                 */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.25, rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Kinetic typography — word-by-word rise + de-blur                    */
/* ------------------------------------------------------------------ */
export function SplitWords({
  text,
  baseDelay = 0,
  step = 55,
  className,
  wordClassName,
}: {
  text: string;
  baseDelay?: number;
  step?: number;
  className?: string;
  /** extra classes for every word span (e.g. "text-gradient") */
  wordClassName?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <span
            className={cn(
              "inline-block will-change-[transform,filter] transition-[transform,opacity,filter] duration-[700ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none",
              wordClassName,
            )}
            style={{
              transitionDelay: `${baseDelay + i * step}ms`,
              transform: inView ? "translateY(0)" : "translateY(115%)",
              opacity: inView ? 1 : 0,
              filter: inView ? "blur(0px)" : "blur(7px)",
            }}
          >
            {word}
            {"\u00A0"}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Mount-time rise (hero copy)                                         */
/* ------------------------------------------------------------------ */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOn(true);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const go = () => {
      if (!cancelled) timers.push(setTimeout(() => setOn(true), 60));
    };

    /* Wait for the PageIntro curtain when it will play this session. */
    if (window.__ppIntroDone) {
      go();
    } else {
      window.addEventListener("pp:intro-done", go, { once: true });
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("pp:intro-done", go);
    };
  }, []);

  return (
    <div
      className={cn(
        "transition-[transform,opacity,filter] duration-[800ms] ease-[cubic-bezier(.22,.61,.36,1)] will-change-[transform,opacity]",
        on ? "translate-y-0 opacity-100 blur-0" : "translate-y-7 opacity-0 blur-[6px]",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic wrapper                                                    */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const loop = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - (r.left + r.width / 2)) * strength;
      target.y = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3D tilt card                                                        */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const disabled = useRef(false);

  useEffect(() => {
    disabled.current = prefersReducedMotion();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || disabled.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number                                                     */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (done.current || prefersReducedMotion()) {
      done.current = true;
      setVal(to);
      return;
    }
    let raf = 0;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else done.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Self-drawing SVG rule                                               */
/* ------------------------------------------------------------------ */
export function SvgRule({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} aria-hidden className={cn("absolute inset-x-0 top-[17px] h-[2px]", className)}>
      <svg className="h-full w-full" viewBox="0 0 1000 2" preserveAspectRatio="none">
        <path
          d="M0 1 H1000"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          className="text-brand-100 transition-[stroke-dashoffset] duration-[1500ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
          style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1 }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Masked zoom reveal (images, avatars)                                */
/* ------------------------------------------------------------------ */
export function ZoomIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);

  return (
    <span
      ref={ref}
      className={cn("block overflow-hidden will-change-transform", className)}
    >
      <span
        className="block transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
        style={{
          transitionDelay: `${delay}ms`,
          transform: inView ? "scale(1)" : "scale(1.18)",
          opacity: inView ? 1 : 0,
        }}
      >
        {children}
      </span>
    </span>
  );
}

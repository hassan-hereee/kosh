"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered stagger container.
 *
 * When the container enters the viewport it gains `.stagger-in`, and every
 * descendant marked with `data-stagger` fades/lifts in with an incremental
 * transition-delay (`step` ms apart). Works on raw elements:
 *
 *   <Stagger className="grid sm:grid-cols-3 gap-6">
 *     {cards.map(c => <article key={c.id} data-stagger .../>)}
 *   </Stagger>
 *
 * …or via the <Stagger.Item> wrapper when you can't touch the element.
 */
export default function Stagger({
  children,
  step = 90,
  baseDelay = 0,
  threshold = 0.15,
  className,
}: {
  children: ReactNode;
  step?: number;
  baseDelay?: number;
  threshold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shown) return;
    el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((kid, i) => {
      kid.style.transitionDelay = `${baseDelay + i * step}ms`;
    });
  }, [shown, baseDelay, step]);

  return (
    <div
      ref={ref}
      className={cn(shown && "stagger-in", className)}
    >
      {children}
    </div>
  );
}

/** Convenience wrapper that simply carries the data-stagger attribute. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger className={className}>
      {children}
    </div>
  );
}

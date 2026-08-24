"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Wipe = "up" | "down" | "left" | "right";

/** inset() start values per direction — the edge the wipe travels toward. */
const FROM: Record<Wipe, string> = {
  up: "inset(0% 0% 100% 0%)",
  down: "inset(100% 0% 0% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
};

/**
 * Clip-path mask reveal: children are hidden behind an inset clip that wipes
 * open when scrolled into view, with a subtle inner scale for depth.
 *
 * The observed element is an UNCLIPPED wrapper — a self-clipped target never
 * reaches an IntersectionObserver ratio threshold in Chromium (the clip is
 * applied to the intersection rect), so the trigger lives one level up.
 */
export default function MaskReveal({
  children,
  wipe = "up",
  delay = 0,
  duration = 900,
  zoom = 1.12,
  className,
}: {
  children: ReactNode;
  wipe?: Wipe;
  delay?: number;
  duration?: number;
  /** inner scale start (1 = no zoom) */
  zoom?: number;
  className?: string;
}) {
  const watch = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = watch.current;
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
      { threshold: 0.22 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={watch} className={className}>
      <div
        className="will-change-[clip-path]"
        style={{
          clipPath: shown ? "inset(0% 0% 0% 0%)" : FROM[wipe],
          transition: `clip-path ${duration}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        }}
      >
        <div
          className="h-full w-full will-change-transform"
          style={{
            transform: shown ? "scale(1)" : `scale(${zoom})`,
            transition: `transform ${duration}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

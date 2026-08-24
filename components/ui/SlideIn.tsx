"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

const VECTORS: Record<Direction, [number, number]> = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
};

/** Slides children into place from any direction once they enter the viewport. */
export default function SlideIn({
  children,
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 700,
  threshold = 0.12,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span" | "h2" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
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
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const [vx, vy] = VECTORS[direction];

  return (
    <Tag
      // @ts-expect-error -- ref is valid for every allowed tag
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none will-change-[transform,opacity]",
        className,
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? undefined : `translate3d(${vx * distance}px, ${vy * distance}px, 0)`,
      }}
    >
      {children}
    </Tag>
  );
}

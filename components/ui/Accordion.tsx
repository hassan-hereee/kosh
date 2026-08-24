"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionEntry = {
  q: string;
  a: string;
};

/**
 * Single-open accordion. Height animates via the grid-template-rows trick
 * (no JS measurement), chevron rotates, full keyboard support.
 */
export default function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: readonly AccordionEntry[];
  className?: string;
  /** index open on mount; -1 = all closed */
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <ul className={cn("divide-y divide-slate-100", className)}>
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={`${baseId}-btn-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="group flex w-full items-center justify-between gap-4 py-[16px] text-left"
              >
                <span
                  className={cn(
                    "text-[13px] font-bold tracking-[-0.01em] transition-colors",
                    expanded ? "text-brand-700" : "text-ink group-hover:text-brand-700",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all duration-300",
                    expanded
                      ? "rotate-45 border-brand-500 bg-brand-500 text-white"
                      : "border-slate-200 text-ink-500 group-hover:border-brand-300 group-hover:text-brand-700",
                  )}
                >
                  <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-btn-${i}`}
              className="grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "pb-[18px] pr-9 text-[12.5px] leading-[1.7] text-ink-600 transition-opacity duration-300",
                    expanded ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}


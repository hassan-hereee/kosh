"use client";

import { cn } from "@/lib/utils";
import { SplitWords } from "@/components/ui/motion";
import Reveal from "@/components/ui/Reveal";

/**
 * Two-tone section heading: leading clause in ink, trailing clause in brand blue.
 * With `animated`, words rise + de-blur as the heading enters the viewport.
 */
export default function SectionHeading({
  lead,
  accent,
  lede,
  className,
  align = "center",
  id,
  animated = true,
  breakAfterLead = false,
}: {
  lead: string;
  accent?: string;
  lede?: string;
  className?: string;
  align?: "center" | "left";
  id?: string;
  animated?: boolean;
  breakAfterLead?: boolean;
}) {
  const leadWordCount = lead.split(" ").length;

  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <h2
        id={id}
        className={cn(
          "text-[30px] font-bold leading-[1.24] tracking-[-0.022em] text-ink sm:text-[38px] lg:text-[42px]",
        )}
      >
        {animated ? (
          <>
            <SplitWords text={lead} />
            {breakAfterLead ? <br /> : null}
            {accent ? (
              <span className="text-brand-700">
                <SplitWords text={accent} baseDelay={leadWordCount * 55 + 70} />
              </span>
            ) : null}
          </>
        ) : (
          <>
            {lead}
            {breakAfterLead ? <br /> : " "}
            {accent ? <span className="text-brand-700">{accent}</span> : null}
          </>
        )}
      </h2>
      {lede ? (
        <Reveal delay={260} className="mt-[14px]">
          <p
            className={cn(
              "text-[15px] leading-[1.7] text-ink-500 sm:text-[16px]",
              align === "center" ? "mx-auto max-w-[540px]" : "max-w-[540px]",
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

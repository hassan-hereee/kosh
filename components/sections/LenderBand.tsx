"use client";

import { MARKETPLACE_DISCLAIMER, MARKETPLACE_LENDERS } from "@/lib/data";
import { VelocityMarquee } from "@/components/ui/scroll-fx";

export default function LenderBand() {
  // duplicated once so the -50% marquee translate loops seamlessly
  const track = [...MARKETPLACE_LENDERS, ...MARKETPLACE_LENDERS];

  return (
    <section className="bg-band py-[30px] lg:h-[152px] lg:py-0 relative overflow-hidden">
      <div className="flex h-full flex-col justify-center relative z-10">
        <div className="flex flex-col items-center gap-4 overflow-hidden lg:flex-row lg:items-center lg:gap-6">
          <p className="shrink-0 text-center text-[17px] font-medium tracking-[-0.015em] text-white lg:pl-[120px]">
            Lenders on our marketplace
          </p>

          <div className="mask-fade-x relative w-full overflow-hidden lg:flex-1">
            <VelocityMarquee baseDuration={26}>
              {track.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  aria-hidden={i >= MARKETPLACE_LENDERS.length}
                  className="whitespace-nowrap pr-[46px] text-[22px] font-extrabold tracking-[-0.02em] text-white"
                >
                  {name}
                </span>
              ))}
            </VelocityMarquee>
          </div>
        </div>

        <p className="mt-[22px] px-6 text-center text-[11.5px] leading-relaxed text-white/70">
          {MARKETPLACE_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}

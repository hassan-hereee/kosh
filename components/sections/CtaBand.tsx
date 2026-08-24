"use client";

import { CTA_LEDE } from "@/lib/data";
import { Magnetic } from "@/components/ui/motion";
import SlideIn from "@/components/ui/SlideIn";

export default function CtaBand() {
  return (
    <section className="bg-cta relative overflow-hidden py-16 lg:py-20">
      <div className="shell relative text-center z-10">
        <h2 className="mx-auto max-w-[660px] text-[30px] font-bold leading-[1.28] tracking-[-0.025em] text-white sm:text-[38px] lg:text-[42px]">
          Your Next Chapter Starts{" "}
          <span className="text-gradient-light">With One Thoughtful</span> Step.
        </h2>

        <SlideIn direction="up" delay={200}>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-[1.7] text-white/75">
            {CTA_LEDE}
          </p>
        </SlideIn>

        <SlideIn direction="up" delay={340} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={0.24}>
            <a href="#quote" className="btn-on-dark btn-sheen btn-lg px-[30px]">
              Get Started
            </a>
          </Magnetic>
          <Magnetic strength={0.24}>
            <a href="#book" className="btn-ghost-on-dark btn-lg px-[30px]">
              Contact Us
            </a>
          </Magnetic>
        </SlideIn>
      </div>
    </section>
  );
}

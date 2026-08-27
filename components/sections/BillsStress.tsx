"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/ui/Logo";
import { gsap, reducedMotion } from "@/components/ui/gsap";
import { BILL_CARDS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function BillsStress() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const mouseLiveRef = useRef(true);
  const consolidatedRef = useRef(false);

  /* Scatter % positions are tuned for the desktop stage; on narrow phones a
     dedicated spread keeps clear gaps between cards while they scale down. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 519px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    if (reducedMotion()) {
      stage.querySelectorAll<HTMLElement>("[data-bill]").forEach((b) => {
        b.style.visibility = "hidden";
      });
      const card = stage.querySelector<HTMLElement>("[data-consol]");
      if (card) gsap.set(card, { autoAlpha: 1, scale: 1, xPercent: -50, yPercent: -50 });
      return;
    }

    const ctx = gsap.context(() => {
      const bills = gsap.utils.toArray<HTMLElement>("[data-bill]", stage);
      const card = stage.querySelector<HTMLElement>("[data-consol]")!;

      const rotDeg = (t: HTMLElement) => parseFloat(t.dataset.rotate ?? "0");

      /* ---- entrance: bills tumble into their scatter ---- */
      gsap.set(bills, {
        autoAlpha: 0,
        scale: 0.55,
        rotate: (i, t) => rotDeg(t as HTMLElement) - 18,
        y: 26,
      });
      gsap.set(card, { autoAlpha: 0, scale: 0.75, xPercent: -50, yPercent: -50 });

      /* ---- mouse depth: each bill drifts with the cursor at its own depth ---- */
      const setters = bills.map((b, i) => ({
        x: gsap.quickTo(b, "x", { duration: 0.75, ease: "power3" }),
        y: gsap.quickTo(b, "y", { duration: 0.75, ease: "power3" }),
        d: 7 + ((i * 37) % 12), // 7–18px pseudo-depth, stable per bill
      }));

      const onMove = (e: MouseEvent) => {
        if (!mouseLiveRef.current) return;
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setters.forEach((s) => {
          s.x(nx * s.d);
          s.y(ny * s.d);
        });
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      /* ---- single scrubbed timeline: entrance → hold → consolidate ---- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80px",
          end: "+=100%",
          scrub: 0.8,
          pin: section,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const pastHalf = self.progress > 0.5;
            mouseLiveRef.current = !pastHalf;
            if (pastHalf && !consolidatedRef.current) {
              consolidatedRef.current = true;
              stage.classList.add("is-consolidated");
              stage.querySelectorAll<HTMLElement>("[data-bill]").forEach((b) => {
                b.setAttribute("aria-hidden", "true");
              });
              stage.querySelector("[data-consol]")?.removeAttribute("aria-hidden");
              const wm = stage.querySelector<HTMLElement>("[data-watermark]");
              if (wm) wm.style.opacity = "0.05";
            }
          },
        },
      });

      /* Phase 1 — bills tumble in (0 → 0.4) */
      tl.to(bills, {
        autoAlpha: 1,
        scale: 1,
        rotate: (i, t) => rotDeg(t as HTMLElement),
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
        stagger: { each: 0.03, from: "random" },
      }, 0);

      /* Phase 2 — hold (0.4 → 0.55) */
      tl.to({}, { duration: 0.15 });

      /* Phase 3 — bills consolidate into card (0.55 → 0.85) */
      tl.to(bills, {
        x: (i, t) => ((50 - parseFloat((t as HTMLElement).style.left)) / 100) * stage.offsetWidth * 0.92,
        y: (i, t) => ((50 - parseFloat((t as HTMLElement).style.top)) / 100) * stage.offsetHeight * 0.94,
        rotate: 0,
        scale: 0.24,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power3.inOut",
        overwrite: "auto",
        stagger: { each: 0.02, from: "edges" },
      });

      tl.to(card, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power3.out" }, "<+0.05");

      /* settle pop */
      tl.to(card, { scale: 1.015, duration: 0.08, ease: "power2.out" });
      tl.to(card, { scale: 1, duration: 0.12, ease: "power2.out" });

      return () => {
        window.removeEventListener("mousemove", onMove);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-white pt-[58px] pb-16 lg:pt-[90px] lg:pb-20">
      <div className="shell">
        <SectionHeading lead="More bills." accent="More stress." />

        {/* stage */}
        <div ref={stageRef} className="relative mx-auto mt-8 h-[420px] max-w-[1100px] max-[519px]:h-[340px] lg:mt-12 lg:h-[470px]">
          {/* watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div data-wm className="will-change-transform">
              <div
                className="opacity-[0.09] transition-opacity duration-700"
                data-watermark
              >
                <LogoMark className="h-[53px] w-[163px]" />
              </div>
            </div>
          </div>

          {/* scattered bills */}
          {BILL_CARDS.map((bill) => (
            <div
              key={bill.id}
              data-bill
              data-rotate={bill.rotate}
              aria-hidden
              className="absolute w-[175px] will-change-transform max-[519px]:w-[clamp(108px,32vw,130px)] sm:w-[190px]"
              style={{
                left: `${compact ? bill.m.x : bill.x}%`,
                top: `${compact ? bill.m.y : bill.y}%`,
              }}
            >
              <div
                className={cn(
                  "rounded-xl border border-slate-200/80 bg-white px-6 py-5 shadow-tilt max-[519px]:px-4 max-[519px]:py-3.5",
                  "animate-floatY",
                )}
                style={{ animationDelay: `${bill.delay}s` }}
              >
                <p className="text-[11.5px] font-medium text-ink-400">{bill.label}</p>
                <p
                  className={cn(
                    "mt-[5px] text-[21px] font-bold leading-none tracking-[-0.02em]",
                    bill.tone === "danger" ? "text-danger" : "text-ink",
                  )}
                >
                  {bill.value}
                  {"unit" in bill && bill.unit ? (
                    <span className="text-[13px] font-semibold text-ink-400">{bill.unit}</span>
                  ) : null}
                </p>
                <p className="mt-[6px] text-[11.5px] font-medium text-ink-400">{bill.sub}</p>
              </div>
            </div>
          ))}

          {/* consolidated payment card */}
          <div
            data-consol
            aria-hidden
            className="absolute left-1/2 top-1/2 w-[min(300px,calc(100%-20px))] will-change-transform"
          >
            <div className="bg-panel-navy no-grid rounded-2xl px-7 py-8 text-center shadow-panel">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-300">
                PriorityPlus
              </p>
              <p className="mt-3 flex items-baseline justify-center">
                <span className="text-[44px] font-bold leading-none tracking-[-0.03em] text-white tabular-nums">
                  $318
                </span>
                <span className="ml-1 text-[15px] font-semibold text-white/60">/mo</span>
              </p>
              <p className="mt-3 text-[12px] font-medium text-white/70">
                One simple payment. Every bill handled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

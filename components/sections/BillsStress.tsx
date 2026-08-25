"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/ui/Logo";
import { gsap, reducedMotion } from "@/components/ui/gsap";
import { BILL_CARDS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function BillsStress() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [consolidated, setConsolidated] = useState(false);
  const [compact, setCompact] = useState(false);

  /* Scatter % positions are tuned for the desktop stage; on narrow phones they
     push bills past the viewport edge, so compress the spread toward centre. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 479px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (reducedMotion()) {
      stage.querySelectorAll<HTMLElement>("[data-bill]").forEach((b) => {
        b.style.visibility = "hidden";
      });
      setConsolidated(true);
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
      let mouseLive = true;
      const setters = bills.map((b, i) => ({
        x: gsap.quickTo(b, "x", { duration: 0.75, ease: "power3" }),
        y: gsap.quickTo(b, "y", { duration: 0.75, ease: "power3" }),
        d: 7 + ((i * 37) % 12), // 7–18px pseudo-depth, stable per bill
      }));

      const onMove = (e: MouseEvent) => {
        if (!mouseLive) return;
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setters.forEach((s) => {
          s.x(nx * s.d);
          s.y(ny * s.d);
        });
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      /* ---- consolidation: bills arc into one payment, card pops ---- */
      const fly = gsap.timeline({
        paused: true,
        delay: 1.25,
        onStart: () => {
          mouseLive = false;
          setConsolidated(true);
        },
      });
      fly.to(bills, {
        x: (i, t) => ((50 - parseFloat((t as HTMLElement).style.left)) / 100) * stage.offsetWidth * 0.92,
        y: (i, t) => ((50 - parseFloat((t as HTMLElement).style.top)) / 100) * stage.offsetHeight * 0.94,
        rotate: 0,
        scale: 0.24,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: "auto",
        stagger: { each: 0.06, from: "edges" },
      }, 0);
      fly.to(card, { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power3.out" }, 0.5);

      /* ---- refined controlled settle after convergence (no elastic) ---- */
      fly.to(card, {
        scale: 1.015,
        duration: 0.35,
        ease: "power2.out",
      }).to(card, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      const enter = gsap.timeline({
        scrollTrigger: { trigger: stage, start: "top 72%", once: true },
        onComplete: () => fly.play(),
      });
      enter.to(bills, {
        autoAlpha: 1,
        scale: 1,
        rotate: (i, t) => rotDeg(t as HTMLElement),
        y: 0,
        duration: 0.95,
        ease: "back.out(1.7)",
        stagger: { each: 0.065, from: "random" },
      });

      return () => {
        window.removeEventListener("mousemove", onMove);
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="overflow-hidden bg-white pt-[58px] pb-16 lg:pt-[90px] lg:pb-20">
      <div className="shell">
        <SectionHeading lead="More bills." accent="More stress." />

        {/* stage */}
        <div ref={stageRef} className="relative mx-auto mt-8 h-[340px] max-w-[1100px] sm:h-[420px] lg:mt-12 lg:h-[470px]">
          {/* watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div data-wm className="will-change-transform">
              <div
                className={cn(
                  "opacity-[0.09] transition-opacity duration-700",
                  consolidated && "opacity-[0.05]",
                )}
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
              aria-hidden={consolidated}
              className="absolute w-[128px] will-change-transform sm:w-[164px]"
              style={{
                left: `${compact ? 6 + bill.x * 0.82 : bill.x}%`,
                top: `${compact ? 2 + bill.y * 0.9 : bill.y}%`,
              }}
            >
              <div
                className={cn(
                  "rounded-xl border border-slate-200/80 bg-white p-4 shadow-tilt",
                  !consolidated && "animate-floatY",
                )}
                style={{ animationDelay: `${bill.delay}s` }}
              >
                <p className="text-[10.5px] font-medium text-ink-400">{bill.label}</p>
                <p
                  className={cn(
                    "mt-[5px] text-[19px] font-bold leading-none tracking-[-0.02em]",
                    bill.tone === "danger" ? "text-danger" : "text-ink",
                  )}
                >
                  {bill.value}
                  {"unit" in bill && bill.unit ? (
                    <span className="text-[12px] font-semibold text-ink-400">{bill.unit}</span>
                  ) : null}
                </p>
                <p className="mt-[6px] text-[10.5px] font-medium text-ink-400">{bill.sub}</p>
              </div>
            </div>
          ))}

          {/* consolidated payment card */}
          <div
            data-consol
            aria-hidden={!consolidated}
            className="absolute left-1/2 top-1/2 w-[300px] will-change-transform"
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

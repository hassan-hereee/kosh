"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { gsap, reducedMotion } from "@/components/ui/gsap";

declare global {
  interface Window {
    __ppIntroDone?: boolean;
  }
}

const SESSION_KEY = "pp-intro-played";

/**
 * First-visit load transition: brand curtain covers the page, logo pops,
 * then the panel wipes up to reveal the hero. Plays once per browser
 * session; skipped entirely for reduced-motion users.
 *
 * Signals completion via `window.__ppIntroDone` + the `pp:intro-done`
 * event so mount-time entrances (Rise) wait for the reveal.
 */
export default function PageIntro() {
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const finish = () => {
      window.__ppIntroDone = true;
      window.dispatchEvent(new Event("pp:intro-done"));
    };

    if (
      reducedMotion() ||
      sessionStorage.getItem(SESSION_KEY) ||
      !root.current
    ) {
      finish();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setMounted(true);
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setMounted(false);
          finish();
        },
      });

      tl.fromTo(
        "[data-intro-mark]",
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.7)" },
      )
        .fromTo(
          "[data-intro-word]",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
          "-=0.25",
        )
        .to("[data-intro-inner]", {
          yPercent: -40,
          opacity: 0,
          duration: 0.45,
          delay: 0.35,
        })
        .to(root.current, {
          yPercent: -100,
          duration: 0.85,
        });
    }, root);

    // safety hatch — never trap the user behind the curtain
    const bail = setTimeout(() => {
      ctx.kill();
      document.documentElement.style.overflow = "";
      setMounted(false);
      finish();
    }, 3500);

    return () => {
      clearTimeout(bail);
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="bg-panel-navy fixed inset-0 z-[200] grid place-items-center will-change-transform"
    >
      <div data-intro-inner className="flex flex-col items-center gap-5">
        <div data-intro-mark data-intro-word>
          <LogoMark className="h-[53px] w-[163px]" />
        </div>
      </div>
    </div>
  );
}

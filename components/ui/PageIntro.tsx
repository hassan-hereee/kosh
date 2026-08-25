"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/components/ui/gsap";

declare global {
  interface Window {
    __ppIntroDone?: boolean;
  }
}

/**
 * Premium initial load transition: two full-height vertical panels meet at
 * the exact centre of the viewport and cover the page on first paint. After a
 * short intro beat the panels slide apart like doors — left off-screen to the
 * left, right off-screen to the right — progressively revealing the rendered
 * website underneath. The reveal is driven purely by transform, not opacity
 * or blur.
 *
 * The overlay is part of the server-rendered markup (never gated behind a
 * mount flag) so the panels are present from the very first paint — there is
 * no flash of content behind them, and hydration matches exactly.
 *
 * Plays on every full page load (refresh). Reduced-motion users get an
 * immediate, invisible reveal. The loader is removed from the DOM once the
 * doors finish opening, so it can never interfere with the page.
 *
 * Completion is signalled via `window.__ppIntroDone` + the `pp:intro-done`
 * event so mount-time entrances (Rise) can wait for the reveal.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function PageIntro() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const finish = () => {
      window.__ppIntroDone = true;
      window.dispatchEvent(new Event("pp:intro-done"));
      setDone(true);
    };

    if (reducedMotion() || !root.current) {
      finish();
      return;
    }

    /* Lock scroll + interaction, compensating for the scrollbar so the
       layout does not shift when the bar disappears. */
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          document.body.style.paddingRight = "";
          finish();
        },
      });

      /* Brand name clears just as the doors begin to part. */
      tl.to(
        content.current,
        { autoAlpha: 0, duration: 0.4, ease: "power2.out" },
        0.2,
      )
        /* Two panels slide apart from the centre, revealing the site
           underneath. Driven purely by transform. */
        .to(
          left.current,
          { xPercent: -100, duration: 0.9 },
          0.3,
        )
        .to(
          right.current,
          { xPercent: 100, duration: 0.9 },
          0.3,
        );
    }, root);

    /* Safety hatch — never trap the user behind the doors. */
    const bail = setTimeout(() => {
      ctx.kill();
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
      finish();
    }, 4000);

    return () => {
      clearTimeout(bail);
      ctx.revert();
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="pp-intro fixed inset-0 z-[200]"
    >
      <div
        ref={left}
        data-intro-left
        className="pp-intro__panel pp-intro__panel--left absolute inset-y-0 left-0 w-[50.3%] will-change-transform"
      />
      <div
        ref={right}
        data-intro-right
        className="pp-intro__panel pp-intro__panel--right absolute inset-y-0 right-0 w-[50.3%] will-change-transform"
      />
      <div
        ref={content}
        data-intro-content
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <span
          className="select-none whitespace-nowrap px-4 text-[10vw] font-extrabold uppercase leading-none tracking-tight"
          style={{
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.9)",
            transform: "scaleX(1.15)",
          }}
        >
          PriorityPlus
        </span>
      </div>

      <noscript>
        <style
          dangerouslySetInnerHTML={{ __html: `.pp-intro{display:none !important;}` }}
        />
      </noscript>
    </div>
  );
}

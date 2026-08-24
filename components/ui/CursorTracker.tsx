"use client";

import { useEffect, useRef } from "react";

/**
 * ── The Plus Instrument ──────────────────────────────────────────────
 * PriorityPlus-branded cursor built from the site's own design language:
 *
 *   • core     — the brand "+" mark, glued to the pointer; it rotates
 *                45° into a × over interactive elements and spins on press
 *   • arc      — a radar-style SVG ring stroked with the brand gradient;
 *                the arc sweeps continuously, tightens on target-lock,
 *                and deforms along the travel axis with real springs
 *   • glow     — a soft brand-blue bloom trailing far behind on its own
 *                ultra-lazy spring; breathes while the cursor rests
 *   • lens     — over [data-cursor-label] zones the ring floods into a
 *                frosted white pill (same treatment as the site nav)
 *                holding a brand-blue label
 *
 * Theme-aware: over navy surfaces (.bg-panel-navy / .bg-band / .bg-cta)
 * the ink cross-fades to pale sky so it stays crisp everywhere.
 *
 * Fine pointers only; honours prefers-reduced-motion.
 */

const CORE_LIGHT = "#174195";
const CORE_DARK = "#CFE4FF";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CursorTracker() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const trackRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const pingLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const glow = glowRef.current;
    const ringWrap = ringWrapRef.current;
    const arc = arcRef.current;
    const track = trackRef.current;
    const svg = svgRef.current;
    const plus = plusRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;
    const pingLayer = pingLayerRef.current;
    if (!glow || !ringWrap || !arc || !track || !svg || !plus || !label || !labelText || !pingLayer)
      return;

    document.documentElement.classList.add("pp-cursor-active");

    /* ── raw pointer ── */
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let seen = false;
    let lastMove = performance.now();
    let alive = true;

    /* ── damped springs (k, damping) ── */
    const spring = (k: number, damp: number) => ({
      x: mx,
      y: my,
      vx: 0,
      vy: 0,
      step(tx: number, ty: number) {
        this.vx = (this.vx + (tx - this.x) * k) * damp;
        this.vy = (this.vy + (ty - this.y) * k) * damp;
        this.x += this.vx;
        this.y += this.vy;
      },
      reset(px: number, py: number) {
        this.x = px;
        this.y = py;
        this.vx = 0;
        this.vy = 0;
      },
    });
    const plusS = spring(0.55, 0.58); // glued to the pointer
    const ringS = spring(0.115, 0.78); // lazy, elastic overshoot
    const glowS = spring(0.045, 0.92); // dreamy bloom, trails far behind

    /* ── dynamics ── */
    let ringScale = 1;
    let targetRingScale = 1;
    let arcLen = 76; // % of circumference shown
    let targetArcLen = 76;
    let spin = 0;
    let spinSpeed = 14; // deg/s
    let targetSpinSpeed = 14;
    let stretch = 0;
    let scrollStretch = 0;
    let angle = 0;
    let alpha = 0;
    let targetAlpha = 0;
    let plusRot = 0;
    let targetPlusRot = 0;
    let pressSpins = 0;
    let lockRot = 0;
    let beam = 0;
    let targetBeam = 0;
    let dark = 0; // 0 = light surfaces, 1 = navy surfaces
    let targetDark = 0;
    let glowAlpha = 0;
    let labelAlpha = 0;
    let targetLabelAlpha = 0;
    let press = 1;
    let targetPress = 1;

    /* scroll momentum */
    let lastScrollY = window.scrollY;
    let scrollV = 0;
    const onScroll = () => {
      scrollV = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
    };

    /* ── context resolution ── */
    const INTERACTIVE =
      "a,button,[role='button'],label,select,input[type='checkbox'],input[type='radio'],[data-cursor]";
    const TEXT_FIELD =
      "input[type='text'],input[type='email'],input[type='tel'],input[type='number'],input[type='search'],input:not([type]),textarea";
    const DARK_SURFACES = ".bg-panel-navy,.bg-band,.bg-cta,[data-cursor-dark]";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        plusS.reset(mx, my);
        ringS.reset(mx, my);
        glowS.reset(mx, my);
      }
      lastMove = performance.now();
      targetAlpha = 1;

      const el = e.target as HTMLElement | null;
      const labelled = el?.closest?.("[data-cursor-label]") as HTMLElement | null;
      targetDark = el?.closest?.(DARK_SURFACES) ? 1 : 0;

      if (labelled) {
        targetRingScale = 2.9;
        targetArcLen = 100;
        targetSpinSpeed = 4;
        lockRot = 0;
        targetBeam = 0;
        targetLabelAlpha = 1;
        const text = labelled.dataset.cursorLabel ?? "";
        if (labelText.textContent !== text) labelText.textContent = text;
      } else if (el?.closest?.(TEXT_FIELD)) {
        targetRingScale = 0.72;
        targetArcLen = 34;
        targetSpinSpeed = 30;
        lockRot = 0;
        targetBeam = 1;
        targetLabelAlpha = 0;
      } else if (el?.closest?.(INTERACTIVE)) {
        targetRingScale = 1.42;
        targetArcLen = 46;
        targetSpinSpeed = 90;
        lockRot = 45; // plus → ×
        targetBeam = 0;
        targetLabelAlpha = 0;
      } else {
        targetRingScale = 1;
        targetArcLen = 76;
        targetSpinSpeed = 14;
        lockRot = 0;
        targetBeam = 0;
        targetLabelAlpha = 0;
      }
      targetPlusRot = lockRot + pressSpins;
    };

    /* ── sonar pings (brand-tinted) ── */
    const ping = (x: number, y: number, strength = 1) => {
      const size = 46;
      const r = document.createElement("div");
      r.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px;border-radius:9999px;border:1.5px solid rgba(36,98,232,.55);box-shadow:0 0 18px rgba(36,98,232,.25);will-change:transform,opacity;opacity:0;`;
      pingLayer.appendChild(r);
      r.animate(
        [
          { transform: "scale(0.3)", opacity: 0.65 * strength },
          { transform: "scale(1.55)", opacity: 0 },
        ],
        { duration: 640, easing: "cubic-bezier(.22,.61,.36,1)" },
      ).onfinish = () => r.remove();
    };

    const onDown = (e: MouseEvent) => {
      targetPress = 0.76;
      pressSpins += 180; // the mark flips on every press
      ping(e.clientX, e.clientY, 1);
    };
    const onUp = () => {
      targetPress = 1;
    };

    /* resting glow breathes a ping every few seconds */
    const breath = setInterval(() => {
      if (
        alive &&
        seen &&
        performance.now() - lastMove > 2200 &&
        alpha > 0.35 &&
        targetLabelAlpha < 0.5
      ) {
        ping(glowS.x, glowS.y, 0.36);
      }
    }, 2600);

    const onLeaveDoc = (e: MouseEvent) => {
      if (!e.relatedTarget) targetAlpha = 0;
    };
    const onEnterDoc = () => {
      targetAlpha = 1;
    };

    /* ── render loop ── */
    const CIRC = 2 * Math.PI * 20; // r=20 → ≈125.66
    let lastT = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      plusS.step(mx, my);
      ringS.step(mx, my);
      glowS.step(mx, my);

      /* halo deformation */
      const speed = Math.hypot(ringS.vx, ringS.vy);
      const targetStretch = Math.min(speed * 0.03, 0.26);
      stretch += (targetStretch - stretch) * 0.14;
      if (speed > 0.5) angle = Math.atan2(ringS.vy, ringS.vx);

      scrollV *= 0.86;
      const targetSS = Math.min(scrollV * 0.012, 0.28);
      scrollStretch += (targetSS - scrollStretch) * 0.12;

      ringScale += (targetRingScale - ringScale) * 0.16;
      arcLen += (targetArcLen - arcLen) * 0.12;
      spinSpeed += (targetSpinSpeed - spinSpeed) * 0.08;
      spin += spinSpeed * dt;
      plusRot += (targetPlusRot - plusRot) * 0.12;
      beam += (targetBeam - beam) * 0.16;
      dark += (targetDark - dark) * 0.09;
      press += (targetPress - press) * 0.26;
      alpha += (targetAlpha - alpha) * 0.1;
      labelAlpha += (targetLabelAlpha - labelAlpha) * 0.18;

      /* idle breath on the bloom */
      const rest = Math.max(0, Math.min(1, (performance.now() - lastMove - 1600) / 1400));
      const breathe = 1 + Math.sin(now / 520) * 0.07 * rest;

      /* theme cross-fade */
      const cr = Math.round(lerp(23, 207, dark));
      const cg = Math.round(lerp(65, 228, dark));
      const cb = Math.round(lerp(149, 255, dark));
      const coreColor = `rgb(${cr},${cg},${cb})`;

      const gx = glowS.x;
      const gy = glowS.y;
      const rx = ringS.x;
      const ry = ringS.y;
      const px = plusS.x;
      const py = plusS.y;

      /* glow */
      glowAlpha +=
        ((targetAlpha * lerp(0.32, 0.55, dark)) * (seen ? 1 : 0) - glowAlpha) * 0.06;
      glow.style.opacity = (glowAlpha * (rest > 0 ? breathe : 1)).toFixed(3);
      glow.style.transform = `translate3d(${gx.toFixed(2)}px, ${gy.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(press * breathe).toFixed(3)})`;

      /* ring: travel-axis deform + lock scale, arc sweep + len */
      const s = ringScale * press;
      const sx = s * (1 + stretch) * (1 - beam * 0.62);
      const sy = s * (1 - stretch * 0.55) * (1 + beam * 1.02 + scrollStretch);
      ringWrap.style.opacity = (alpha * (1 - labelAlpha * 0.85) * 0.95).toFixed(3);
      ringWrap.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) rotate(${angle.toFixed(3)}rad) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      svg.style.transform = `rotate(${spin.toFixed(2)}deg)`;
      const dash = (CIRC * arcLen) / 100;
      arc.style.strokeDasharray = `${dash.toFixed(1)} ${(CIRC - dash).toFixed(1)}`;
      track.style.stroke = `rgba(${cr},${cg},${cb},${(0.22 + dark * 0.16).toFixed(2)})`;

      /* plus core — rides the pointer, rotates per context */
      plus.style.color = coreColor;
      plus.style.opacity = (alpha * (1 - beam * 0.35)).toFixed(3);
      plus.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${plusRot.toFixed(1)}deg) scale(${((1 - beam * 0.45) * (2 - press)).toFixed(3)}) scaleY(${(1 + beam * 1.3).toFixed(3)})`;

      /* frosted pill lens */
      label.style.opacity = (alpha * labelAlpha).toFixed(3);
      label.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(0.7 + labelAlpha * 0.3).toFixed(3)})`;

      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeaveDoc);
    document.addEventListener("mouseover", onEnterDoc);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearInterval(breath);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeaveDoc);
      document.removeEventListener("mouseover", onEnterDoc);
      pingLayer.replaceChildren();
      document.documentElement.classList.remove("pp-cursor-active");
    };
  }, []);

  return (
    <>
      {/* bloom — trails far behind the pointer */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[296] hidden h-[130px] w-[130px] lg:block"
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle, rgba(36,98,232,0.34) 0%, rgba(111,182,255,0.16) 42%, rgba(36,98,232,0) 70%)",
          filter: "blur(10px)",
          willChange: "transform",
        }}
      />

      {/* brand-tinted pings */}
      <div
        ref={pingLayerRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[297] hidden lg:block"
      />

      {/* radar ring — gradient arc + faint track */}
      <div
        ref={ringWrapRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[298] hidden h-[44px] w-[44px] will-change-transform lg:block"
        style={{ marginLeft: -22, marginTop: -22, opacity: 0 }}
      >
        <svg
          ref={svgRef}
          width="44"
          height="44"
          viewBox="0 0 44 44"
          className="overflow-visible"
          style={{ willChange: "transform" }}
        >
          <defs>
            <linearGradient id="pp-arc-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2462E8" />
              <stop offset="1" stopColor="#8FD2FB" />
            </linearGradient>
          </defs>
          <circle ref={trackRef} cx="22" cy="22" r="20" fill="none" stroke="rgba(23,65,149,.22)" strokeWidth="1" />
          <circle
            ref={arcRef}
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="url(#pp-arc-g)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeDasharray="95.5 30.2"
            transform="rotate(-90 22 22)"
          />
        </svg>
      </div>

      {/* the brand plus */}
      <div
        ref={plusRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[299] hidden h-[13px] w-[13px] lg:block"
        style={{ opacity: 0, color: "#174195" }}
      >
        <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-current" />
        <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-current" />
      </div>

      {/* frosted pill lens — same treatment as the site nav */}
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[301] hidden items-center rounded-full bg-white/90 px-[15px] py-[8px] shadow-card backdrop-blur-md lg:flex"
        style={{ opacity: 0 }}
      >
        <span
          ref={labelTextRef}
          className="select-none whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.22em] text-brand-700"
        />
      </span>
    </>
  );
}

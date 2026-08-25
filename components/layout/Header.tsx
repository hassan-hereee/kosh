"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/motion";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { NAV_LINKS, PHONE } from "@/lib/data";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", "")).filter(
  (h) => h.startsWith("#") === false && h.length > 1,
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-spy: highlight the nav item whose section is in view */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = NAV_LINKS.find((l) => l.href === `#${entry.target.id}`);
          if (match) setActive(match.label);
        }
      },
      { rootMargin: "-38% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[26px] motion-safe:animate-[header-in_0.7s_cubic-bezier(0.22,0.61,0.36,1)_both]">
      {/* scroll progress */}
      <div className="absolute inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full origin-left bg-brand-500 transition-[width] duration-100 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="shell">
        <div className="relative">
          {/* pulsing blue glow aura */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-white/50 blur-2xl motion-safe:animate-[pulse-glow_4s_ease-in-out_infinite]"
          />
          <nav
            className={cn(
              "relative flex h-[62px] items-center justify-between rounded-full pl-5 pr-[6px] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 hover:scale-[1.015]",
              scrolled
                ? "scale-100 bg-white/75 shadow-[0_12px_34px_rgba(15,26,46,0.14)]"
                : "scale-[0.96] bg-white/60 shadow-[0_2px_12px_rgba(15,26,46,0.06)]",
            )}
          >
          <Link
            href="/"
            aria-label="PriorityPlus Financial — home"
            className="motion-safe:animate-[rise-in_0.5s_ease-out_both]"
          >
            <Logo />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-[14px] lg:flex">
            {NAV_LINKS.map((link, i) => {
              const isActive = active === link.label;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setActive(link.label)}
                    style={{ animationDelay: `${0.16 + i * 0.07}s` }}
                    className={cn(
                      "group relative rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors duration-200 motion-safe:animate-[rise-in_0.5s_ease-out_both]",
                      isActive ? "text-brand-500" : "text-ink hover:text-brand-500",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-[3px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-brand-500 transition-all duration-300",
                        isActive
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-[18px]">
            <a
              href={PHONE.href}
              className="hidden items-center gap-[7px] text-[13.5px] font-medium text-ink transition-colors hover:text-brand-500 md:flex"
            >
              <PhoneIcon className="h-[15px] w-[15px] text-brand-700" />
              {PHONE.display}
            </a>
            <Magnetic strength={0.22}>
              <Link
                href="#quote"
                className="btn-primary relative overflow-hidden hidden h-[46px] px-[26px] text-[14px] sm:inline-flex motion-safe:animate-[rise-in_0.5s_ease-out_0.5s_both]"
              >
                <span className="relative z-10">Check My Rate</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm motion-safe:animate-[cta-sheen_3.8s_ease-in-out_infinite]"
                />
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="mr-2 grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-brand-50 lg:hidden"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
          </nav>
        </div>
       </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "shell overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "mt-2 max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="rounded-card bg-white p-3 shadow-panel">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => {
                  setActive(link.label);
                  setOpen(false);
                }}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 grid gap-2 border-t border-slate-100 px-1 pt-3 sm:hidden">
            <a href={PHONE.href} className="btn-outline btn-md">
              <PhoneIcon className="h-4 w-4" /> {PHONE.display}
            </a>
            <Link href="#quote" className="btn-primary btn-md" onClick={() => setOpen(false)}>
              Check My Rate
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

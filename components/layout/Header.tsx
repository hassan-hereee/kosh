"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/motion";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { NAV_LINKS, PHONE } from "@/lib/data";
import { cn } from "@/lib/utils";
import { gsap, reducedMotion } from "@/components/ui/gsap";
import Lenis from "lenis";

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", "")).filter(
  (h) => h.startsWith("#") === false && h.length > 1,
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
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

  /* Manage body overflow and GSAP menu animation */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const drawer = drawerRef.current;
      if (drawer && !reducedMotion()) {
        if (menuTlRef.current) menuTlRef.current.kill();
        menuTlRef.current = gsap.timeline();
        menuTlRef.current
          .set(drawer, { display: "block", height: "auto", overflow: "hidden" })
          .fromTo(drawer, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" })
          .fromTo(drawer.querySelectorAll("li"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" }, "<+0.05");
      }
    } else {
      document.body.style.overflow = "";
      const drawer = drawerRef.current;
      if (drawer && !reducedMotion() && menuTlRef.current) {
        menuTlRef.current.kill();
        menuTlRef.current = gsap.timeline({
          onComplete: () => {
            gsap.set(drawer, { display: "none" });
          },
        });
        menuTlRef.current
          .to(drawer.querySelectorAll("li"), { opacity: 0, y: -4, duration: 0.15, stagger: { each: 0.02, from: "end" }, ease: "power2.in" })
          .to(drawer, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, "<");
      } else if (drawer) {
        gsap.set(drawer, { display: "none", height: 0, opacity: 0 });
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (menuTlRef.current) menuTlRef.current.kill();
    };
  }, [open]);

  /* Close menu when clicking outside */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const drawer = drawerRef.current;
      const nav = document.querySelector("nav");
      if (!drawer || !nav) return;

      const target = e.target as Node;
      if (!drawer.contains(target) && !nav.contains(target)) {
        setOpen(false);
      }
    };

    // Use mousedown for faster response
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const scrollToSection = (href: string) => {
    // Handle Home link - scroll to top
    if (href === "/" || href === "#home") {
      const lenis = (window as unknown as { lenis?: InstanceType<typeof Lenis> }).lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    const headerHeight = 80;
    const targetRect = target.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const y = targetRect.top + currentScroll - headerHeight;

    const lenis = (window as unknown as { lenis?: InstanceType<typeof Lenis> }).lenis;
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[26px] motion-safe:animate-[header-in_0.7s_cubic-bezier(0.22,0.61,0.36,1)_both]">
      <div className="shell">
        <div className="relative">
          {/* pulsing blue glow aura — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-white/50 blur-2xl motion-safe:animate-[pulse-glow_4s_ease-in-out_infinite] hidden lg:block"
          />
          <nav
            className={cn(
              "relative flex h-[62px] items-center justify-between rounded-full pl-5 pr-[6px] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 hover:scale-[1.015]",
              scrolled
                ? "scale-100 bg-white/75 lg:shadow-[0_12px_34px_rgba(15,26,46,0.14)]"
                : "scale-[0.96] bg-white/60 lg:shadow-[0_2px_12px_rgba(15,26,46,0.06)]",
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
        ref={drawerRef}
        className="shell overflow-hidden lg:hidden mt-2"
        style={{ display: "none", height: 0, opacity: 0 }}
      >
        <ul className="rounded-card bg-white p-3">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(link.label);
                  setOpen(false);
                  scrollToSection(link.href);
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
            <Link
              href="#quote"
              className="btn-primary btn-md"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToSection("#quote");
              }}
            >
              Check My Rate
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

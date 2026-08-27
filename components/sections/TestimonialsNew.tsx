"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { StarIcon } from "@/components/ui/icons";
import { TESTIMONIALS_V2, TESTIMONIAL_SUMMARY } from "@/lib/data";
import { gsap, reducedMotion } from "@/components/ui/gsap";

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className={`
        flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white
        ${color}
      `}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  avatarInitials,
  avatarColor,
}: {
  quote: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
}) {
  return (
    <figure className="testimonial-card rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_2px_8px_rgba(15,26,46,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(15,26,46,0.08)]">
      <blockquote className="text-[14px] leading-[1.7] text-ink/80">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar initials={avatarInitials} color={avatarColor} />
        <span className="text-[14px] font-semibold text-ink">{name}</span>
      </figcaption>
    </figure>
  );
}

function SocialProofRow() {
  const avatars = [
    { initials: "JD", color: "bg-indigo-500" },
    { initials: "KW", color: "bg-emerald-500" },
    { initials: "AL", color: "bg-amber-500" },
    { initials: "MP", color: "bg-rose-500" },
    { initials: "TS", color: "bg-violet-500" },
  ];

  return (
    <div className="flex flex-col items-center gap-2.5" role="img" aria-label="Customer ratings summary">
      <div className="flex items-center gap-2.5">
        <div className="flex -space-x-2" aria-hidden="true">
          {avatars.map((a, i) => (
            <div
              key={i}
              className={`
                flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white
                text-[10px] font-bold text-white ${a.color}
              `}
            >
              {a.initials}
            </div>
          ))}
        </div>
        <div className="flex gap-[1.5px]" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-[12px] w-[12px] text-[#F5A623]" />
          ))}
        </div>
      </div>
      <p className="text-[12px] text-ink-500 whitespace-nowrap">
        <span className="font-bold text-ink">{TESTIMONIAL_SUMMARY.score}</span>{" "}
        {TESTIMONIAL_SUMMARY.outOf}
      </p>
    </div>
  );
}

/**
 * Desktop: Three independent vertical infinite streams
 * - Each column has a static viewport (overflow: hidden)
 * - Each column has an animated track containing duplicated cards
 * - Left: track moves DOWN (positive Y)
 * - Center: track moves UP (negative Y)
 * - Right: track moves DOWN (positive Y)
 */
function DesktopTestimonials() {
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const centerTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const isMobileRef = useRef(false);
  const heightsRef = useRef({ left: 0, center: 0, right: 0 });

  const leftCards = [TESTIMONIALS_V2[0], TESTIMONIALS_V2[1], TESTIMONIALS_V2[2]];
  const centerCards = [TESTIMONIALS_V2[3], TESTIMONIALS_V2[4], TESTIMONIALS_V2[5]];
  const rightCards = [TESTIMONIALS_V2[6], TESTIMONIALS_V2[7], TESTIMONIALS_V2[0]];

  useEffect(() => {
    if (reducedMotion()) return;

    const mql = window.matchMedia("(max-width: 1023px)");
    isMobileRef.current = mql.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches;
      if (e.matches) {
        if (ctxRef.current) {
          ctxRef.current.revert();
          ctxRef.current = null;
        }
      } else if (!ctxRef.current) {
        initAnimation();
      }
    };

    mql.addEventListener("change", handleChange);

    if (!isMobileRef.current) {
      initAnimation();
    }

    return () => {
      mql.removeEventListener("change", handleChange);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);

  const initAnimation = () => {
    if (!leftTrackRef.current || !centerTrackRef.current || !rightTrackRef.current) return;

    requestAnimationFrame(() => {
      if (isMobileRef.current) return;
      if (!leftTrackRef.current || !centerTrackRef.current || !rightTrackRef.current) return;

      const getSingleSetHeight = (ref: HTMLDivElement, cardCount: number) => {
        const cards = Array.from(ref.querySelectorAll(".testimonial-card"));
        const singleSetCards = cards.slice(0, cardCount);
        let totalHeight = 0;
        singleSetCards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          totalHeight += rect.height;
          if (i < singleSetCards.length - 1) totalHeight += 20;
        });
        return totalHeight;
      };

      heightsRef.current.left = getSingleSetHeight(leftTrackRef.current, leftCards.length);
      heightsRef.current.center = getSingleSetHeight(centerTrackRef.current, centerCards.length);
      heightsRef.current.right = getSingleSetHeight(rightTrackRef.current, rightCards.length);

      const SPEED = 25;

      const leftDuration = heightsRef.current.left / SPEED;
      const centerDuration = heightsRef.current.center / SPEED;
      const rightDuration = heightsRef.current.right / SPEED;

      ctxRef.current = gsap.context(() => {
        gsap.to(leftTrackRef.current, {
          y: heightsRef.current.left,
          duration: leftDuration,
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            gsap.set(leftTrackRef.current, { y: 0 });
          },
        });

        gsap.to(centerTrackRef.current, {
          y: -heightsRef.current.center,
          duration: centerDuration,
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            gsap.set(centerTrackRef.current, { y: 0 });
          },
        });

        gsap.to(rightTrackRef.current, {
          y: heightsRef.current.right,
          duration: rightDuration,
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            gsap.set(rightTrackRef.current, { y: 0 });
          },
        });
      });
    });
  };

  const renderColumn = (
    trackRef: React.RefObject<HTMLDivElement>,
    cards: readonly { name: string; quote: string; avatarInitials: string; avatarColor: string }[],
    verticalOffset: string,
    ariaLabel: string
  ) => (
    <div
      className={`overflow-hidden ${verticalOffset}`}
      role="list"
      aria-label={ariaLabel}
      style={{ minHeight: 0 }}
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-5"
        style={{ willChange: "transform" }}
      >
        {cards.map((card) => (
          <TestimonialCard
            key={card.name}
            quote={card.quote}
            name={card.name}
            avatarInitials={card.avatarInitials}
            avatarColor={card.avatarColor}
          />
        ))}
        {cards.map((card) => (
          <TestimonialCard
            key={`${card.name}-dup`}
            quote={card.quote}
            name={card.name}
            avatarInitials={card.avatarInitials}
            avatarColor={card.avatarColor}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="grid gap-5 lg:grid-cols-3 lg:gap-5"
      role="list"
      aria-label="Customer testimonials"
    >
      {renderColumn(leftTrackRef, leftCards, "lg:mt-10", "Left testimonial stream")}
      {renderColumn(centerTrackRef, centerCards, "lg:-mt-6", "Center testimonial stream")}
      {renderColumn(rightTrackRef, rightCards, "lg:mt-10", "Right testimonial stream")}
    </div>
  );
}

/**
 * Mobile: Single-card horizontal carousel with autoplay and swipe
 * Uses duplicated cards for seamless infinite looping
 */
function MobileTestimonialsContainer({ onNavigate, currentIndex }: { onNavigate: (i: number) => void; currentIndex: number }) {
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const allCards = TESTIMONIALS_V2;
  const cardCount = allCards.length;
  const totalSlides = cardCount * 2;

  const next = () => {
    if (isTransitioning) return;
    onNavigate(currentIndex + 1);
  };

  const prev = () => {
    if (isTransitioning) return;
    onNavigate(currentIndex - 1);
  };

  useEffect(() => {
    if (reducedMotion()) return;
    autoplayRef.current = setInterval(next, 4500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleMouseEnter = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    };
    const handleMouseLeave = () => {
      if (!autoplayRef.current && !reducedMotion() && !isTransitioning) {
        autoplayRef.current = setInterval(next, 4500);
      }
    };

    viewport.addEventListener("mouseenter", handleMouseEnter);
    viewport.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      viewport.removeEventListener("mouseenter", handleMouseEnter);
      viewport.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTransitioning]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartRef.current = e.clientX;
    setDragging(true);
    setDragX(0);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    viewportRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartRef.current;
    setDragX(dx);
  };

  const endDrag = () => {
    if (!dragging) return;
    const threshold = 50;
    if (dragX <= -threshold) onNavigate(currentIndex + 1);
    else if (dragX >= threshold) onNavigate(currentIndex - 1);
    setDragging(false);
    setDragX(0);
    if (!reducedMotion()) {
      autoplayRef.current = setInterval(next, 4500);
    }
  };

  const translateX = `${-(currentIndex * 100)}% + ${dragX}px`;

  return (
    <div
      ref={viewportRef}
      className="touch-pan-y overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div
        className={`flex select-none ${!dragging ? "transition-transform duration-500 ease-out" : "cursor-grabbing"}`}
        style={{ transform: `translateX(calc(${translateX}))` }}
      >
        {/* Duplicate testimonials for seamless looping */}
        {allCards.map((card, index) => (
          <figure key={`${card.name}-${index}`} className="w-full shrink-0 px-4">
            <TestimonialCard
              quote={card.quote}
              name={card.name}
              avatarInitials={card.avatarInitials}
              avatarColor={card.avatarColor}
            />
          </figure>
        ))}
        {allCards.map((card, index) => (
          <figure key={`${card.name}-${index}-dup`} className="w-full shrink-0 px-4">
            <TestimonialCard
              quote={card.quote}
              name={card.name}
              avatarInitials={card.avatarInitials}
              avatarColor={card.avatarColor}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function MobilePagination({ currentIndex, total, onSelect }: { currentIndex: number; total: number; onSelect: (i: number) => void }) {
  // For seamless loop, map currentIndex to the visible pagination dots (0 to total-1)
  const visibleIndex = currentIndex % total;

  return (
    <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Testimonial navigation">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to testimonial ${i + 1}`}
          aria-selected={visibleIndex === i}
          role="tab"
          className={`h-1.5 rounded-full transition-all duration-300 ${
            visibleIndex === i
              ? "w-6 bg-brand-500"
              : "w-1.5 bg-slate-300 hover:bg-brand-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsNew() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const go = (next: number) => {
    const total = TESTIMONIALS_V2.length;
    const totalSlides = total * 2;

    // Handle seamless looping with duplicated cards
    if (next < 0) {
      // When going back from first card, jump to the last card of the second set
      setMobileIndex(total - 1);
    } else if (next >= totalSlides) {
      // When going past the last card of the second set, jump to first card
      setMobileIndex(0);
    } else {
      setMobileIndex(next);
    }
  };

  return (
    <section
      id="testimonials"
      className="bg-white pt-14 pb-14 lg:pt-20 lg:pb-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="shell">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="testimonials-heading"
            className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[36px] lg:text-[40px] xl:text-[44px]"
          >
            <span className="inline">Real stories.</span>{" "}
            <span className="text-brand-700 inline">Real results.</span>
          </h2>

          <Reveal delay={120} className="mt-6">
            <p className="text-[15px] leading-[1.7] text-ink-500 sm:text-[16px]">
              Discover how real customers lowered their monthly payments, eliminated financial
              stress, and simplified their bills.
            </p>
          </Reveal>

          <Reveal delay={200} className="mt-8">
            <SocialProofRow />
          </Reveal>
        </div>

        {isMobile ? (
          <>
            <MobileTestimonialsContainer onNavigate={go} currentIndex={mobileIndex} />
            <MobilePagination currentIndex={mobileIndex} total={TESTIMONIALS_V2.length} onSelect={go} />
          </>
        ) : (
          <DesktopTestimonials />
        )}
      </div>
    </section>
  );
}
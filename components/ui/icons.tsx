import type { SVGProps } from "react";

type I = SVGProps<SVGSVGElement>;

export function PhoneIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M6.6 3h2.1l1.5 3.7-1.8 1.2a11.4 11.4 0 0 0 5.7 5.7l1.2-1.8L19 13.3v2.1A2.6 2.6 0 0 1 16.2 18C9.9 17.6 4.4 12.1 4 5.8A2.6 2.6 0 0 1 6.6 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MailIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.5 8 6.6 4.6a1.6 1.6 0 0 0 1.8 0L19.5 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function GlobeIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.6 12h16.8M12 3.6c2.2 2.3 3.3 5.1 3.3 8.4s-1.1 6.1-3.3 8.4c-2.2-2.3-3.3-5.1-3.3-8.4S9.8 5.9 12 3.6Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ArrowRightIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M4 12h14m0 0-5.2-5.2M18 12l-5.2 5.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Solid "share"-style arrow used inside the See My Savings pill. */
export function ArrowShareIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M3.4 18.6c.9-5.6 4.4-8.6 10.4-8.9V6.2a.8.8 0 0 1 1.3-.6l5.4 4.8a.8.8 0 0 1 0 1.2l-5.4 4.8a.8.8 0 0 1-1.3-.6v-3.4c-4.2.1-6.9 1.6-9 6.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
    </svg>
  );
}

export function CheckIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="m5 12.8 4.4 4.4L19 7.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WarningIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 3.6 22 20.4H2L12 3.6Z" fill="currentColor" />
      <path d="M12 9.4v4.6M12 16.6v.9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="m6 9.5 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUpIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="m6 14.5 6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BoltIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.4 2 5 13.4h5.1L9.6 22 19 10.2h-5.4L13.4 2Z" />
    </svg>
  );
}

export function SendIcon(props: I) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M3.3 20.7 21 12 3.3 3.3 5.6 10.4l8.4 1.6-8.4 1.6L3.3 20.7Z" />
    </svg>
  );
}

/** Small square bullet used before the three-step card titles. */
export function SquareBullet(props: I) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden {...props}>
      <rect x="1.5" y="1.5" width="9" height="9" rx="1.6" />
    </svg>
  );
}

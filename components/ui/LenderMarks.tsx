/** Lender wordmarks, redrawn as text+SVG so no raster assets are needed. */

export function SoFiMark() {
  return (
    <span className="inline-flex items-center gap-[5px]">
      <span className="text-[17px] font-extrabold tracking-[-0.03em] text-[#00A0DF]">SoFi</span>
      <svg viewBox="0 0 20 20" className="h-[13px] w-[13px]" aria-hidden>
        <g fill="#00A0DF">
          <rect x="0" y="0" width="5.4" height="5.4" rx="1.2" />
          <rect x="7.3" y="0" width="5.4" height="5.4" rx="1.2" opacity=".55" />
          <rect x="0" y="7.3" width="5.4" height="5.4" rx="1.2" opacity=".55" />
          <rect x="7.3" y="7.3" width="5.4" height="5.4" rx="1.2" />
          <rect x="14.6" y="7.3" width="5.4" height="5.4" rx="1.2" opacity=".35" />
          <rect x="7.3" y="14.6" width="5.4" height="5.4" rx="1.2" opacity=".35" />
        </g>
      </svg>
    </span>
  );
}

export function UpgradeMark() {
  return (
    <span className="inline-flex items-center gap-[4px]">
      <svg viewBox="0 0 22 24" className="h-[19px] w-[17px]" aria-hidden>
        <path
          d="M3 2h4.6v12.1a3.5 3.5 0 0 0 7 0V2H19v12.4A8 8 0 0 1 11 22a8 8 0 0 1-8-7.6V2Z"
          fill="#12A05C"
        />
      </svg>
      <span className="text-[17px] font-bold tracking-[-0.03em] text-[#12A05C]">upgrade</span>
    </span>
  );
}

export function BestEggMark() {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <svg viewBox="0 0 24 20" className="h-[13px] w-[16px]" aria-hidden>
        <path
          d="M2 2c5 1.4 8 4 10 8 2-4 5-6.6 10-8-3.4 3.4-5 6.6-5 10 0 3-1.8 5.4-5 6-3.2-.6-5-3-5-6 0-3.4-1.6-6.6-5-10Z"
          fill="#12213F"
        />
      </svg>
      <span className="font-serif text-[16px] font-bold tracking-[-0.01em] text-[#12213F]">
        Best Egg
      </span>
    </span>
  );
}

export function ProsperMark() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      <svg viewBox="0 0 14 18" className="h-[13px] w-[10px]" aria-hidden>
        <path d="M7 0c3.6 3.4 6.4 6.6 6.4 10.2A6.4 6.4 0 0 1 7 17a6.4 6.4 0 0 1-6.4-6.8C.6 6.6 3.4 3.4 7 0Z" fill="#E8452C" />
      </svg>
      <span className="text-[15.5px] font-bold tracking-[-0.02em] text-[#12213F]">Prosper</span>
    </span>
  );
}

export const LENDER_MARKS: Record<string, () => JSX.Element> = {
  SoFi: SoFiMark,
  Upgrade: UpgradeMark,
  "Best Egg": BestEggMark,
  Prosper: ProsperMark,
};

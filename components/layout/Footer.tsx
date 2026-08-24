import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Stagger from "@/components/ui/Stagger";
import { GlobeIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";
import {
  COPYRIGHT,
  FOOTER_BLURB,
  FOOTER_COLUMNS,
  FOOTER_CONTACT,
  FOOTER_DISCLAIMERS,
  LEGAL_LINKS,
} from "@/lib/data";

const ICONS = { phone: PhoneIcon, mail: MailIcon, globe: GlobeIcon };

export default function Footer() {
  return (
    <footer className="bg-surface-muted pt-20 relative overflow-hidden">
      <div className="shell relative z-10">
        {/* Brand + link columns */}
        <Stagger
          step={110}
          className="grid gap-10 lg:grid-cols-[352px_repeat(3,minmax(0,1fr))] lg:gap-8"
        >
          <div data-stagger>
            <Logo />
            <p className="mt-[18px] max-w-[300px] text-[12.5px] leading-[1.75] text-ink-500">
              {FOOTER_BLURB}
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} data-stagger>
              <h3 className="text-[15px] font-bold tracking-[-0.01em] text-brand-700">
                {col.heading}
              </h3>
              <ul className="mt-[14px] space-y-[13px]">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="group inline-flex items-center gap-1 text-[13px] text-ink-600 transition-colors hover:text-brand-700"
                    >
                      <span className="relative">
                        {label}
                        <span
                          aria-hidden
                          className="absolute -bottom-[2px] left-0 h-[1px] w-full origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Stagger>

        {/* Contact row */}
        <ul className="mt-[46px] flex flex-wrap items-center justify-center gap-x-[38px] gap-y-4">
          {FOOTER_CONTACT.map((item) => {
            const Icon = ICONS[item.icon];
            const inner = (
              <>
                <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-brand-200 text-brand-700">
                  <Icon className="h-[13px] w-[13px]" />
                </span>
                <span className="text-[12.5px] font-medium text-ink-600">{item.label}</span>
              </>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="group flex items-center gap-[9px] transition-colors hover:text-brand-700"
                  >
                    {inner}
                  </a>
                ) : (
                  <span className="flex items-center gap-[9px]">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Legal */}
        <div className="mt-[26px] border-t border-slate-200/80 pt-[22px]">
          {FOOTER_DISCLAIMERS.map((text, i) => (
            <p
              key={i}
              className="mb-[18px] text-[11.5px] leading-[1.7] text-ink-400"
            >
              {text}
            </p>
          ))}

          <div className="flex flex-col items-center justify-between gap-3 pb-[26px] sm:flex-row">
            <p className="text-[11.5px] text-ink-400">{COPYRIGHT}</p>
            <p className="flex items-center gap-[9px] text-[11.5px] text-ink-400">
              {LEGAL_LINKS.map((label, i) => (
                <span key={label} className="flex items-center gap-[9px]">
                  {i > 0 && <span aria-hidden className="text-ink-400/60">|</span>}
                  <Link href="#" className="transition-colors hover:text-brand-700">
                    {label}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

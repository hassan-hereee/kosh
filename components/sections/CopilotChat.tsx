"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import SlideIn from "@/components/ui/SlideIn";
import Stagger from "@/components/ui/Stagger";
import { SendIcon } from "@/components/ui/icons";
import { COPILOT_CHIPS, COPILOT_GREETING, COPILOT_REPLIES, FAQ_ITEMS } from "@/lib/data";

type Msg = { from: "copilot" | "user"; text: string };

const FALLBACK =
  "Great question — the short answer: checking your rate is free, soft-pull only, and there's no obligation. Want me to walk you through what your numbers might look like?";

export default function CopilotChat() {
  const [messages, setMessages] = useState<Msg[]>([{ from: "copilot", text: COPILOT_GREETING }]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "copilot", text: COPILOT_REPLIES[value] ?? FALLBACK }]);
    }, 650);
  };

  return (
    <section id="faqs" className="bg-soft-sky pt-0 pb-16 lg:pt-0 lg:pb-20 relative overflow-hidden">
      <div className="shell relative z-10">
        <SectionHeading
          lead="Get Clarity Before"
          accent="You Commit."
          lede="Explore your options, understand the costs, and see if consolidation is right for you without sharing your phone number."
        />

        <SlideIn
          direction="up"
          className="mx-auto mt-12 max-w-[780px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel"
        >
          {/* thread */}
          <div
            ref={scrollRef}
            className="h-[320px] space-y-3 overflow-y-auto bg-[#F7FAFE] p-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[6px]"
            aria-live="polite"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.from === "user"
                    ? "ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-brand-700 px-4 py-3 text-[12.5px] leading-[1.65] text-white shadow-sm"
                    : "mr-auto max-w-[85%] rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[12.5px] leading-[1.65] text-ink-600 shadow-sm"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* chips */}
          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-5 pb-1 pt-4">
            {COPILOT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="rounded-full border border-brand-200 bg-white px-[14px] py-[8px] text-[11.5px] font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* input */}
          <form
            className="flex items-center gap-3 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label htmlFor="copilot-input" className="sr-only">
              Ask about rates, fees, your situation
            </label>
            <input
              id="copilot-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about rates, fees, your situation..."
              className="h-[44px] flex-1 rounded-lg border border-slate-200 bg-white px-4 text-[12.5px] text-ink outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button type="submit" className="btn-primary h-[40px] px-5 text-[13px]">
              Send
              <SendIcon className="h-[13px] w-[13px]" />
            </button>
          </form>
        </SlideIn>

        {/* collapsible FAQ — accordion */}
        <div className="mx-auto mt-10 max-w-[640px]">
          <Stagger
            step={120}
            className="rounded-card border border-slate-200/70 bg-white px-6 py-2 shadow-card"
          >
            <p className="pt-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700" data-stagger>
              Quick answers
            </p>
            <Accordion items={FAQ_ITEMS} className="mt-1" />
          </Stagger>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

/**
 * First-viewport demo: one milestone as the app shows it. Funded and Delivered fill in on load;
 * the visitor approves to release it. Illustrative data, labelled as an example.
 */
const STEPS = ["Funded", "Delivered", "Released"] as const;
const DETAIL = [
  "Waiting for the client to fund",
  "Client paid GH₵ 2,000.00 into escrow",
  "Figma file and demo video submitted · auto-releases in 7 days",
  "Paid to MTN MoMo · 024 ••• 4567",
];

export function EscrowDemo() {
  const [done, setDone] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Start when the card is actually on screen (below the fold on phones).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timers.push(setTimeout(() => setDone(1), 350));
        timers.push(setTimeout(() => setDone(2), 1050));
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const replay = () => {
    setDone(0);
    setTimeout(() => setDone(1), 300);
    setTimeout(() => setDone(2), 950);
  };

  const released = done === 3;
  const fill = done <= 1 ? 0 : done === 2 ? 50 : 100;

  return (
    <div ref={ref} className="raised w-full rounded-[20px] bg-paper p-5 text-ink sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-[13px] font-medium text-muted">Example milestone</p>
          <p className="mt-1 text-[20px] font-semibold tracking-[-0.01em] sm:text-[22px]">Checkout redesign</p>
          <p className="mt-1 text-[14px] text-muted">Milestone 2 · <span className="whitespace-nowrap">Kente Labs → Ama Owusu</span></p>
        </div>
        <p className="tabular whitespace-nowrap text-[22px] font-bold tracking-[-0.02em] sm:text-[26px]">GH₵ 2,000</p>
      </div>

      {/* Tracker */}
      <div className="mt-9" role="list" aria-label="Milestone progress">
        <div className="relative mx-4">
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
          <div
            className={`track-fill absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full ${released ? "bg-teal-ink" : "bg-blue"}`}
            style={{ width: `${fill}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((s, i) => {
              const on = i < done;
              const waiting = !on && i === done && done === 2;
              return (
                <span
                  key={s}
                  role="listitem"
                  aria-label={`${s}: ${on ? "done" : "not yet"}`}
                  className={`grid size-9 place-items-center rounded-full border-2 transition-colors duration-300 ${
                    on
                      ? `${i === 2 ? "border-teal-ink bg-teal-ink" : "border-blue bg-blue"} dot-pop text-white`
                      : waiting
                        ? "border-orange bg-paper"
                        : "border-line bg-paper"
                  }`}
                >
                  {on ? <Check className="size-4" strokeWidth={3} aria-hidden /> : waiting ? <span className="size-2.5 animate-pulse rounded-full bg-orange" /> : null}
                </span>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex justify-between text-[14px] font-semibold">
          {STEPS.map((s, i) => (
            <span key={s} className={`w-[33%] ${i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"} ${i < done ? "text-ink" : "text-muted"}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-7 min-h-[48px] border-t border-line pt-4 text-[15px] text-ink-2" aria-live="polite">
        {DETAIL[done]}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span
          className={`inline-flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold ${released ? "text-teal-ink" : done === 2 ? "text-[#A85F00]" : "text-blue"}`}
        >
          <span className={`size-2 rounded-full ${released ? "bg-teal-ink" : done === 2 ? "bg-orange" : "bg-blue"}`} />
          {released ? "Paid" : done === 2 ? "In review" : "In escrow"}
        </span>
        {released ? (
          <button type="button" onClick={replay} className="inline-flex items-center gap-2 rounded-[12px] px-3 py-2.5 text-[14px] font-semibold text-muted hover:text-ink">
            <RotateCcw className="size-4" aria-hidden /> Replay
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setDone(3)}
            disabled={done < 2}
            className="whitespace-nowrap rounded-[12px] bg-blue px-4 py-3 text-[15px] font-semibold text-white sm:px-5 transition-colors hover:bg-blue-deep disabled:cursor-wait disabled:opacity-50"
          >
            Approve &amp; release
          </button>
        )}
      </div>
    </div>
  );
}

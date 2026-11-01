"use client";

import { useEffect, useRef, useState } from "react";

/** How escrow works: a numbered timeline whose line fills as it scrolls into view. The order is the point. */
const STEPS = [
  { title: "Agree", text: "Client and freelancer agree the milestone: what gets delivered, the price in cedis and the deadline." },
  { title: "Fund", text: "The client pays the milestone into escrow with Mobile Money or card. The freelancer sees it’s funded before starting." },
  { title: "Deliver", text: "The freelancer submits the work inside the project, and the client’s 7-day review window starts." },
  { title: "Release", text: "The client approves and the money goes to the freelancer’s wallet. No answer in 7 days? It releases itself." },
];

export function StepsTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduce) return setReached(STEPS.length);
        STEPS.forEach((_, i) => timers.push(setTimeout(() => setReached(i + 1), 200 + i * 380)));
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <ol ref={ref} className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
      {/* Desktop rail */}
      <div className="absolute left-0 right-0 top-[19px] hidden h-[2px] bg-line lg:block" aria-hidden>
        <div className="track-fill h-full bg-blue" style={{ width: `${Math.max(0, (reached - 1) / (STEPS.length - 1)) * 100}%` }} />
      </div>
      {STEPS.map((s, i) => {
        const on = i < reached;
        return (
          <li key={s.title} className="relative flex gap-5 lg:block">
            <span
              className={`relative z-10 grid size-10 flex-none place-items-center rounded-full border-2 text-[15px] font-bold transition-colors duration-300 ${
                on ? `${i === 3 ? "border-teal-ink bg-teal-ink" : "border-blue bg-blue"} dot-pop text-white` : "border-line bg-cloth text-muted"
              }`}
            >
              {i + 1}
            </span>
            <div className="lg:mt-7">
              <h3 className="text-[22px] font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 max-w-[38ch] text-[16px] leading-relaxed text-ink-2">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

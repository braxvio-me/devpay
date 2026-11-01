"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Phone } from "@/components/phone";

/** Horizontally scrolling app screens with arrow controls for mouse users. */
export function GalleryStrip({ items }: { items: { src: string; label: string }[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 520, behavior: "smooth" });

  return (
    <div>
      <ul
        ref={ref}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-5 pb-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]"
      >
        {items.map((g) => (
          <li key={g.src} className="flex-none snap-start">
            <Phone src={g.src} alt={g.label} width={230} />
            <p className="mt-4 text-[15px] font-medium text-ink-2">{g.label}</p>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 flex max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
        <p className="text-[14px] text-muted">Screens from the app’s demo account.</p>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d)}
              aria-label={d < 0 ? "Previous screens" : "Next screens"}
              className="grid size-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-blue hover:text-blue"
            >
              {d < 0 ? <ChevronLeft className="size-5" aria-hidden /> : <ChevronRight className="size-5" aria-hidden />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

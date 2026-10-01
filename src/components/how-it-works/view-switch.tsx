"use client";

import Link from "next/link";
import { conceptsById, conceptInView, howItWorksViews, type ViewId } from "@/content/how-genesis-mesh-works";

/**
 * Tab-like switch where every tab is a real route. A selected concept is
 * carried along as the hash when the target view also shows it.
 */
export function ViewSwitch({ view, selectedId }: { view: ViewId; selectedId: string | null }) {
  const selected = selectedId ? conceptsById[selectedId] : undefined;

  return (
    <nav aria-label="How Genesis Mesh works views" className="w-full shrink-0 sm:w-auto">
      <ul className="grid grid-cols-3 rounded-lg border border-ink/10 bg-ink/[0.04] p-1">
        {howItWorksViews.map((item) => {
          const active = item.id === view;
          const hash = selected && conceptInView(selected, item.id) ? `#${selected.id}` : "";

          return (
            <li key={item.id} className="min-w-0">
              <Link
                href={`${item.path}${hash}`}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-10 items-center justify-center rounded-md px-1.5 text-center text-[12.5px] leading-tight font-semibold transition min-[360px]:whitespace-nowrap sm:px-5 sm:text-sm",
                  active ? "bg-accent text-on-accent shadow-sm" : "text-ink-300 hover:bg-ink/10 hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, List, PanelsTopLeft } from "lucide-react";

const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const hashSnapshot = () => window.location.hash;
const emptyHash = () => "";
function subscribeHash(update: () => void) {
  window.addEventListener("hashchange", update);
  window.addEventListener("popstate", update);
  return () => {
    window.removeEventListener("hashchange", update);
    window.removeEventListener("popstate", update);
  };
}

type ExplorerItem = { id: string; label: string; status?: string; content: ReactNode };

/** Server renders every panel. Hydration adds selection without a second reading copy. */
export function VisionExplorer({ id, label, items, sequential = false }: {
  id: string; label: string; items: ExplorerItem[]; sequential?: boolean;
}) {
  const enhanced = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
  const hash = useSyncExternalStore(subscribeHash, hashSnapshot, emptyHash);
  const [selected, setSelected] = useState(0);
  const [readAll, setReadAll] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedByControl = useRef(false);
  const initialAnchorHandled = useRef(false);
  const fromHash = items.findIndex((item) => hash === `#${id}-${item.id}`);
  const active = fromHash < 0 ? selected : fromHash;
  const allVisible = !enhanced || readAll;

  // A hard-linked panel starts below every SSR panel. Re-anchor after enhancement
  // changes their heights. Keyboard/click selection keeps the controls in view.
  useEffect(() => {
    if (!enhanced) return;
    const initial = !initialAnchorHandled.current;
    initialAnchorHandled.current = true;
    // Initial section links (for example #today from the chatbot) also move
    // when earlier panels collapse. Later section links use native scrolling.
    if (!initial && fromHash < 0) return;
    if (selectedByControl.current) { selectedByControl.current = false; return; }
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [enhanced, fromHash, hash]);

  function choose(index: number, focus = false) {
    setSelected(index);
    setReadAll(false);
    const target = `#${id}-${items[index].id}`;
    if (window.location.hash !== target) {
      selectedByControl.current = true;
      window.history.replaceState(null, "", target);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    if (focus) tabs.current[index]?.focus();
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % items.length
      : event.key === "ArrowLeft" ? (index + items.length - 1) % items.length
      : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
    if (next !== null) { event.preventDefault(); choose(next, true); }
  }

  return (
    <div className="vision-explorer surface-card overflow-hidden">
      {enhanced ? <div className="vision-controls border-b border-ink/10 bg-ink/[0.03] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <button type="button" className="vision-control" aria-pressed={readAll} onClick={() => setReadAll(!readAll)}>
            {readAll ? <PanelsTopLeft size={16} aria-hidden="true" /> : <List size={16} aria-hidden="true" />}
            {readAll ? "Explore one at a time" : "Read all"}
          </button>
        </div>
        {!readAll ? <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <button key={item.id} type="button" role="tab" id={`${id}-tab-${item.id}`}
              ref={(node) => { tabs.current[index] = node; }}
              aria-selected={active === index} aria-controls={`${id}-${item.id}`}
              tabIndex={active === index ? 0 : -1} className="vision-tab"
              onClick={() => choose(index)} onKeyDown={(event) => navigate(event, index)}>
              {sequential ? <span className="font-mono text-xs" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span> : null}
              {item.label}
            </button>
          ))}
        </div> : null}
      </div> : null}
      <div className={allVisible ? "divide-y divide-ink/10" : undefined}>
        {items.map((item, index) => (
          <div key={item.id} id={`${id}-${item.id}`} hidden={!allVisible && active !== index}
            role={allVisible ? "region" : "tabpanel"}
            aria-labelledby={allVisible ? `${id}-title-${item.id}` : `${id}-tab-${item.id}`}
            tabIndex={allVisible ? undefined : 0} className="vision-panel p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 id={`${id}-title-${item.id}`} className="text-xl font-semibold text-ink">{item.label}</h3>
              {item.status ? <span className="vision-badge">{item.status}</span> : null}
            </div>
            {item.content}
          </div>
        ))}
      </div>
      {sequential && enhanced && !readAll ? <div className="vision-controls flex items-center justify-between gap-3 border-t border-ink/10 p-4 sm:px-8">
        <button type="button" className="vision-control" disabled={active === 0} onClick={() => choose(active - 1)}>
          <ArrowLeft size={16} aria-hidden="true" />Previous
        </button>
        <span className="text-sm text-ink-400" role="status">{active + 1} of {items.length}</span>
        <button type="button" className="vision-control" disabled={active === items.length - 1} onClick={() => choose(active + 1)}>
          Next<ArrowRight size={16} aria-hidden="true" />
        </button>
      </div> : null}
    </div>
  );
}

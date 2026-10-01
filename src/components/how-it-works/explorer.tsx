"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { ChevronsDownUp, ChevronsUpDown, CircleHelp } from "lucide-react";
import {
  conceptInView,
  conceptsById,
  fullModelIntro,
  homeViewFor,
  howItWorksPage,
  howItWorksViews,
  isViewId,
  mentalModel,
  storiesInView,
  type ViewId,
} from "@/content/how-genesis-mesh-works";
import { ConceptPanel, StoryIntroPanel } from "./concept-panel";
import { idInView, neighbours, pathThrough } from "./graph";
import { cameraFor, computeLayout, detailParent, expandableIds, type MapLayout } from "./map-layout";
import { MentalModelRail } from "./mental-model-rail";
import { NarrowMap } from "./narrow-map";
import { ViewSwitch } from "./view-switch";
import { WideMap, type MapInteraction } from "./wide-map";

const HASH_EVENT = "hiw:hashchange";
const DEFAULT_STAGE_WIDTH = 1216;
const TWEEN_MS = 450;

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

function readHash() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function pathFor(view: ViewId) {
  return howItWorksViews.find((item) => item.id === view)!.path;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function interpolate(from: MapLayout, to: MapLayout, t: number): MapLayout {
  const nodes: MapLayout["nodes"] = {};
  for (const [id, node] of Object.entries(to.nodes)) {
    const start = from.nodes[id] ?? node;
    nodes[id] = {
      ...node,
      x: lerp(start.x, node.x, t),
      y: lerp(start.y, node.y, t),
      w: lerp(start.w, node.w, t),
      h: lerp(start.h, node.h, t),
    };
  }
  const frame = (key: keyof MapLayout["frames"]) => ({
    ...to.frames[key],
    y: lerp(from.frames[key].y, to.frames[key].y, t),
    h: lerp(from.frames[key].h, to.frames[key].h, t),
  });
  return {
    nodes,
    tiers: to.tiers.map((tier) => {
      const start = from.tiers.find((item) => item.key === tier.key);
      return start ? { ...tier, y1: lerp(start.y1, tier.y1, t), y2: lerp(start.y2, tier.y2, t) } : tier;
    }),
    labels: to.labels.map((label) => {
      const start = from.labels.find((item) => item.key === label.key);
      return start ? { ...label, y: lerp(start.y, label.y, t) } : label;
    }),
    frames: { foundation: frame("foundation"), "governed-action": frame("governed-action") },
    height: lerp(from.height, to.height, t),
  };
}

/** Animates node positions between layouts so nodes and edges move together. */
function useTweenedLayout(target: MapLayout, animate: boolean) {
  // The in-between frame while a tween runs; null means "show the target".
  const [frame, setFrame] = useState<MapLayout | null>(null);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (!animate || from === target) {
      current.current = target;
      return;
    }
    const startedAt = performance.now();
    let handle = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / TWEEN_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (progress === 1) {
        current.current = target;
        setFrame(null);
        return;
      }
      const next = interpolate(from, target, eased);
      current.current = next;
      setFrame(next);
      handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [target, animate]);

  return animate && frame ? frame : target;
}

export function HowItWorksExplorer() {
  const segment = useSelectedLayoutSegment();
  const view: ViewId = isViewId(segment) ? segment : "foundation";
  const viewMeta = howItWorksViews.find((item) => item.id === view)!;
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const hashConcept = conceptsById[hash];
  const selectedId = hashConcept && conceptInView(hashConcept, view) ? hash : null;
  const selected = selectedId ? conceptsById[selectedId] : null;

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [userExpanded, setUserExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [railStep, setRailStep] = useState<number | null>(null);
  const activeRail = view === "full-model" ? railStep : null;

  const stageRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(DEFAULT_STAGE_WIDTH);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) {
        setStageWidth(width);
        requestAnimationFrame(() => setMeasured(true));
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Client navigations update the URL after render; re-read the hash then.
  useEffect(() => {
    window.dispatchEvent(new Event(HASH_EVENT));
  }, [pathname]);

  // A concept linked from a view that does not show it opens in its own story.
  useEffect(() => {
    if (hashConcept && !conceptInView(hashConcept, view)) {
      router.replace(`${pathFor(homeViewFor(hashConcept))}#${hashConcept.id}`, { scroll: false });
    }
  }, [hashConcept, view, router]);

  // Deep links land on the linked concept rather than the top of the page.
  useEffect(() => {
    const id = readHash();
    if (!conceptsById[id]) {
      return;
    }
    explorerRef.current?.scrollIntoView({ block: "start" });
    if (window.matchMedia("(min-width: 1200px)").matches) {
      // Wait for the cluster to open and the camera to settle.
      const timer = window.setTimeout(() => {
        const node = document.querySelector(`[data-node-id="${id}"]`);
        const box = node?.getBoundingClientRect();
        if (box && (box.top < 80 || box.bottom > window.innerHeight * 0.75)) {
          window.scrollBy({ top: box.top - window.innerHeight * 0.3 });
        }
      }, 800);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const select = useCallback(
    (id: string) => {
      const concept = conceptsById[id];
      if (!concept) {
        return;
      }
      if (!conceptInView(concept, view)) {
        router.push(`${pathFor(homeViewFor(concept))}#${id}`, { scroll: false });
        return;
      }
      window.history.replaceState(null, "", `#${id}`);
      window.dispatchEvent(new Event(HASH_EVENT));

      // In the wide Full Model the camera re-frames around the selection;
      // once it settles, make sure the concept is on screen vertically too.
      if (view === "full-model" && window.matchMedia("(min-width: 1200px)").matches) {
        window.setTimeout(() => {
          const node = document.querySelector(`[data-node-id="${id}"]`);
          const box = node?.getBoundingClientRect();
          if (box && (box.bottom > window.innerHeight - 24 || box.top < 80)) {
            window.scrollBy({
              top: box.top - window.innerHeight * 0.3,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          }
        }, reducedMotion ? 0 : 720);
      }
    },
    [router, view, reducedMotion],
  );

  const clear = useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new Event(HASH_EVENT));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clear();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  const toggle = useCallback((id: string) => {
    setUserExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const viewExpandable = storiesInView(view).flatMap((story) => expandableIds[story.id]);
  const allExpanded = viewExpandable.every((id) => userExpanded.has(id));
  const toggleAll = () => {
    setUserExpanded((previous) => {
      const next = new Set(previous);
      for (const id of viewExpandable) {
        if (allExpanded) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  };

  // Selected and highlighted details always have their cluster open.
  const forcedOpen = [
    ...(selectedId ? [selectedId] : []),
    ...(activeRail !== null ? mentalModel.steps[activeRail].concepts : []),
  ]
    .map((id) => detailParent[id])
    .filter(Boolean);
  const expandedKey = [...new Set([...userExpanded, ...forcedOpen])].sort().join("|");
  const expanded = useMemo(() => new Set(expandedKey ? expandedKey.split("|") : []), [expandedKey]);

  const targetLayout = useMemo(() => computeLayout(expanded), [expanded]);
  const animate = measured && !reducedMotion;
  const layout = useTweenedLayout(targetLayout, animate);

  const highlight = useMemo<ReadonlySet<string>>(() => {
    if (activeRail !== null) {
      return new Set(mentalModel.steps[activeRail].concepts.filter((id) => idInView(id, view)));
    }
    if (hoverId && idInView(hoverId, view)) {
      return neighbours(hoverId, view);
    }
    if (selectedId) {
      return pathThrough(selectedId, view);
    }
    return new Set();
  }, [activeRail, hoverId, selectedId, view]);

  const focus = useMemo(
    () => new Set([selectedId, hoverId].filter((id): id is string => Boolean(id))),
    [selectedId, hoverId],
  );

  const interaction: MapInteraction = {
    view,
    selectedId,
    highlight,
    focus,
    labelAllLit: activeRail !== null,
    expanded,
    onSelect: select,
    onHover: setHoverId,
    onToggle: toggle,
  };

  const panelWidth = Math.round(Math.min(420, Math.max(340, stageWidth * 0.32)));
  const fullModel = view === "full-model";
  const focusBox = fullModel && selectedId ? (targetLayout.nodes[selectedId] ?? null) : null;
  const camera = cameraFor(view, targetLayout, stageWidth, panelWidth, focusBox);
  const stageHeight = Math.round(Math.max(camera.height + 8, fullModel && !selected ? 0 : 640));
  // In the Full Model the panel only appears once a concept is selected.
  const panelVisible = !fullModel || Boolean(selected);
  const transition = animate
    ? "left 700ms cubic-bezier(0.22, 0.8, 0.24, 1), opacity 300ms ease, transform 400ms ease"
    : undefined;

  return (
    <div ref={explorerRef} id="explorer" className="scroll-mt-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{viewMeta.title}</h2>
          <p className="mt-2 text-base leading-7 text-ink-400">{viewMeta.description}</p>
        </div>
        <ViewSwitch view={view} selectedId={selectedId} />
      </div>

      {fullModel ? (
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4">
          <div className="grid gap-3 text-sm leading-6 text-ink-300 sm:text-[15px] sm:leading-7 lg:grid-cols-2">
            {fullModelIntro.lead.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <ol className="-mx-4 flex items-center gap-x-2 gap-y-1.5 overflow-x-auto px-4 pb-1 font-mono text-xs text-ink-400 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {fullModelIntro.chain.map((step, index) => (
              <li key={step} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <span className="rounded-sm border border-ink/10 bg-ink/[0.04] px-2 py-1 text-ink-200">{step}</span>
                {index < fullModelIntro.chain.length - 1 ? (
                  <span aria-hidden="true" className="text-accent-ink">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <MentalModelRail activeStep={activeRail} onStep={setRailStep} onSelect={select} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-400">{howItWorksPage.hint}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => select("genesis-mesh")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/15 bg-ink/[0.05] px-2.5 text-[13px] font-semibold whitespace-nowrap text-ink transition hover:border-accent-ink/70 sm:gap-2 sm:px-3 sm:text-sm"
          >
            <CircleHelp size={16} aria-hidden="true" />
            What is Genesis Mesh?
          </button>
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/15 bg-ink/[0.05] px-2.5 text-[13px] font-semibold whitespace-nowrap text-ink transition hover:border-accent-ink/70 sm:gap-2 sm:px-3 sm:text-sm"
          >
            {allExpanded ? (
              <ChevronsDownUp size={16} aria-hidden="true" />
            ) : (
              <ChevronsUpDown size={16} aria-hidden="true" />
            )}
            {allExpanded ? "Hide details" : "Show all details"}
          </button>
        </div>
      </div>

      {/* Desktop: one fixed map, three camera positions. The Full Model gets a wider stage on large screens. */}
      <div
        ref={stageRef}
        className="relative mt-4 hidden min-[1200px]:block"
        style={
          fullModel
            ? { width: "min(calc(100vw - 4rem), 1560px)", marginLeft: "calc(50% - min(calc(50vw - 2rem), 780px))" }
            : undefined
        }
      >
        <div
          className="relative overflow-clip rounded-xl"
          style={{
            height: stageHeight,
            transition: animate ? "height 700ms cubic-bezier(0.22, 0.8, 0.24, 1)" : undefined,
          }}
        >
          <WideMap layout={layout} camera={camera} animate={animate} interaction={interaction} />

          {/* When the Full Model camera pans, fade the edge where the map runs off the stage. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas to-transparent transition-opacity duration-500"
            style={{ opacity: fullModel && camera.x < -targetLayout.frames.foundation.x * camera.scale - 1 ? 1 : 0 }}
          />

          {/*
            The explanation panel. Single-story views use the side the other
            story left free; the Full Model opens it on the right and the
            camera makes room, so it never sits on top of the diagram.
          */}
          <aside
            aria-label="Concept explanation"
            className="absolute top-0 bottom-0 z-20"
            style={{
              width: panelWidth,
              left: view === "governed-action" ? 0 : stageWidth - panelWidth,
              opacity: panelVisible ? 1 : 0,
              transform: panelVisible ? "none" : "translateX(24px)",
              pointerEvents: panelVisible ? undefined : "none",
              transition,
            }}
            inert={!panelVisible}
          >
            <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-xl border border-ink/10 bg-surface p-6">
              {selected ? (
                <ConceptPanel key={selected.id} concept={selected} view={view} onClose={clear} onSelect={select} />
              ) : (
                <StoryIntroPanel view={view} onSelect={select} />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Phones and tablets: the same stages stacked, with a bottom sheet. */}
      <div className="mt-5 min-[1200px]:hidden">
        {!fullModel ? (
          <div className="mb-6">
            <StoryIntroPanel view={view} onSelect={select} compact />
          </div>
        ) : null}
        <NarrowMap interaction={interaction} />

        <div
          className="fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300"
          style={{ opacity: selected ? 1 : 0, pointerEvents: selected ? undefined : "none" }}
          onClick={clear}
          aria-hidden="true"
        />
        <aside
          aria-label="Concept explanation"
          className="fixed inset-x-0 bottom-0 z-[70] max-h-[82svh] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-ink/15 bg-surface px-5 pt-3 pb-8 shadow-2xl shadow-black/40"
          style={{
            transform: selected ? "translateY(0)" : "translateY(calc(100% + 4rem))",
            visibility: selected ? "visible" : "hidden",
            transition: "transform 300ms ease-out, visibility 0s linear " + (selected ? "0s" : "300ms"),
          }}
          inert={!selected}
        >
          <div aria-hidden="true" className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20" />
          {selected ? (
            <ConceptPanel key={selected.id} concept={selected} view={view} onClose={clear} onSelect={select} />
          ) : null}
        </aside>
      </div>
    </div>
  );
}

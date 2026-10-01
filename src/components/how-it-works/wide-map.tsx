"use client";

import { ChevronDown, Minus, Plus } from "lucide-react";
import {
  conceptsById,
  groupsById,
  relations,
  stories,
  type ViewId,
} from "@/content/how-genesis-mesh-works";
import { BreakableName } from "./blocks";
import { idInView, relationShown } from "./graph";
import { edgeGeometry, MAP_W, type Camera, type MapLayout, type NodeBox } from "./map-layout";

export type MapInteraction = {
  view: ViewId;
  selectedId: string | null;
  /** Concepts to emphasise; everything else in view is dimmed. Empty = no emphasis. */
  highlight: ReadonlySet<string>;
  /** Ends that reveal secondary (reference) edges and edge labels. */
  focus: ReadonlySet<string>;
  /** Label every lit edge (used while a mental-model step is active). */
  labelAllLit: boolean;
  expanded: ReadonlySet<string>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
};

/** The desktop map: one fixed coordinate space moved by a camera transform. */
export function WideMap({
  layout,
  camera,
  animate,
  interaction,
}: {
  layout: MapLayout;
  camera: Camera;
  animate: boolean;
  interaction: MapInteraction;
}) {
  const { view, highlight, focus, selectedId, onSelect, labelAllLit } = interaction;
  const emphasis = highlight.size > 0;

  const edges = relations
    .filter((relation) => layout.nodes[relation.from] && layout.nodes[relation.to])
    .map((relation) => {
      const shown = relationShown(relation, view, layout, focus);
      const lit = emphasis && highlight.has(relation.from) && highlight.has(relation.to);
      return {
        relation,
        shown,
        lit,
        geometry: edgeGeometry(layout.nodes[relation.from], layout.nodes[relation.to]),
      };
    });

  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{
        width: MAP_W,
        height: layout.height,
        transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
        transition: animate ? "transform 700ms cubic-bezier(0.22, 0.8, 0.24, 1)" : undefined,
      }}
    >
      {stories.map((story) => {
        const frame = layout.frames[story.id];
        const shown = idInView(story.frameConcept, view);
        const concept = conceptsById[story.frameConcept];
        const active = selectedId === story.frameConcept;

        return (
          <div
            key={story.id}
            className="absolute rounded-xl border border-dashed border-ink/15 bg-ink/[0.015] transition-opacity duration-500"
            style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, opacity: shown ? 1 : 0 }}
            inert={!shown}
          >
            <button
              type="button"
              onClick={() => onSelect(story.frameConcept)}
              className={[
                "absolute left-4 top-3 flex items-baseline gap-3 rounded-md px-2 py-1 text-left transition",
                active ? "bg-accent text-on-accent" : "hover:bg-ink/[0.06]",
              ].join(" ")}
            >
              <span className={["text-sm font-semibold", active ? "" : "text-ink"].join(" ")}>{concept.name}</span>
              {story.label !== concept.name ? (
                <span
                  className={[
                    "font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                    active ? "" : "text-ink-500",
                  ].join(" ")}
                >
                  {story.label}
                </span>
              ) : null}
            </button>
          </div>
        );
      })}

      <svg
        width={MAP_W}
        height={layout.height}
        viewBox={`0 0 ${MAP_W} ${layout.height}`}
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <marker id="hiw-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" style={{ fill: "var(--ink-500)" }} />
          </marker>
          <marker id="hiw-arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" style={{ fill: "var(--accent-ink)" }} />
          </marker>
        </defs>
        {layout.tiers.map((tier) => (
          <line
            key={tier.key}
            x1={tier.x}
            y1={tier.y1}
            x2={tier.x}
            y2={tier.y2 - 2}
            className="hiw-edge transition-opacity duration-500"
            strokeDasharray="3 4"
            strokeWidth={1.3}
            markerEnd="url(#hiw-arrow)"
            style={{ opacity: storyShown(tier.story, view) ? (emphasis ? 0.12 : 1) : 0 }}
          />
        ))}
        {edges.map(({ relation, shown, lit, geometry }) => {
          const bridge = relation.kind === "bridge";
          const accent = lit || (bridge && !emphasis);
          const opacity = !shown ? 0 : emphasis && !lit ? 0.18 : 1;
          const moving = relation.kind === "flow" || bridge;

          return (
            <g
              key={`${relation.from}-${relation.to}`}
              className="transition-opacity duration-500"
              style={{ opacity }}
            >
              <path
                d={geometry.d}
                fill="none"
                className={["hiw-edge", accent ? "hiw-edge-accent" : "", lit ? "hiw-edge-lit" : ""].join(" ")}
                strokeDasharray={bridge || relation.kind === "reference" ? "5 5" : undefined}
                strokeWidth={lit ? 2.2 : 1.3}
                markerEnd={relation.kind === "detail" ? undefined : `url(#${accent ? "hiw-arrow-accent" : "hiw-arrow"})`}
              />
              {moving && shown ? (
                <path
                  d={geometry.d}
                  fill="none"
                  className={["hiw-flow", accent ? "hiw-flow-accent" : "", lit ? "hiw-flow-lit" : ""].join(" ")}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      {edges
        .filter(({ shown, lit, relation }) => {
          if (!shown || !relation.label) {
            return false;
          }
          // At rest only the key bridges are labelled; focus reveals the rest.
          if (!emphasis) {
            return Boolean(relation.primary);
          }
          return lit && (labelAllLit || focus.has(relation.from) || focus.has(relation.to));
        })
        .map(({ relation, geometry }) => (
          <span
            key={`label-${relation.from}-${relation.to}`}
            className="hiw-edge-label pointer-events-none absolute z-10 max-w-44 -translate-x-1/2 -translate-y-1/2 rounded-md border border-accent-ink/30 bg-surface px-2 py-0.5 text-center text-[11px] leading-4 font-semibold text-accent-ink shadow-sm"
            style={{ left: geometry.mid.x, top: geometry.mid.y }}
          >
            {relation.label}
          </span>
        ))}

      {layout.labels.map((label) => (
        <p
          key={label.key}
          className="absolute font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 transition-opacity duration-500"
          style={{ left: label.x, top: label.y, width: label.w, opacity: storyShown(label.story, view) ? 1 : 0 }}
        >
          <span className="rounded-sm bg-canvas px-1 py-0.5">{label.text}</span>
        </p>
      ))}

      {Object.values(layout.nodes).map((node) => (
        <MapNode key={node.id} node={node} interaction={interaction} />
      ))}
    </div>
  );
}

function storyShown(story: string, view: ViewId) {
  return view === "full-model" || view === story;
}

function MapNode({ node, interaction }: { node: NodeBox; interaction: MapInteraction }) {
  const { view, highlight, selectedId, expanded, onSelect, onHover, onToggle } = interaction;
  const shown = !node.hidden && idInView(node.id, view);
  const dimmed = highlight.size > 0 && !highlight.has(node.id);
  const lit = highlight.size > 0 && highlight.has(node.id);
  const selected = selectedId === node.id;
  const open = expanded.has(node.id);

  const style: React.CSSProperties = {
    width: node.w,
    height: node.h,
    transform: `translate(${node.x}px, ${node.y}px)`,
    opacity: shown ? (dimmed ? 0.55 : 1) : 0,
  };

  if (node.kind === "group") {
    const group = groupsById[node.id];
    return (
      <div className="absolute left-0 top-0 transition-opacity duration-500" style={style} inert={!shown}>
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          aria-expanded={open}
          className="flex h-full w-full items-center justify-between gap-2 rounded-lg border border-dashed border-ink/25 bg-surface px-3.5 text-left transition hover:border-accent-ink/70"
        >
          <span className="min-w-0">
            <span className="block text-[13px] leading-[1.15rem] font-semibold text-ink">{group.name}</span>
            <span className="block text-xs text-ink-400">
              {node.detailCount} concepts · {open ? "hide" : "show"}
            </span>
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={["shrink-0 text-ink-400 transition-transform", open ? "rotate-180" : ""].join(" ")}
          />
        </button>
      </div>
    );
  }

  const concept = conceptsById[node.id];
  const isDetail = node.kind === "detail";

  return (
    <div
      className="absolute left-0 top-0 transition-opacity duration-500"
      style={style}
      inert={!shown}
      data-node-id={node.id}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        onFocus={() => onHover(node.id)}
        onBlur={() => onHover(null)}
        aria-pressed={selected}
        className={[
          "hiw-node flex h-full w-full flex-col justify-center rounded-lg border text-left transition-[border-color,box-shadow,background-color]",
          isDetail ? "px-3" : node.w < 160 ? "px-2.5" : "px-3.5",
          node.detailCount > 0 ? "pb-2" : "",
          selected
            ? "border-accent-ink bg-surface shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_28%,transparent)]"
            : lit
              ? "hiw-node-lit border-accent-ink/60 bg-surface"
              : isDetail
              ? "border-ink/15 bg-surface-raised hover:border-accent-ink/70"
              : "border-ink/15 bg-surface hover:border-accent-ink/70",
        ].join(" ")}
      >
        {node.tag ? (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
            {node.tag}
          </span>
        ) : null}
        <span
          className={[
            node.w < 160 && !node.tag ? "line-clamp-3" : "line-clamp-2",
            "font-semibold text-ink [overflow-wrap:anywhere]",
            isDetail ? "text-[12.5px] leading-4" : "text-[13.5px] leading-[1.15rem]",
          ].join(" ")}
        >
          <BreakableName name={concept.name} />
        </span>
        {!isDetail ? (
          <span
            className={[
              "mt-0.5 text-xs leading-4 text-ink-400",
              node.tag || node.w < 160 ? "line-clamp-1" : "line-clamp-2",
            ].join(" ")}
          >
            {concept.tagline}
          </span>
        ) : null}
      </button>
      {node.detailCount > 0 ? (
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} ${node.detailCount} detail concepts for ${concept.name}`}
          className={[
            "absolute -bottom-2.5 left-1/2 flex h-5 -translate-x-1/2 items-center gap-0.5 rounded-full border px-1.5 font-mono text-[10px] font-bold transition",
            open
              ? "border-accent-ink bg-accent text-on-accent"
              : "border-ink/20 bg-surface text-ink-300 hover:border-accent-ink hover:text-accent-ink",
          ].join(" ")}
        >
          {open ? <Minus size={10} aria-hidden="true" /> : <Plus size={10} aria-hidden="true" />}
          {node.detailCount}
        </button>
      ) : null}
    </div>
  );
}

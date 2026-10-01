"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
  conceptsById,
  groupsById,
  relations,
  stories,
  type StageNode,
} from "@/content/how-genesis-mesh-works";
import { BreakableName } from "./blocks";
import type { MapInteraction } from "./wide-map";

const bridges = relations.filter((relation) => relation.kind === "bridge");

/**
 * Phone and tablet layout: each story is a vertical timeline. Stages keep the
 * same order as the desktop map; every stage is a full-width list card, so
 * nothing is orphaned in a half-empty grid. Switching views collapses the
 * story that is not in view, so nothing jumps around.
 */
export function NarrowMap({ interaction }: { interaction: MapInteraction }) {
  const { view, onSelect, selectedId, highlight } = interaction;

  return (
    <div className="grid">
      {stories.map((story, storyIndex) => {
        const open = view === "full-model" || view === story.id;
        const frameConcept = conceptsById[story.frameConcept];
        const frameSelected = selectedId === story.frameConcept;

        return (
          <div key={story.id} className="grid">
            {storyIndex === 1 ? (
              <Collapsible open={view === "full-model"}>
                <section
                  aria-label="Where the stories connect"
                  className="my-6 rounded-xl border border-dashed border-accent-ink/40 bg-accent/[0.04] px-4 pt-3.5 pb-1.5"
                >
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
                    Where the stories connect
                  </p>
                  <ul className="mt-1.5 divide-y divide-ink/10">
                    {bridges.map((relation) => {
                      const lit = highlight.size > 0 && highlight.has(relation.from) && highlight.has(relation.to);
                      return (
                        <li key={`${relation.from}-${relation.to}`}>
                          <button
                            type="button"
                            onClick={() => onSelect(relation.to)}
                            className="flex w-full items-center gap-3 py-2.5 text-left"
                            style={{ opacity: highlight.size > 0 && !lit ? 0.6 : 1 }}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] leading-5 font-semibold text-ink">
                                {conceptsById[relation.from].name}
                                <span className="px-1.5 text-accent-ink">→</span>
                                <BreakableName name={conceptsById[relation.to].name} />
                              </span>
                              <span className="block font-mono text-[11px] text-ink-400">{relation.label}</span>
                            </span>
                            <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-ink-500" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </Collapsible>
            ) : null}

            <Collapsible open={open}>
              <section aria-label={story.title}>
                <button
                  type="button"
                  onClick={() => onSelect(story.frameConcept)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left transition",
                    frameSelected
                      ? "border-accent-ink bg-accent text-on-accent"
                      : "border-ink/15 bg-ink/[0.04] text-ink hover:border-accent-ink/70",
                  ].join(" ")}
                >
                  <span className="text-sm font-semibold">{frameConcept.name}</span>
                  {story.label !== frameConcept.name ? (
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
                      {story.label}
                    </span>
                  ) : null}
                  <ChevronRight size={14} aria-hidden="true" className="opacity-60" />
                </button>

                <ol className="relative mt-4 pl-7">
                  <span aria-hidden="true" className="absolute top-3 bottom-6 left-[7px] w-px bg-ink/15">
                    <span className="hiw-travel absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-ink" />
                  </span>
                  {story.stages.map((stage) => (
                    <li key={stage.id} className="relative pb-4 last:pb-0">
                      <span
                        aria-hidden="true"
                        className="absolute top-3.5 -left-7 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-ink/20 bg-canvas"
                      >
                        <span className="h-[5px] w-[5px] rounded-full bg-accent-ink" />
                      </span>
                      {stage.label ? (
                        <p className="mb-2 pt-3 font-mono text-[10.5px] leading-4 font-semibold uppercase tracking-[0.14em] text-ink-500">
                          {stage.label}
                        </p>
                      ) : null}
                      <div className="divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10 bg-surface">
                        {stage.nodes.map((node) => (
                          <StageRow key={node.id} node={node} interaction={interaction} />
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      inert={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function StageRow({ node, interaction }: { node: StageNode; interaction: MapInteraction }) {
  const { selectedId, highlight, expanded, onSelect, onToggle } = interaction;
  const open = expanded.has(node.id);
  const details = node.details ?? [];
  const group = groupsById[node.id];
  const emphasis = highlight.size > 0;

  const detailList =
    open && details.length ? (
      <div className="px-4 pt-0.5 pb-3.5">
        {node.detailsLabel ? (
          <p className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {node.detailsLabel}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {details.map((detail) => (
            <DetailChip key={detail} id={detail} interaction={interaction} />
          ))}
        </div>
      </div>
    ) : null;

  if (group) {
    return (
      <div className={open ? "bg-ink/[0.02]" : ""}>
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          aria-expanded={open}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm leading-5 font-semibold text-ink">{group.name}</span>
            <span className="block text-xs text-ink-400">{details.length} concepts</span>
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={["shrink-0 text-ink-400 transition-transform", open ? "rotate-180" : ""].join(" ")}
          />
        </button>
        {detailList}
      </div>
    );
  }

  const concept = conceptsById[node.id];
  const selected = selectedId === node.id;
  const lit = emphasis && highlight.has(node.id);

  return (
    <div
      className={[
        "transition-[opacity,background-color]",
        selected
          ? "bg-accent/[0.09] shadow-[inset_3px_0_0_var(--accent)]"
          : lit
            ? "shadow-[inset_3px_0_0_var(--accent-ink)]"
            : "",
      ].join(" ")}
      style={{ opacity: emphasis && !lit && !selected ? 0.6 : 1 }}
    >
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          aria-pressed={selected}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            {node.tag ? (
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
                {node.tag}
              </span>
            ) : null}
            <span className="block text-[15px] leading-5 font-semibold text-ink [overflow-wrap:anywhere]">
              <BreakableName name={concept.name} />
            </span>
            <span className="mt-0.5 block text-[13px] leading-5 text-ink-400">{concept.tagline}</span>
          </span>
          {details.length ? null : <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-ink-500" />}
        </button>
        {details.length ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} ${details.length} detail concepts for ${concept.name}`}
            className={[
              "flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 border-l border-ink/10 font-mono text-[11px] font-bold transition",
              open ? "text-accent-ink" : "text-ink-400",
            ].join(" ")}
          >
            +{details.length}
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={["transition-transform", open ? "rotate-180" : ""].join(" ")}
            />
          </button>
        ) : null}
      </div>
      {detailList}
    </div>
  );
}

function DetailChip({ id, interaction }: { id: string; interaction: MapInteraction }) {
  const { selectedId, highlight, onSelect } = interaction;
  const selected = selectedId === id;
  const dimmed = highlight.size > 0 && !highlight.has(id) && !selected;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      className={[
        "rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition",
        selected
          ? "border-accent-ink bg-accent text-on-accent"
          : "border-ink/15 bg-surface-raised text-ink hover:border-accent-ink/70",
      ].join(" ")}
      style={{ opacity: dimmed ? 0.6 : 1 }}
    >
      {conceptsById[id].name}
    </button>
  );
}

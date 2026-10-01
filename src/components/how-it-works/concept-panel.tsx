"use client";

import { useId } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Info, Lightbulb, MapPin, Shapes, X } from "lucide-react";
import {
  conceptsById,
  groupsById,
  howItWorksViews,
  storyConceptOrder,
  stories,
  type Block,
  type Concept,
  type ViewId,
} from "@/content/how-genesis-mesh-works";
import { siteLinks } from "@/content/site";
import { Blocks } from "./blocks";
import { idInView, relationsOf } from "./graph";
import { detailParent } from "./map-layout";

const storyLabel = Object.fromEntries(stories.map((story) => [story.id, story.label]));
const fullModelPath = howItWorksViews.find((item) => item.id === "full-model")!.path;

const stageNodes = stories.flatMap((story) => story.stages.flatMap((stage) => stage.nodes));

function detailsOf(id: string) {
  return stageNodes.find((node) => node.id === id)?.details ?? [];
}

function tagOf(id: string) {
  return stageNodes.find((node) => node.id === id)?.tag;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 pt-5">
      <h3 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
        <Icon size={14} aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ConceptPanel({
  concept,
  view,
  onClose,
  onSelect,
}: {
  concept: Concept;
  view: ViewId;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const { inView, elsewhere } = relationsOf(concept.id, view);
  // Detail links are already listed under "Inside this concept" / "Part of".
  const connections = inView.filter(({ relation }) => relation.kind !== "detail");
  const details = detailsOf(concept.id).filter((id) => conceptsById[id]);
  const parent = detailParent[concept.id];
  const story = concept.story === "system" ? null : stories.find((item) => item.id === concept.story)!;
  const order = story ? storyConceptOrder(story).filter((id) => idInView(id, view)) : [];
  const position = order.indexOf(concept.id);
  const previous = position > 0 ? order[position - 1] : undefined;
  const next = position >= 0 && position < order.length - 1 ? order[position + 1] : undefined;
  const tag = tagOf(concept.id);
  const titleId = useId();

  return (
    <article aria-labelledby={titleId} className="grid gap-5">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            <span>{concept.story === "system" ? "Genesis Mesh" : storyLabel[concept.story]}</span>
            {tag ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-accent-ink">{tag}</span>
              </>
            ) : null}
          </p>
          <h2 id={titleId} className="mt-2 break-words text-2xl font-semibold text-ink">
            {concept.name}
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-400">{concept.tagline}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink/15 text-ink-300 transition hover:border-accent-ink/70 hover:text-ink"
          aria-label="Close explanation"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="grid gap-5">
        <Section icon={Info} title="What it is">
          <Blocks blocks={concept.whatItIs} />
        </Section>

        <Section icon={MapPin} title="Where it fits">
          <Blocks blocks={concept.whereItFits} />
        </Section>

        <Section icon={Lightbulb} title="Real-world analogy">
          <div className="rounded-md border border-accent-ink/25 bg-accent/[0.06] p-4">
            <Blocks blocks={concept.analogy} />
          </div>
        </Section>

        {concept.note ? (
          <Section icon={Info} title={concept.note.title}>
            <Blocks blocks={concept.note.body} />
          </Section>
        ) : null}

        {details.length || parent ? (
          <Section icon={Shapes} title={details.length ? "Inside this concept" : "Part of"}>
            <div className="flex flex-wrap gap-2">
              {details.length ? (
                details.map((id) => (
                  <ConceptChip key={id} id={id} onSelect={onSelect} />
                ))
              ) : conceptsById[parent] ? (
                <ConceptChip id={parent} onSelect={onSelect} />
              ) : (
                <span className="rounded-md border border-ink/10 px-3 py-1.5 text-sm text-ink-300">
                  {groupsById[parent]?.name}
                </span>
              )}
            </div>
          </Section>
        ) : null}

        {connections.length || elsewhere.length ? (
          <Section icon={ArrowRight} title="Connected to">
            <ul className="grid gap-2">
              {connections.map(({ relation, other, outgoing }) => (
                <li key={`${relation.from}-${relation.to}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(other)}
                    className="group flex w-full items-center gap-3 rounded-md border border-ink/10 bg-ink/[0.03] px-3 py-2 text-left transition hover:border-accent-ink/60"
                  >
                    <span
                      className="font-mono text-xs text-ink-500 transition group-hover:text-accent-ink"
                      aria-label={outgoing ? "leads to" : "comes from"}
                    >
                      {outgoing ? "→" : "←"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{conceptsById[other].name}</span>
                      {relation.label ? (
                        <span className="block text-xs leading-5 text-ink-400">{relation.label}</span>
                      ) : null}
                    </span>
                    {relation.kind === "bridge" ? (
                      <span className="shrink-0 rounded-sm bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
                        Bridge
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            {elsewhere.length ? (
              <Link
                href={`${fullModelPath}#${concept.id}`}
                scroll={false}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink hover:underline"
              >
                {elsewhere.length === 1 ? "1 more connection" : `${elsewhere.length} more connections`} in the
                other story. See them in Full Model
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : null}
          </Section>
        ) : null}

        {concept.glossaryAnchor ? (
          <a
            href={`${siteLinks.genesisMeshGlossary}#${concept.glossaryAnchor}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-300 transition hover:text-ink"
          >
            Glossary entry
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : null}

        {previous || next ? (
          <nav aria-label="Story order" className="grid grid-cols-2 gap-2 border-t border-ink/10 pt-5">
            {previous ? (
              <button
                type="button"
                onClick={() => onSelect(previous)}
                className="flex min-w-0 flex-col items-start rounded-md border border-ink/10 px-3 py-2 text-left transition hover:border-accent-ink/60"
              >
                <span className="flex items-center gap-1 text-xs text-ink-500">
                  <ArrowLeft size={13} aria-hidden="true" /> Previous
                </span>
                <span className="w-full truncate text-sm font-semibold text-ink">{conceptsById[previous].name}</span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                type="button"
                onClick={() => onSelect(next)}
                className="flex min-w-0 flex-col items-end rounded-md border border-ink/10 px-3 py-2 text-right transition hover:border-accent-ink/60"
              >
                <span className="flex items-center gap-1 text-xs text-ink-500">
                  Next <ArrowRight size={13} aria-hidden="true" />
                </span>
                <span className="w-full truncate text-sm font-semibold text-ink">{conceptsById[next].name}</span>
              </button>
            ) : null}
          </nav>
        ) : null}
      </div>
    </article>
  );
}

function ConceptChip({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="rounded-md border border-ink/15 bg-ink/[0.04] px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-accent-ink/70"
    >
      {conceptsById[id].name}
    </button>
  );
}

/** Shown in the panel space before anything is selected. */
export function StoryIntroPanel({
  view,
  onSelect,
  compact = false,
}: {
  view: ViewId;
  onSelect: (id: string) => void;
  /** Phones: just the guiding quote and the start button; the rest folds away. */
  compact?: boolean;
}) {
  const story = stories.find((item) => item.id === view);
  if (!story) {
    return null;
  }

  const start = (
    <button type="button" onClick={() => onSelect(story.startConcept)} className="btn-primary justify-self-start">
      Start with {conceptsById[story.startConcept].name}
      <ArrowRight size={17} aria-hidden="true" />
    </button>
  );

  if (compact) {
    const isQuote = (block: Block) => typeof block !== "string" && "quote" in block;
    const quotes = story.intro.filter(isQuote);
    const rest = story.intro.filter((block) => !isQuote(block));
    return (
      <div className="grid gap-4">
        <Blocks blocks={quotes} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {start}
          <details className="group/intro w-full">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-ink-300 [&::-webkit-details-marker]:hidden">
              About this story
              <ChevronDown size={15} aria-hidden="true" className="transition-transform group-open/intro:rotate-180" />
            </summary>
            <div className="mt-3">
              <Blocks blocks={rest} />
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
          {story.label}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{story.title}</h2>
      </div>
      <Blocks blocks={story.intro} />
      {start}
      <p className="text-sm leading-6 text-ink-400">
        Or select any concept on the map. Concepts marked with a count open up into more detail.
      </p>
    </div>
  );
}

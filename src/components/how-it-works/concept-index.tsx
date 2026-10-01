import { ChevronDown } from "lucide-react";
import {
  conceptsById,
  howItWorksPage,
  storiesInView,
  storyConceptOrder,
  type Concept,
  type ViewId,
} from "@/content/how-genesis-mesh-works";
import { Blocks } from "./blocks";

/** Concepts shown in a view, in story order, with Genesis Mesh itself first. */
export function conceptsForView(view: ViewId): { title: string; concepts: Concept[] }[] {
  return [
    { title: "Genesis Mesh", concepts: [conceptsById["genesis-mesh"]] },
    ...storiesInView(view).map((story) => ({
      title: story.title,
      concepts: storyConceptOrder(story).map((id) => conceptsById[id]),
    })),
  ];
}

/**
 * The same explanations as plain, server-rendered text: collapsed by default,
 * readable without JavaScript, and indexable.
 */
export function ConceptIndex({ view }: { view: ViewId }) {
  const sections = conceptsForView(view);
  const total = sections.reduce((sum, section) => sum + section.concepts.length, 0);

  return (
    <details className="group/index mt-16 rounded-xl border border-ink/10 bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-base font-semibold text-ink">{howItWorksPage.textIndexTitle}</span>
          <span className="block text-sm text-ink-400">
            All {total} concepts in this view, with what each is, where it fits, and a real-world analogy.
          </span>
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className="shrink-0 text-ink-400 transition-transform group-open/index:rotate-180"
        />
      </summary>
      <div className="grid gap-10 border-t border-ink/10 px-5 py-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
              {section.title}
            </h2>
            <div className="mt-4 grid gap-8">
              {section.concepts.map((concept) => (
                <article key={concept.id} id={`text-${concept.id}`} className="grid gap-3">
                  <h3 className="text-lg font-semibold text-ink">{concept.name}</h3>
                  <IndexPart title="What it is" blocks={concept.whatItIs} />
                  <IndexPart title="Where it fits" blocks={concept.whereItFits} />
                  <IndexPart title="Real-world analogy" blocks={concept.analogy} />
                  {concept.note ? <IndexPart title={concept.note.title} blocks={concept.note.body} /> : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}

function IndexPart({ title, blocks }: { title: string; blocks: Concept["whatItIs"] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <h4 className="text-sm font-semibold text-ink-400">{title}</h4>
      <Blocks blocks={blocks} />
    </div>
  );
}

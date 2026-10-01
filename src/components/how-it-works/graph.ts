import {
  conceptsById,
  groupsById,
  relations,
  stories,
  type Relation,
  type StoryId,
  type ViewId,
} from "@/content/how-genesis-mesh-works";
import { detailParent, type MapLayout } from "./map-layout";

const groupStory: Record<string, StoryId> = Object.fromEntries(
  stories.flatMap((story) =>
    story.stages.flatMap((stage) =>
      stage.nodes.filter((node) => groupsById[node.id]).map((node) => [node.id, story.id] as const),
    ),
  ),
);

export function storyOf(id: string): StoryId | "system" | undefined {
  return conceptsById[id]?.story ?? groupStory[id];
}

export function idInView(id: string, view: ViewId) {
  const story = storyOf(id);
  return story !== undefined && (story === "system" || view === "full-model" || story === view);
}

/** Whether a node is currently drawn: in the view and not a collapsed detail. */
export function nodeShown(id: string, view: ViewId, layout: MapLayout) {
  const box = layout.nodes[id];
  return Boolean(box) && !box.hidden && idInView(id, view);
}

export function relationShown(relation: Relation, view: ViewId, layout: MapLayout, focus: ReadonlySet<string>) {
  if (!nodeShown(relation.from, view, layout) || !nodeShown(relation.to, view, layout)) {
    return false;
  }
  if (relation.kind === "reference") {
    return focus.has(relation.from) || focus.has(relation.to);
  }
  return true;
}

/** Relations touching a concept, split by whether the other end is in the view. */
export function relationsOf(id: string, view: ViewId) {
  const inView: { relation: Relation; other: string; outgoing: boolean }[] = [];
  const elsewhere: { relation: Relation; other: string; outgoing: boolean }[] = [];

  for (const relation of relations) {
    if (relation.from !== id && relation.to !== id) {
      continue;
    }
    const outgoing = relation.from === id;
    const other = outgoing ? relation.to : relation.from;
    if (!conceptsById[other]) {
      continue;
    }
    (idInView(other, view) ? inView : elsewhere).push({ relation, other, outgoing });
  }

  return { inView, elsewhere };
}

export function neighbours(id: string, view: ViewId): Set<string> {
  const result = new Set<string>([id]);
  for (const relation of relations) {
    if (relation.from === id && idInView(relation.to, view)) {
      result.add(relation.to);
    }
    if (relation.to === id && idInView(relation.from, view)) {
      result.add(relation.from);
    }
  }
  return result;
}

/**
 * Everything upstream and downstream of a concept along the main flow and
 * the bridges, plus its direct neighbours. Used to light up a selection.
 */
export function pathThrough(id: string, view: ViewId): Set<string> {
  const chain = relations.filter(
    (relation) =>
      (relation.kind === "flow" || relation.kind === "bridge") &&
      idInView(relation.from, view) &&
      idInView(relation.to, view),
  );
  const result = neighbours(id, view);

  const walk = (start: string, forward: boolean) => {
    const queue = [start];
    const seen = new Set<string>([start]);
    while (queue.length) {
      const current = queue.shift()!;
      for (const relation of chain) {
        const [from, to] = forward ? [relation.from, relation.to] : [relation.to, relation.from];
        if (from === current && !seen.has(to)) {
          seen.add(to);
          result.add(to);
          queue.push(to);
        }
      }
    }
  };

  // A detail's path is its parent's path.
  const anchor = detailParent[id] && !conceptsById[detailParent[id]] ? id : (detailParent[id] ?? id);
  result.add(anchor);
  walk(anchor, true);
  walk(anchor, false);
  return result;
}

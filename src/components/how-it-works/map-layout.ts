import {
  conceptsById,
  howItWorksViews,
  stories,
  type StoryId,
  type ViewId,
} from "@/content/how-genesis-mesh-works";

/*
 * One fixed coordinate space for the whole model. Foundation always sits in
 * the left lane and Governed Action in the right lane; views only move the
 * camera. Expanding a cluster pushes later rows down but never moves a
 * concept sideways or into the other lane.
 */

export const LANE_W = 600;
export const LANE_GAP = 140;
const MARGIN = 20;
export const MAP_W = MARGIN * 2 + LANE_W * 2 + LANE_GAP;
export const laneX: Record<StoryId, number> = {
  foundation: MARGIN,
  "governed-action": MARGIN + LANE_W + LANE_GAP,
};
/** Vertical channel between the lanes where bridges travel. */
const BRIDGE_CHANNEL_X = MARGIN + LANE_W + LANE_GAP / 2;

const NODE_H = 84;
const NODE_MAX_W = 184;
/** Single-step rows (the spines) get wider nodes so both lanes carry the same weight. */
const SPINE_W = 232;
const NODE_GAP = 16;
const ROW_GAP = 40;
const ROW_LABEL_H = 28;
const DETAIL_W = 168;
const DETAIL_H = 40;
const DETAIL_GAP = 10;
const DETAIL_LABEL_H = 22;
const GROUP_W = 360;
const GROUP_H = 64;
const FRAME_HEAD = 60;
const FRAME_INSET = 16;
const FRAME_BOTTOM = 24;

export type NodeKind = "core" | "detail" | "group";

export type NodeBox = {
  id: string;
  kind: NodeKind;
  story: StoryId;
  x: number;
  y: number;
  w: number;
  h: number;
  tag?: string;
  parent?: string;
  /** Number of detail concepts behind this node, for the expand control. */
  detailCount: number;
  /** A collapsed detail: kept at its parent's position so it can animate out. */
  hidden: boolean;
};

export type LabelBox = { key: string; text: string; x: number; y: number; w: number; story: StoryId };

export type FrameBox = { story: StoryId; x: number; y: number; w: number; h: number };

/** A plain "↓" between rows, for steps of the guide's simplified view. */
export type TierBox = { key: string; story: StoryId; x: number; y1: number; y2: number };

export type MapLayout = {
  nodes: Record<string, NodeBox>;
  labels: LabelBox[];
  tiers: TierBox[];
  frames: Record<StoryId, FrameBox>;
  height: number;
};

/** Parent node (or group) for every detail concept. */
export const detailParent: Record<string, string> = Object.fromEntries(
  stories.flatMap((story) =>
    story.stages.flatMap((stage) =>
      stage.nodes.flatMap((node) => (node.details ?? []).map((detail) => [detail, node.id])),
    ),
  ),
);

/** Every node that can be expanded, per story. */
export const expandableIds: Record<StoryId, string[]> = {
  foundation: [],
  "governed-action": [],
};
for (const story of stories) {
  for (const stage of story.stages) {
    for (const node of stage.nodes) {
      if (node.details?.length) {
        expandableIds[story.id].push(node.id);
      }
    }
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function layoutStory(
  storyId: StoryId,
  startY: number,
  expanded: ReadonlySet<string>,
  nodes: Record<string, NodeBox>,
  labels: LabelBox[],
  tiers: TierBox[],
) {
  const story = stories.find((item) => item.id === storyId)!;
  const x0 = laneX[storyId];
  let y = startY;

  for (const stage of story.stages) {
    const tierStart = y - ROW_GAP + 10;
    if (stage.label) {
      labels.push({ key: `${stage.id}-label`, text: stage.label, x: x0, y, w: LANE_W, story: storyId });
      y += ROW_LABEL_H;
    }

    const count = stage.nodes.length;
    // Rows with explicit positions are as wide as their spacing allows.
    const centres = stage.nodes.map((node, index) => node.at ?? (index + 0.5) / count).sort((a, b) => a - b);
    const tightest = Math.min(...centres.slice(1).map((centre, index) => (centre - centres[index]) * LANE_W));
    const coreWidth = Math.min(
      count === 1 ? SPINE_W : NODE_MAX_W,
      (LANE_W - (count - 1) * NODE_GAP) / count,
      Number.isFinite(tightest) ? tightest - 12 : Infinity,
    );
    if (stage.continues) {
      tiers.push({ key: `${stage.id}-tier`, story: storyId, x: x0 + LANE_W / 2, y1: tierStart, y2: y });
    }

    stage.nodes.forEach((node, index) => {
      const isGroup = !conceptsById[node.id];
      const w = isGroup ? (count === 1 ? GROUP_W : (LANE_W - (count - 1) * NODE_GAP) / count) : coreWidth;
      const h = isGroup ? GROUP_H : NODE_H;
      const center = x0 + (node.at ?? (index + 0.5) / count) * LANE_W;
      nodes[node.id] = {
        id: node.id,
        kind: isGroup ? "group" : "core",
        story: storyId,
        x: clamp(center - w / 2, x0, x0 + LANE_W - w),
        y,
        w,
        h,
        tag: node.tag,
        detailCount: node.details?.length ?? 0,
        hidden: false,
      };
    });

    const rowHeight = Math.max(...stage.nodes.map((node) => nodes[node.id].h));
    y += rowHeight;

    // Details: open clusters get packed rows below their parent; closed ones
    // collapse onto the parent so they can animate in from there.
    const open = stage.nodes.filter((node) => node.details?.length && expanded.has(node.id));
    for (const node of stage.nodes) {
      if (!open.includes(node)) {
        const parent = nodes[node.id];
        for (const detail of node.details ?? []) {
          nodes[detail] = {
            id: detail,
            kind: "detail",
            story: storyId,
            x: parent.x + parent.w / 2 - DETAIL_W / 2,
            y: parent.y + parent.h / 2 - DETAIL_H / 2,
            w: DETAIL_W,
            h: DETAIL_H,
            parent: node.id,
            detailCount: 0,
            hidden: true,
          };
        }
      }
    }

    if (open.length) {
      y += 24;
      const label = open.length === 1 ? open[0].detailsLabel : undefined;
      if (label) {
        labels.push({ key: `${open[0].id}-details`, text: label, x: x0, y, w: LANE_W, story: storyId });
        y += DETAIL_LABEL_H;
      }

      const perLine = Math.floor((LANE_W + DETAIL_GAP) / (DETAIL_W + DETAIL_GAP));
      const chips = open.flatMap((node) => (node.details ?? []).map((detail) => ({ detail, parent: node.id })));
      const anchor =
        open.length === 1 ? nodes[open[0].id].x + nodes[open[0].id].w / 2 : x0 + LANE_W / 2;

      for (let start = 0; start < chips.length; start += perLine) {
        const line = chips.slice(start, start + perLine);
        const lineWidth = line.length * DETAIL_W + (line.length - 1) * DETAIL_GAP;
        const left = clamp(anchor - lineWidth / 2, x0, x0 + LANE_W - lineWidth);
        line.forEach(({ detail, parent }, index) => {
          nodes[detail] = {
            id: detail,
            kind: "detail",
            story: storyId,
            x: left + index * (DETAIL_W + DETAIL_GAP),
            y,
            w: DETAIL_W,
            h: DETAIL_H,
            parent,
            detailCount: 0,
            hidden: false,
          };
        });
        y += DETAIL_H + DETAIL_GAP;
      }
      y -= DETAIL_GAP;
    }

    y += ROW_GAP;
  }

  return y - ROW_GAP;
}

export function computeLayout(expanded: ReadonlySet<string>): MapLayout {
  const nodes: Record<string, NodeBox> = {};
  const labels: LabelBox[] = [];
  const tiers: TierBox[] = [];

  const foundationTop = 0;
  const foundationBottom = layoutStory("foundation", foundationTop + FRAME_HEAD, expanded, nodes, labels, tiers);

  // The action story starts level with the Network Authority, the point where
  // foundation trust is handed to real actions.
  const actionStart = nodes["network-authority"].y;
  const actionBottom = layoutStory("governed-action", actionStart, expanded, nodes, labels, tiers);

  const frame = (story: StoryId, top: number, bottom: number): FrameBox => ({
    story,
    x: laneX[story] - FRAME_INSET,
    y: top,
    w: LANE_W + FRAME_INSET * 2,
    h: bottom + FRAME_BOTTOM - top,
  });

  const frames = {
    foundation: frame("foundation", foundationTop, foundationBottom),
    "governed-action": frame("governed-action", actionStart - FRAME_HEAD, actionBottom),
  };

  return {
    nodes,
    labels,
    tiers,
    frames,
    height: Math.max(frames.foundation.y + frames.foundation.h, frames["governed-action"].y + frames["governed-action"].h) + 8,
  };
}

export type Point = { x: number; y: number };

export type EdgeGeometry = { d: string; mid: Point };

function cubic(p0: Point, p1: Point, p2: Point, p3: Point): EdgeGeometry {
  return {
    d: `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`,
    mid: { x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8, y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8 },
  };
}

function channelRoute(start: Point, end: Point): EdgeGeometry {
  const r = Math.min(18, Math.abs(end.y - start.y) / 2);
  const down = end.y > start.y ? 1 : -1;
  const x = BRIDGE_CHANNEL_X;
  const towards = end.x > start.x ? 1 : -1;
  return {
    d: [
      `M${start.x},${start.y}`,
      `H${x - r * towards}`,
      `Q${x},${start.y} ${x},${start.y + r * down}`,
      `V${end.y - r * down}`,
      `Q${x},${end.y} ${x + r * towards},${end.y}`,
      `H${end.x}`,
    ].join(" "),
    // Label the bridge where it enters its target, not in the shared channel.
    mid: end.x > start.x ? { x: (x + end.x) / 2, y: end.y } : { x: (x + start.x) / 2, y: start.y },
  };
}

/** Inputs of the action story; bridges into these enter from above. */
const firstActionStage = new Set(stories[1].stages[0].nodes.map((node) => node.id));

/** Route an edge between two boxes in map coordinates. */
export function edgeGeometry(a: NodeBox, b: NodeBox): EdgeGeometry {
  if (a.story !== b.story) {
    // Bridges are routed from the Foundation lane into the Governed Action
    // lane, then reversed if the relation points the other way.
    const [left, right] = a.story === "foundation" ? [a, b] : [b, a];
    const start = { x: left.x + left.w, y: left.y + left.h / 2 };
    let points: [Point, Point, Point, Point];

    if (Math.abs(start.y - (right.y + right.h / 2)) < 12) {
      const end = { x: right.x, y: right.y + right.h / 2 };
      points = [start, { x: start.x + 40, y: start.y }, { x: end.x - 40, y: end.y }, end];
    } else if (firstActionStage.has(right.id) && right.x > laneX["governed-action"] + 60 && right.y > start.y) {
      // Enter from above so the curve never crosses the inputs beside it.
      const end = { x: right.x + right.w / 2, y: right.y };
      points = [start, { x: end.x, y: start.y }, { x: end.x, y: start.y }, end];
    } else {
      // Out of the source row, down the channel between the lanes, then
      // into the target row, so bridges never cut across either story.
      const end = { x: right.x, y: right.y + right.h / 2 };
      return a === left ? channelRoute(start, end) : channelRoute(end, start);
    }

    return a === left ? cubic(...points) : cubic(points[3], points[2], points[1], points[0]);
  }

  const aCenter = a.x + a.w / 2;
  const bCenter = b.x + b.w / 2;

  if (b.y >= a.y + a.h - 4) {
    const start = { x: aCenter, y: a.y + a.h };
    const end = { x: bCenter, y: b.y };
    const bend = Math.max(24, (end.y - start.y) / 2);
    return cubic(start, { x: start.x, y: start.y + bend }, { x: end.x, y: end.y - bend }, end);
  }

  if (a.y >= b.y + b.h - 4) {
    const start = { x: aCenter, y: a.y };
    const end = { x: bCenter, y: b.y + b.h };
    const bend = Math.max(24, (start.y - end.y) / 2);
    return cubic(start, { x: start.x, y: start.y - bend }, { x: end.x, y: end.y + bend }, end);
  }

  const leftToRight = aCenter < bCenter;
  const start = { x: leftToRight ? a.x + a.w : a.x, y: a.y + a.h / 2 };
  const end = { x: leftToRight ? b.x : b.x + b.w, y: b.y + b.h / 2 };
  const bend = Math.max(20, Math.abs(end.x - start.x) / 2) * (leftToRight ? 1 : -1);
  return cubic(start, { x: start.x + bend, y: start.y }, { x: end.x - bend, y: end.y }, end);
}

export type Camera = { scale: number; x: number; y: number; height: number };

/** Below this the Full Model text gets too small; pan instead of shrinking further. */
const FULL_MODEL_MIN_SCALE = 0.78;

/**
 * Where the camera looks for each view. Single-story views frame one lane and
 * leave the other side of the stage for the explanation panel. The Full
 * Model frames both lanes; when a concept is open it makes room for the
 * panel on the right, and if both lanes no longer fit at a readable size it
 * pans to keep the selected concept in view instead.
 */
export function cameraFor(
  view: ViewId,
  layout: MapLayout,
  stageWidth: number,
  panelWidth: number,
  focus: NodeBox | null = null,
): Camera {
  if (view === "full-model") {
    const left = layout.frames.foundation.x;
    const right = layout.frames["governed-action"].x + layout.frames["governed-action"].w;
    const contentWidth = right - left;
    const available = focus ? stageWidth - panelWidth - 24 : stageWidth;
    const fit = available / contentWidth;
    const scale = Math.min(1, focus ? Math.max(fit, FULL_MODEL_MIN_SCALE) : fit);
    let x = (available - contentWidth * scale) / 2 - left * scale;
    if (focus && contentWidth * scale > available) {
      const centre = focus.x + focus.w / 2;
      x = clamp(available / 2 - centre * scale, available - right * scale, -left * scale);
    }
    return { scale, x, y: 0, height: layout.height * scale };
  }

  const frame = layout.frames[view];
  const available = stageWidth - panelWidth - 24;
  const scale = Math.min(1.08, available / frame.w);
  const offset = view === "foundation" ? 0 : panelWidth + 24;
  return {
    scale,
    x: offset + (available - frame.w * scale) / 2 - frame.x * scale,
    y: -frame.y * scale,
    height: (frame.h + 8) * scale,
  };
}

export const viewOrder = howItWorksViews.map((view) => view.id);

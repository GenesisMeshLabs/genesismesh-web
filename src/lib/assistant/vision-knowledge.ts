// Pure content-to-chunk adapter. Runtime imports and aliases stay in knowledge.ts,
// so the retrieval behavior can be tested directly with Node and the public JSON.
import type milestoneContent from "../../content/vision/milestone.json";
import type narrativeContent from "../../content/vision/narrative.json";
import type resourceContent from "../../content/vision/resources.json";
import type roadmapContent from "../../content/vision/roadmap.json";
import type statusContent from "../../content/vision/status.json";
import type introContent from "../../content/vision/intro.json";
import type { Chunk } from "./search";

type VisionKnowledgeData = {
  url: string;
  review: { date: string; displayDate: string; coreVersion: string; coreCommit: string; original: string };
  reviewNotes: readonly string[];
  sources: Record<string, { label: string; href: string }>;
  intro: typeof introContent;
  narrative: typeof narrativeContent;
  resources: typeof resourceContent;
  roadmap: typeof roadmapContent;
  milestone: typeof milestoneContent;
  status: typeof statusContent;
};

/** Keep status first: search returns at most 1,200 characters of each passage. */
export function buildVisionChunks(data: VisionKnowledgeData): Chunk[] {
  const { narrative, resources, roadmap, milestone, status, review } = data;
  const snapshot = `Reviewed ${review.date}, core ${review.coreVersion} (${review.coreCommit.slice(0, 7)}).`;
  const proposal = `Proposed direction, not a shipped end-to-end workflow. ${snapshot}`;
  const current = `Reviewed implementation snapshot, not a claim of complete cross-owner support. ${snapshot}`;
  const context = `Vision reference and context; proposed workflows remain proposals. ${snapshot}`;
  const development = (label: string) => label === "Connect, in development"
    ? `Status: ${label}; the cross-owner journey remains proposed. ${snapshot}`
    : `Status: ${label}. ${proposal}`;
  const chunks: Chunk[] = [];
  function add(id: string, title: string, anchor: string, prefix: string, parts: string[], keywords: string, sourceUrl?: string) {
    chunks.push({
      id: `vision:${id}`,
      title,
      url: sourceUrl ?? `${data.url}${anchor ? `#${anchor}` : ""}`,
      keywords,
      text: [prefix, ...parts].filter(Boolean).join(" "),
    });
  }

  add("overview", "Genesis Mesh vision and Connect roadmap", "", proposal,
    [narrative.hero.note, narrative.closing.eyebrow, narrative.closing.proposition, narrative.closing.date],
    "vision future roadmap at scale governed access people organizations Connect");
  add("intro", data.intro.title, "", proposal,
    [data.intro.eyebrow, data.intro.description], "vision Connect everyday app governed access files services agents desktops compute");
  add("scenario", "A freelancer, a company and a compute provider", "", proposal,
    [narrative.hero.caption, ...narrative.hero.trace], "vision freelancer provider attestation treaty compute agent");
  add("scenario:parties", "The people, organizations and relationships in the vision", "", proposal,
    [...narrative.hero.parties.map((p) => `${p.label}: ${p.name}. Members: ${p.members.join(", ")}.`),
      ...narrative.hero.relationships.map((r) => `${r.label}: ${r.description}.`)],
    "freelancer engineering company provider contractor Atlas phone laptop build agent treaty attestation");

  add("landscape", narrative.landscape.title, "landscape", context,
    [narrative.landscape.eyebrow, ...narrative.landscape.paragraphs],
    "landscape federation OIDC SAML OAuth PKI TLS OpenZiti identity onboarding licensing physical identity");
  narrative.landscape.cards.forEach((card, index) => {
    add(`landscape:property-${index + 1}`, card.title, "landscape", proposal,
      [card.description], "landscape recognition authorization delegation evidence properties");
  });
  add("blocks", narrative.blocks.title, "blocks", current,
    [narrative.blocks.eyebrow, ...narrative.blocks.paragraphs], "trust primitives core building blocks");
  narrative.blocks.cards.forEach((card, index) => {
    // Keep the primitive's short definition beside the longer reviewed limit.
    const limit = status.rows.find((row) => row.area === card.title || (card.title === "Grant" && row.area === "Grants"));
    add(`blocks:primitive-${index + 1}`, card.title, "blocks", current,
      [card.description, limit ? `Limits and remaining work: ${limit.remaining}` : ""], "trust primitive core building block definition");
  });

  // Split access from execution so an outcome or evidence caveat cannot be cut
  // off behind the earlier lifecycle fields by the search result length limit.
  for (const resource of resources) {
    const f = resource.fields;
    const prefix = development(resource.status);
    add(`resource:${resource.id}:access`, `${resource.label}: offer, request and authorization`, "lifecycle", prefix,
      [`Offered: ${f.offer}`, `Request: ${f.request}`, `Authorize: ${f.authorize}`],
      `${resource.label} resource adapter lifecycle offer request authorization`);
    add(`resource:${resource.id}:execution`, `${resource.label}: enforcement, outcome and evidence`, "lifecycle", prefix,
      [`Reserve or admit: ${f.admit}`, `Enforce: ${f.enforce}`, `Outcome: ${f.outcome}`, `Evidence: ${f.evidence}`],
      `${resource.label} resource adapter lifecycle enforce outcome evidence unknown`);
  }

  add("lifecycle:boundary", narrative.lifecycle.title, "lifecycle", proposal,
    [narrative.lifecycle.eyebrow, narrative.lifecycle.description, narrative.lifecycle.note], "lifecycle adapter authorization enforcement provider boundary");
  add("lifecycle:steps", "The seven resource lifecycle steps", "lifecycle", proposal,
    narrative.lifecycle.steps.map((s) => `${s.title} (${s.owner}): ${s.description}`),
    "lifecycle discover request authorize admit enforce report verify");
  add("lifecycle:outcomes", "Resource outcomes and uncertain execution", "lifecycle", proposal,
    [`Outcome states: ${narrative.lifecycle.outcomes.join(", ")}.`, narrative.lifecycle.unknown,
      `Every adapter binds: ${narrative.lifecycle.obligations.join(" ")}`],
    "outcome unknown uncertain execution disconnect retry dispatch request id idempotent cancellation lease");
  for (const [state, description] of Object.entries({ ...narrative.lifecycle.outcomeDescriptions, unknown: narrative.lifecycle.unknown })) {
    add(`lifecycle:outcome-${state}`, `Resource outcome: ${state}`, `outcome-${state}`, proposal,
      [description], `resource outcome state ${state} meaning execution request id`);
  }

  add("status", status.title, "today", current, [status.eyebrow, status.description],
    "current supported today capability review status");
  for (const row of status.rows) {
    add(`status:${row.area.toLowerCase().replaceAll(" ", "-")}`, `${row.area}: supported capabilities and remaining work`, "today", current,
      [`Supported in the reviewed implementation: ${row.supported}`, `Limits and remaining work: ${row.remaining}`],
      `${row.area} current today implemented supported limitations remaining not yet`);
  }
  add("status:interop", "SDK conformance, interoperability and independent federation", "today", current,
    [status.note], "sdk conformance vectors SPIFFE SVID verifiable credentials JWT federation production independent");
  data.reviewNotes.forEach((note, index) => {
    add(`status:review-${index + 1}`, "Capability review: implementation boundary", "today", current,
      [note], "review limitation current implementation boundary");
  });
  add("sources:review", "Vision review date, source revision and original artifact", "today", context,
    [`Review date: ${review.displayDate} (${review.date}).`, `Core ${review.coreVersion}: ${review.coreCommit}.`,
      `Original vision artifact: ${review.original}`], "vision sources references original artifact review date version commit revision");
  for (const [id, source] of Object.entries(data.sources)) {
    add(`source:${id}`, source.label, "", context, [`${source.label}: ${source.href}`],
      `vision reference source link documentation ${id}`, source.href);
  }

  add("agents:identity", narrative.agents.title, "agents", proposal,
    [narrative.agents.eyebrow, narrative.agents.paragraphs[0], ...narrative.agents.needs], "agent identity owner keys delegation approval cross organization");
  add("agents:roles", "Agent as a resource, agent as a caller", "agents", proposal,
    narrative.agents.paragraphs.slice(1), "agent caller resource operator model prompt hardware attestation");
  add("agents:instruction", narrative.agents.instruction.title, "agents", proposal,
    [narrative.agents.instruction.quote,
      ...narrative.agents.instruction.parts.map((p) => `${p.quote}: ${p.description}`),
      narrative.agents.instruction.note], "agent instruction document compute output permission approval egress");

  add("compute:intro", narrative.compute.title, "compute", proposal,
    [narrative.compute.eyebrow, narrative.compute.paragraphs[0]], "peer to peer compute GPU marketplace trust buyer host");
  add("compute:use", "Bounded compute jobs inside existing relationships", "compute", proposal,
    [narrative.compute.paragraphs[1], ...narrative.compute.examples],
    "compute job sandbox scheduler Ray rendering transcription builds family university");
  add("compute:metering", "Compute metering and commercial settlement", "compute", proposal,
    [narrative.compute.paragraphs[2]], "compute metering billing token blockchain measurement settlement dispute");
  add("compute:boundaries", "Compute confidentiality, isolation and evidence limits", "compute", proposal,
    [narrative.compute.boundaryTitle, ...narrative.compute.boundaries], "compute confidentiality plaintext encryption hardware sandbox GPU confidential result correct deletion");
  add("scale", narrative.scale.title, "scale", proposal,
    [narrative.scale.eyebrow, ...narrative.scale.paragraphs, narrative.scale.caveat, narrative.scale.requirementsTitle, ...narrative.scale.requirements],
    "scale millions throughput availability recognition path depth revocation offline privacy managed operator");
  narrative.scale.cards.forEach((card, index) => {
    add(`scale:operator-${index + 1}`, card.title, "scale", proposal,
      [card.description], "scale independent authority operator personal managed enterprise community");
  });
  add("scale:precedent", narrative.scale.precedent.title, "scale", context,
    [narrative.scale.precedent.label, narrative.scale.precedent.description],
    "science CERN WLCG Worldwide LHC Computing Grid virtual organization researchers precedent");
  add("effects", narrative.effects.title, "effects", proposal,
    [`The ${narrative.effects.cards.length} network effects are: ${narrative.effects.cards.map((card) => card.title).join(", ")}.`,
      ...narrative.effects.cards.map((card, index) => `${index + 1}. ${card.title}: ${card.description}`),
      `Section context: ${narrative.effects.eyebrow}.`, ...narrative.effects.paragraphs],
    "growth network effects relationships adapters credentials directories marketplace discovery");

  add("milestone:goal", milestone.title, "milestone", proposal,
    [milestone.eyebrow, milestone.description, milestone.exit], "milestone independent owners two networks document cross owner federation proof");
  milestone.steps.forEach((step, index) => {
    add(`milestone:step-${index + 1}`, `Cross-owner milestone: ${step.title}`, "milestone", proposal,
      [step.description], `milestone journey ${step.title} owner document Connect agent`);
  });
  add("milestone:refusals", "Cross-owner milestone: refusal and failure cases", "milestone", proposal,
    milestone.refusals, "milestone refusal replay expiry emergency busy unavailable fallback uncertain request");
  add("milestone:needs", "Cross-owner milestone: prerequisites", "milestone", proposal,
    milestone.needs, "milestone prerequisites needs agent phone approval discovery treaty receipt");
  add("roadmap", roadmap.title, "path", proposal,
    [roadmap.eyebrow, roadmap.description], "Connect roadmap stages expansion prerequisites compute desktops");
  roadmap.stages.forEach((stage, index) => {
    add(`roadmap:${index + 1}`, `Connect roadmap: ${stage.title}`, "path", development(stage.status),
      [stage.description, stage.needs ? `Prerequisites: ${stage.needs}` : ""],
      `Connect roadmap stage ${stage.title} ${stage.status} prerequisites`);
  });
  return chunks;
}

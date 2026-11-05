import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { visionReview, reviewNotes, visionSources } from "../src/content/vision/sources.ts";
import { buildVisionChunks } from "../src/lib/assistant/vision-knowledge.ts";
import { buildIndex, search } from "../src/lib/assistant/search.ts";

const read = (name) => JSON.parse(readFileSync(new URL(`../src/content/vision/${name}.json`, import.meta.url), "utf8"));
const data = {
  url: "https://www.genesismesh.org/vision",
  review: visionReview,
  reviewNotes,
  sources: visionSources,
  intro: read("intro"),
  narrative: read("narrative"),
  resources: read("resources"),
  status: read("status"),
  milestone: read("milestone"),
  roadmap: read("roadmap"),
};
const chunks = buildVisionChunks(data);
const index = buildIndex(chunks);
const find = (query, id) => {
  const hits = search(index, query);
  const hit = hits.find((item) => item.id === id);
  assert.ok(hit, `Expected ${id} in results for "${query}": ${hits.map((item) => item.id).join(", ")}`);
  return hit;
};

describe("vision knowledge retrieval", () => {
  test("resource answers retain proposal status and agent uncertain-outcome instructions", () => {
    const agent = find("AI agent order unknown connection outcome", "vision:resource:agent:execution");
    assert.match(agent.text, /^Status: Proposed resource adapter\. Proposed direction, not a shipped/);
    assert.ok(agent.text.includes(data.resources.find((r) => r.id === "agent").fields.outcome));
    const desktop = find("remote desktop clipboard lease renewal", "vision:resource:desktop:execution");
    assert.match(desktop.text, /Proposed direction, not a shipped/);
    assert.match(desktop.text, /Renewal of the lease rechecks/);
  });

  test("current support includes its paired limits, review date and version", () => {
    const approval = find("Human approval supported current", "vision:status:human-approval");
    const row = data.status.rows.find((r) => r.area === "Human approval");
    assert.ok(approval.text.includes(row.supported));
    assert.ok(approval.text.includes(row.remaining));
    assert.ok(approval.text.includes(visionReview.date));
    assert.ok(approval.text.includes(`core ${visionReview.coreVersion}`));
    const grants = find("Grants offline revocations limits", "vision:status:grants");
    assert.match(grants.text, /Limits and remaining work:/);
    assert.match(grants.text, /next feed read/);
  });

  test("Connect files remain in development and do not imply cross-owner support", () => {
    const files = find("Files Space family phone", "vision:resource:files:access");
    assert.match(files.text, /^Status: Connect, in development; the cross-owner journey remains proposed/);
    assert.match(files.text, /within one network today, in development/);
  });

  test("milestones and phone approval steps cannot be retrieved as shipped workflows", () => {
    const milestone = find("milestone two independent owners networks", "vision:milestone:goal");
    assert.match(milestone.text, /^Proposed direction, not a shipped/);
    assert.ok(milestone.text.includes(data.milestone.description));
    const approve = find("cross-owner milestone Approve phone document version", "vision:milestone:step-4");
    assert.match(approve.text, /^Proposed direction, not a shipped/);
    assert.match(approve.text, /can be used once/);
    const roadmap = find("Connect roadmap bounded compute job", "vision:roadmap:4");
    assert.match(roadmap.text, /Proposed direction, not a shipped/);
    assert.match(roadmap.text, /Prerequisites:/);
  });

  test("compute confidentiality and outcome evidence limits survive retrieval", () => {
    const hit = find("compute confidentiality plaintext hardware result correct", "vision:compute:boundaries");
    for (const boundary of data.narrative.compute.boundaries) assert.ok(hit.text.includes(boundary));
    assert.match(hit.text, /^Proposed direction, not a shipped/);
  });

  test("scale results retain the unproven-throughput and open path-limit caveats", () => {
    const hit = find("millions scale throughput recognition path", "vision:scale");
    assert.ok(hit.text.includes(data.narrative.scale.caveat));
    assert.match(hit.text, /does not prove that Genesis Mesh scales/);
  });

  test("comparison, precedent, network effects and source links can be found", () => {
    const landscape = find("OIDC SAML OAuth OpenZiti landscape", "vision:landscape");
    assert.ok(landscape.text.includes(data.narrative.landscape.paragraphs[0]));
    const precedent = find("Worldwide LHC Computing Grid virtual organizations", "vision:scale:precedent");
    assert.ok(precedent.text.includes(data.narrative.scale.precedent.description));
    const effects = find("three network effects relationships adapters credentials", "vision:effects");
    assert.match(effects.text, /^Proposed direction/);
    const source = find("CERN WLCG source reference", "vision:source:wlcg");
    assert.equal(source.url, visionSources.wlcg.href);
  });

  test("the entire shared page content and its sources survive the retrieval budget", () => {
    // Assert against every authored string, not a hand-maintained list of selected
    // topics. Newly added prose is therefore detected until it is indexed too.
    function* authoredStrings(value, path = "content") {
      if (typeof value === "string") {
        if (value) yield [path, value];
      } else if (Array.isArray(value)) {
        for (const [i, child] of value.entries()) yield* authoredStrings(child, `${path}[${i}]`);
      } else if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) {
          // IDs and the base route are machine identifiers, not authored copy.
          if (key !== "id" && key !== "url") yield* authoredStrings(child, `${path}.${key}`);
        }
      }
    }
    const returnedPassages = chunks.map((chunk) => [chunk.title, chunk.url, chunk.text.slice(0, 1200)].join("\n"));
    const missing = [...authoredStrings(data)].filter(([, text]) => !returnedPassages.some((passage) => passage.includes(text)));
    assert.deepEqual(missing.map(([path]) => path), [], "Authored content must be available in full, without truncation");
  });

  test("every passage fits the search result budget so its limits are not truncated", () => {
    for (const chunk of chunks) {
      assert.ok(chunk.text.length <= 1200, `${chunk.id} exceeds the search budget: ${chunk.text.length}`);
      assert.ok(chunk.text.includes(visionReview.date), `${chunk.id} lacks review provenance`);
    }
  });
});

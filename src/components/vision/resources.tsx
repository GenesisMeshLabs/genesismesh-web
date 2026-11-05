import narrative from "@/content/vision/narrative.json";
import resources from "@/content/vision/resources.json";
import { visionSources as sources } from "@/content/vision/sources";
import { Copy, SourceLinks, TextList, VisionSection } from "./section";
import { VisionExplorer } from "./explorer";

const fields = [
  ["offer", "Offered"], ["request", "Request"], ["authorize", "Authorize"],
  ["admit", "Reserve or admit"], ["enforce", "Enforce"], ["outcome", "Outcome"], ["evidence", "Evidence"],
] as const;

export function VisionResources() {
  const life = narrative.lifecycle;
  const outcomeDescriptions: Record<string, string> = { ...life.outcomeDescriptions, unknown: life.unknown };
  return <VisionSection {...life}>
    <Copy>{life.description}</Copy>
    <p className="vision-badge">Proposed common lifecycle · adapters enforce the resource boundary</p>
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {life.steps.map((step, i) => <li className="soft-card p-5" key={step.title}>
        <div className="flex items-center gap-3"><span className="font-mono text-accent-ink" aria-hidden="true">0{i + 1}</span><h3 className="font-semibold text-ink">{step.title}</h3></div>
        <p className="mt-3 text-sm leading-6 text-ink-300">{step.description}</p>
        <p className="mt-4 text-xs font-medium text-ink-400">{step.owner}</p>
      </li>)}
    </ol>
    <VisionExplorer id="resource" label="The same steps, by resource" items={resources.map((resource) => ({
      id: resource.id, label: resource.label, status: resource.status,
      content: <dl key={resource.id} className="divide-y divide-ink/10">
        {fields.map(([key, label]) => <div key={key} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm font-semibold text-accent-ink">{label}</dt>
          <dd className="text-sm leading-7 text-ink-300">{resource.fields[key]}</dd>
        </div>)}
      </dl>,
    }))} />
    <div className="grid gap-8 lg:grid-cols-2">
      <VisionExplorer id="outcome" label="Explore outcome states" items={life.outcomes.map((state) => ({
        id: state, label: state, content: <Copy key={state}>{outcomeDescriptions[state]}</Copy>,
      }))} />
      <div>
        <h3 className="mb-5 text-lg font-semibold text-ink">Every adapter binds</h3>
        <TextList items={life.obligations} />
      </div>
    </div>
    <Copy muted>{life.note}</Copy>
    <SourceLinks sources={[sources.connect, sources.services, sources.receipts, sources.replay]} />
  </VisionSection>;
}

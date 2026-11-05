import narrative from "@/content/vision/narrative.json";
import { visionSources as sources } from "@/content/vision/sources";
import { Cards, Copy, SourceLinks, TextList, VisionSection } from "./section";

export function VisionFoundations() {
  const { landscape, blocks } = narrative;
  return <>
    <VisionSection {...landscape}>
      {landscape.paragraphs.slice(0, 2).map((p) => <Copy key={p}>{p}</Copy>)}
      <Cards items={landscape.cards} />
      <div className="border-l-2 border-accent-ink pl-6">
        <p className="mb-3 text-xl font-medium text-ink">{landscape.paragraphs[2]}</p>
        <Copy muted>{landscape.paragraphs[3]}</Copy>
      </div>
      <SourceLinks sources={[sources.treaties, sources.gateway, sources.openziti]} />
    </VisionSection>
    <VisionSection {...blocks}>
      {blocks.paragraphs.map((p) => <Copy key={p}>{p}</Copy>)}
      <Cards items={blocks.cards} />
      <SourceLinks sources={[sources.core, sources.treaties, sources.delegation, sources.grants, sources.oversight]} />
    </VisionSection>
  </>;
}

export function VisionAgents() {
  const { agents } = narrative;
  return <VisionSection {...agents}>
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div className="space-y-6">
        <Copy>{agents.paragraphs[0]}</Copy>
        <TextList items={agents.needs} />
        <Copy>{agents.paragraphs[1]}</Copy>
        <Copy muted>{agents.paragraphs[2]}</Copy>
      </div>
      <aside className="soft-card border-accent-ink/25 p-6 sm:p-8">
        <p className="section-eyebrow">{agents.instruction.title}</p>
        <blockquote className="mt-5 text-xl leading-8 text-ink">{agents.instruction.quote}</blockquote>
        <dl className="mt-6 divide-y divide-ink/10">
          {agents.instruction.parts.map((part) => <div key={part.quote} className="py-4">
            <dt className="font-medium text-accent-ink">{part.quote}</dt>
            <dd className="mt-2 text-sm leading-7 text-ink-300">{part.description}</dd>
          </div>)}
        </dl>
        <Copy muted>{agents.instruction.note}</Copy>
        <p className="mt-5 text-xs leading-6 text-ink-400">Proposed integrated workflow. Single-use approval consumption and a Connect approval screen remain to be built.</p>
      </aside>
    </div>
    <SourceLinks sources={[sources.oversight, sources.mcp, sources.replay]} />
  </VisionSection>;
}

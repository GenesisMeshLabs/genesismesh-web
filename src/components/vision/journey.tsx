import milestone from "@/content/vision/milestone.json";
import roadmap from "@/content/vision/roadmap.json";
import { visionSources as sources } from "@/content/vision/sources";
import { Copy, SourceLinks, TextList, VisionSection } from "./section";
import { VisionExplorer } from "./explorer";

export function VisionJourney() {
  return <>
    <VisionSection {...milestone}>
      <Copy>{milestone.description}</Copy>
      <VisionExplorer id="journey" label="Walk through the proposed milestone" sequential items={milestone.steps.map((step, i) => ({
        id: step.title.toLowerCase(), label: step.title, status: "Proposal · two independent owners",
        content: <div key={step.title} className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
          <span className="text-5xl font-semibold tracking-tight text-accent-ink/60" aria-hidden="true">0{i + 1}</span>
          <p className="max-w-3xl text-lg leading-8 text-ink-300">{step.description}</p>
        </div>,
      }))} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="soft-card p-6 sm:p-8"><h3 className="mb-5 text-xl font-semibold text-ink">Must be refused or handled</h3><TextList items={milestone.refusals} /></div>
        <div className="soft-card p-6 sm:p-8"><h3 className="mb-5 text-xl font-semibold text-ink">Needs first</h3><TextList items={milestone.needs} /></div>
      </div>
      <p className="border-l-2 border-accent-ink pl-6 text-base leading-8 text-ink-300">{milestone.exit}</p>
      <SourceLinks sources={[sources.connect, sources.oversight, sources.treaties, sources.replay]} />
    </VisionSection>
    <VisionSection {...roadmap}>
      <Copy>{roadmap.description}</Copy>
      <ol className="space-y-3">
        {roadmap.stages.map((stage, i) => <li key={stage.title}>
          <details className="vision-details surface-card" open={i === 0}>
            <summary>
              <span className="font-mono text-accent-ink" aria-hidden="true">0{i + 1}</span>
              <span className="min-w-0 flex-1"><span className="block font-semibold text-ink">{stage.title}</span><span className="mt-1 block text-xs font-normal text-ink-400">{stage.status}</span></span>
            </summary>
            <div className="space-y-5 px-6 pb-6 sm:pl-16">
              <Copy>{stage.description}</Copy>
              {stage.needs ? <p className="text-sm leading-7 text-ink-400"><strong className="font-semibold text-accent-ink">Needs: </strong>{stage.needs}</p> : null}
            </div>
          </details>
        </li>)}
      </ol>
    </VisionSection>
  </>;
}

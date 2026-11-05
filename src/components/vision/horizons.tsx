import narrative from "@/content/vision/narrative.json";
import { visionSources as sources } from "@/content/vision/sources";
import { Cards, Copy, SourceLinks, TextList, VisionSection } from "./section";

export function VisionHorizons() {
  const { scale, effects, compute } = narrative;
  return <>
    <VisionSection {...scale}>
      {scale.paragraphs.map((p) => <Copy key={p}>{p}</Copy>)}
      <Cards items={scale.cards} />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-ink">{scale.requirementsTitle}</h3>
          <TextList items={scale.requirements} />
          <Copy muted>{scale.caveat}</Copy>
        </div>
        <aside className="soft-card self-start p-6 sm:p-8">
          <p className="section-eyebrow">{scale.precedent.label}</p>
          <h3 className="mb-5 mt-4 text-2xl font-semibold text-ink">{scale.precedent.title}</h3>
          <Copy>{scale.precedent.description}</Copy>
          <div className="mt-6"><SourceLinks sources={[sources.wlcg]} /></div>
        </aside>
      </div>
    </VisionSection>
    <VisionSection {...effects}>
      <div className="grid gap-8 md:grid-cols-3">
        {effects.cards.map((card, i) => <article key={card.title} className="border-t border-accent-ink/40 pt-6">
          <span className="font-mono text-sm text-accent-ink" aria-hidden="true">0{i + 1}</span>
          <h3 className="my-4 text-xl font-semibold text-ink">{card.title}</h3>
          <Copy>{card.description}</Copy>
        </article>)}
      </div>
      {effects.paragraphs.map((p) => <Copy muted key={p}>{p}</Copy>)}
    </VisionSection>
    <VisionSection {...compute}>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <Copy>{compute.paragraphs[0]}</Copy>
          <TextList items={compute.examples} />
          {compute.paragraphs.slice(1).map((p) => <Copy key={p}>{p}</Copy>)}
          <p className="vision-badge">Proposed compute integration</p>
        </div>
        <aside className="soft-card p-6 sm:p-8">
          <h3 className="mb-5 text-lg font-semibold text-ink">{compute.boundaryTitle}</h3>
          <TextList items={compute.boundaries} />
        </aside>
      </div>
      <SourceLinks sources={[sources.ray, sources.services]} />
    </VisionSection>
  </>;
}

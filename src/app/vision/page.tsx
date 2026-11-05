import { PageShell } from "@/components/site-shell";
import { VisionHero } from "@/components/vision/hero";
import { VisionFoundations, VisionAgents } from "@/components/vision/foundations";
import { VisionResources } from "@/components/vision/resources";
import { VisionHorizons } from "@/components/vision/horizons";
import { VisionStatus } from "@/components/vision/status";
import { VisionJourney } from "@/components/vision/journey";
import { SourceLinks } from "@/components/vision/section";
import { pageMetadata } from "@/content/metadata";
import { visionIntro } from "@/content/pages";
import narrative from "@/content/vision/narrative.json";
import { visionReview, visionSources } from "@/content/vision/sources";

export const metadata = pageMetadata({
  title: "Genesis Mesh Vision | Governed access across independent owners",
  description: "Explore the Genesis Mesh and Connect vision: governed access to files, agents, compute and desktops, with current capabilities separated from proposed milestones.",
  path: "/vision",
  imageAlt: "Genesis Mesh: portable trust for sovereign systems",
});

const sections = [
  ["landscape", "The idea"], ["blocks", "Primitives"], ["lifecycle", "Resources"],
  ["agents", "Agents"], ["scale", "Scale"], ["effects", "Network effects"],
  ["compute", "Compute"], ["today", "Current status"], ["milestone", "First milestone"], ["path", "Roadmap"],
];

export default function VisionPage() {
  return <PageShell>
    <a href="#vision-content" className="vision-skip">Skip to vision content</a>
    <article className="vision-page" aria-label={visionIntro.title}>
      <VisionHero />
      <nav aria-label="On this page" className="vision-section-nav border-y border-ink/10 bg-surface">
        <div className="site-container flex flex-wrap gap-x-5 gap-y-3 py-5">
          {sections.map(([id, title]) => <a key={id} href={`#${id}`} className="text-sm text-ink-300 hover:text-accent-ink">{title}</a>)}
        </div>
      </nav>
      <div id="vision-content">
        <VisionFoundations />
        <VisionResources />
        <VisionAgents />
        <VisionHorizons />
        <VisionStatus />
        <VisionJourney />
      </div>
      <footer className="border-t border-accent-ink/20 bg-accent/[0.04]">
        <div className="page-section">
          <p className="section-eyebrow">{narrative.closing.eyebrow}</p>
          <blockquote className="my-8 max-w-5xl text-2xl font-medium leading-relaxed tracking-tight text-ink sm:text-4xl">{narrative.closing.proposition}</blockquote>
          <SourceLinks sources={[visionSources.core, visionSources.connect, { label: "Original vision artifact", href: visionReview.original }, { label: "Documentation", href: "https://docs.genesismesh.org/" }]} />
          <p className="mt-8 text-sm text-ink-400">Genesis Mesh Labs · {narrative.closing.date}</p>
        </div>
      </footer>
    </article>
  </PageShell>;
}

import Image from "next/image";
import { ArrowDown, Building2, UserRound, Server } from "lucide-react";
import { visionIntro } from "@/content/pages";
import narrative from "@/content/vision/narrative.json";
import { visionReview } from "@/content/vision/sources";
import { ButtonLink } from "@/components/ui";

const icons = [UserRound, Building2, Server];

export function VisionHero() {
  const hero = narrative.hero;
  return <header className="relative isolate overflow-hidden">
    <Image src="/images/brand/background.png" alt="" fill priority sizes="100vw" className="object-cover opacity-20" />
    <div className="absolute inset-0 hero-scrim-page" />
    <div className="site-container relative py-14 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div>
          <p className="section-eyebrow">{visionIntro.eyebrow}</p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl xl:text-6xl">{visionIntro.title}</h1>
          <p className="body-lead">{visionIntro.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#lifecycle">Explore the resources</ButtonLink>
            <ButtonLink href="#today" variant="secondary">What exists today</ButtonLink>
          </div>
          <p className="mt-7 border-l-2 border-accent-ink pl-4 text-sm leading-6 text-ink-300">{hero.note}</p>
          <p className="mt-5 text-xs text-ink-400">Reviewed {visionReview.displayDate} · Core {visionReview.coreVersion}</p>
        </div>
        <figure className="surface-card p-5 sm:p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-ink">One job. Three independent authorities.</p>
          {hero.parties.map((party, index) => {
            const Icon = icons[index];
            return <div key={party.label}>
              <div className="soft-card flex items-start gap-4 p-4">
                <div className="icon-tile shrink-0"><Icon size={22} aria-hidden="true" /></div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-400">{party.label}</p>
                  <h2 className="mt-1 font-semibold text-ink">{party.name}</h2>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-400">{party.members.map((m) => <li key={m}>{m}</li>)}</ul>
                </div>
              </div>
              {hero.relationships[index] ? <div className="flex gap-3 py-4 pl-6 text-sm">
                <ArrowDown size={18} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                <p><span className="font-semibold text-accent-ink">{hero.relationships[index].label}</span><br /><span className="text-ink-300">{hero.relationships[index].description}</span></p>
              </div> : null}
            </div>;
          })}
          <figcaption className="mt-5 text-xs leading-6 text-ink-400">{hero.caption}</figcaption>
        </figure>
      </div>
      <ol className="mt-12 grid gap-6 border-t border-ink/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
        {hero.trace.map((step, i) => <li key={step} className="flex gap-3 text-sm leading-6 text-ink-300">
          <span className="font-mono text-accent-ink" aria-hidden="true">0{i + 1}</span>{step}
        </li>)}
      </ol>
    </div>
  </header>;
}

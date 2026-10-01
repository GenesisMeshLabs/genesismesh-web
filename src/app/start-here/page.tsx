import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { SectionIntro } from "@/components/ui";
import { pageMetadata } from "@/content/metadata";
import { howItWorksCta, pageIntros, startHerePoints, startHereWorkflow } from "@/content/pages";

export const metadata: Metadata = pageMetadata({
  title: "Start Here: Genesis Mesh",
  description:
    "A short introduction to Genesis Mesh, portable trust, sovereign systems, recognition, revocation, and verifiable trust state.",
  path: "/start-here",
  imageAlt: "Start here with Genesis Mesh",
  twitterDescription: "A short introduction to Genesis Mesh and portable trust for sovereign systems.",
});

export default function StartHerePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionIntro {...pageIntros.startHere} className="max-w-4xl" />

        <div className="mt-10 grid gap-4">
          {startHerePoints.map((point) => (
            <div key={point} className="surface-card flex min-w-0 gap-4 p-5">
              <CheckCircle2 className="mt-1 shrink-0 text-accent-ink" size={22} aria-hidden="true" />
              <p className="min-w-0 text-base leading-7 text-ink-200">{point}</p>
            </div>
          ))}
        </div>

        <section className="mt-14 border-t border-ink/10 pt-12">
          <SectionIntro
            eyebrow={startHereWorkflow.eyebrow}
            title={startHereWorkflow.title}
            description={startHereWorkflow.description}
            className="max-w-4xl"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {startHereWorkflow.steps.map((step, index) => (
              <article key={step.title} className="soft-card p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
                  Step {index + 1}
                </p>
                <h2 className="mt-5 text-xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-400">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-ink/10 bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
              Evidence shape
            </p>
            <pre className="mt-4 overflow-x-auto font-mono text-sm leading-7 text-ink-300">
              <code>{startHereWorkflow.evidenceExample.join("\n")}</code>
            </pre>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/overview"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-on-accent transition hover:bg-tile"
          >
            Explore Genesis Mesh
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={howItWorksCta.href} className="btn-accent">
            See how it works
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-ink/15 bg-ink/10 px-6 text-sm font-bold text-ink transition hover:border-accent-ink/70"
          >
            Read docs
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

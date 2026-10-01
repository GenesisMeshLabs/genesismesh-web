import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Code2, GitBranch } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { SectionIntro } from "@/components/ui";
import { siteLinks } from "@/content/genesismesh";
import { pageMetadata } from "@/content/metadata";
import { pageIntros } from "@/content/pages";

export const metadata: Metadata = pageMetadata({
  title: "Genesis Mesh Docs",
  description:
    "Documentation entry points for Genesis Mesh protocol concepts, source code, SDKs, and implementation notes.",
  path: "/genesismesh/docs",
  imageAlt: "Genesis Mesh documentation",
  twitterDescription: "Documentation entry points for Genesis Mesh protocol concepts and SDKs.",
});

const docsCards = [
  {
    title: "Documentation",
    href: siteLinks.docs,
    description: "Read the protocol, SDK, and operator guides on the documentation site.",
    icon: BookOpen,
  },
  {
    title: "Core source",
    href: siteLinks.githubCore,
    description: "Inspect the Network Authority implementation, APIs, tests, and examples.",
    icon: GitBranch,
  },
  {
    title: "SDK repositories",
    href: "/genesismesh/sdks",
    description: "Use the Go, TypeScript, and .NET SDKs as builder entry points.",
    icon: Code2,
  },
];

const readingPath = [
  "Start with the documentation to understand recognition, revocation, and evidence.",
  "Inspect the core source when you need the Network Authority API surface.",
  "Move to the SDK repositories when you are wiring real integration code.",
];

export default function DocsPage() {
  return (
    <PageShell>
      <section className="page-section">
        <SectionIntro {...pageIntros.docs} />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {docsCards.map((card) => {
            const external = card.href.startsWith("http");

            return (
              <a
                key={card.href}
                href={card.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group relative overflow-hidden rounded-md border border-ink/10 bg-surface p-6 transition hover:border-accent-ink/70"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-accent/80" />
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-ink/15 bg-ink/10 text-ink transition group-hover:bg-tile group-hover:text-on-accent">
                    <card.icon size={24} aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="text-accent-ink transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-ink">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-400">{card.description}</p>
              </a>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_.78fr]">
          <div className="soft-card p-6">
            <p className="section-eyebrow">Recommended path</p>
            <h2 className="mt-4 text-2xl font-semibold text-ink">
              Read just enough to build with the protocol.
            </h2>
            <div className="mt-6 grid gap-4">
              {readingPath.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-accent-ink"
                    size={18}
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-ink-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/genesismesh/start-here"
            className="group flex min-w-0 flex-col justify-between rounded-md border border-accent-ink/25 bg-accent/10 p-6 transition hover:border-accent-ink/70 hover:bg-accent/15"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-on-accent">
                <BookOpen size={24} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-ink">
                New to Genesis Mesh?
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-300">
                Start with the short explainer before moving into implementation details.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink">
              Start here
              <ArrowRight
                className="transition group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

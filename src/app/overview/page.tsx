import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { PageShell } from "@/components/site-shell";
import { ButtonLink, SectionIntro } from "@/components/ui";
import { developerProof, pillars, seo, siteLinks } from "@/content/genesismesh";
import { pageMetadata } from "@/content/metadata";
import { genesisMeshIntro, genesisMeshRouteCards } from "@/content/pages";

export const metadata: Metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path: "/overview",
  imageAlt: "Genesis Mesh portable trust for sovereign systems",
});

export default function GenesisMeshPage() {
  const TrustIcon = developerProof[0].icon;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "SoftwareSourceCode"],
    name: "Genesis Mesh",
    description: seo.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    codeRepository: siteLinks.githubCore,
    url: siteLinks.genesisMesh,
    sameAs: [siteLinks.githubCore, siteLinks.youtube, siteLinks.patreon],
    downloadUrl: [siteLinks.sdkGo, siteLinks.sdkTypeScript, siteLinks.sdkDotnet, siteLinks.sdkRust],
    programmingLanguage: ["Python", "Go", "TypeScript", "C#", "Rust"],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative isolate overflow-hidden border-b border-ink/10">
        <Image
          src="/images/brand/background.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-scrim-page" />
        <div className="site-container relative grid items-center gap-10 py-16 lg:min-h-[560px] lg:grid-cols-[1fr_.95fr]">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-md border border-accent-ink/25 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent-ink">
              {genesisMeshIntro.eyebrow}
            </p>
            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
              {genesisMeshIntro.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-300">
              {genesisMeshIntro.description}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-300">
              Genesis Mesh is defined as the Treaty Layer for Machines.{" "}
              <a
                href={siteLinks.thesis}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent-ink hover:underline"
              >
                Read the thesis →
              </a>
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/docs">
                Read docs
              </ButtonLink>
              <ButtonLink
                href={siteLinks.githubCore}
                external
                variant="secondary"
                icon={<BrandIcon name="github" className="h-5 w-5" />}
              >
                View source
              </ButtonLink>
            </div>
          </div>
          <div className="relative rounded-md border border-ink/10 bg-surface/90 p-6 shadow-2xl shadow-black/40">
            <div className="absolute -inset-8 -z-10 rounded-full border border-accent-ink/10" />
            <div className="grid gap-4">
              <div className="rounded-md border border-ink/10 bg-ink/[0.04] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
                      Trust lifecycle
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink">
                      Recognize, verify, revoke.
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent">
                    <TrustIcon size={24} aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {["Identity", "Evidence", "Revocation"].map((label, index) => (
                    <div key={label} className="rounded-md border border-ink/10 bg-canvas p-3">
                      <div className="mb-3 h-1.5 rounded-full bg-accent" style={{ width: `${55 + index * 18}%` }} />
                      <p className="text-xs font-semibold text-ink">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-ink/10 bg-canvas p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                  {[
                    ["Operator", "keeps local authority"],
                    ["Signed treaty", "carries recognition"],
                    ["Verifier", "checks trust offline"],
                  ].map(([title, text], index) => (
                    <div key={title} className="contents">
                      <div className="rounded-md bg-ink/[0.04] p-4">
                        <p className="text-sm font-semibold text-ink">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-500">{text}</p>
                        <div className="mt-4 h-1.5 w-16 rounded-full bg-accent" />
                      </div>
                      {index < 2 ? (
                        <ArrowRight
                          className="hidden text-accent-ink sm:block"
                          size={18}
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="Core thesis" title="Trust should move without authority transfer." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="soft-card p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-on-accent">
                <pillar.icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-400">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ink/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {genesisMeshRouteCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group link-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-tile text-on-accent transition group-hover:bg-accent">
                    <card.icon size={24} aria-hidden="true" />
                  </div>
                  <ArrowRight className="text-accent-ink transition group-hover:translate-x-0.5" size={18} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-400">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

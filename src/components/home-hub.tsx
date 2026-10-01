import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, Code2, FileText, Network, Play, ShieldCheck } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { ButtonLink, SectionIntro } from "@/components/ui";
import { homeHubContent, howItWorksCta } from "@/content/pages";

const featureStrip = [
  { title: "Portable Trust", text: "Trust that travels across boundaries.", icon: ShieldCheck },
  { title: "Sovereign Systems", text: "No central authority over operators.", icon: Network },
  { title: "Verifiable Evidence", text: "Every decision leaves a trail.", icon: Boxes },
  { title: "Developer First", text: "Open protocol, source, and SDKs.", icon: Code2 },
];

const hubCards = [
  {
    title: "Genesis Mesh",
    href: "/genesismesh",
    text: "Portable trust infrastructure for sovereign systems, operators, services, and agents.",
    icon: Network,
  },
  {
    title: "Start here",
    href: "/genesismesh/start-here",
    text: "A short explainer for people new to the Genesis Mesh thesis.",
    icon: ShieldCheck,
  },
  {
    title: howItWorksCta.title,
    href: howItWorksCta.href,
    text: howItWorksCta.description,
    icon: howItWorksCta.icon,
  },
  {
    title: "SDKs",
    href: "/genesismesh/sdks",
    text: "Go, TypeScript, and .NET client paths for real integration work.",
    icon: Code2,
  },
  {
    title: "Videos",
    href: "/genesismesh/videos",
    text: "All public campaign videos from the GenesisMesh Labs YouTube channel.",
    icon: Play,
  },
  {
    title: "Articles",
    href: "/genesismesh/articles",
    text: "Long-form campaign articles and founder notes.",
    icon: FileText,
  },
];

export function HomeHub() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink/10">
        <Image
          src="/images/brand/background.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-scrim-home" />
        <div className="site-container relative grid items-center gap-12 py-16 sm:py-20 lg:min-h-[720px] lg:grid-cols-[1fr_.92fr] lg:items-start lg:pt-28">
          <div className="max-w-3xl">
            <p className="inline-flex max-w-full rounded-md border border-accent-ink/45 bg-accent/18 px-3 py-2 text-sm font-bold text-accent-ink shadow-lg shadow-black/20">
              {homeHubContent.hero.eyebrow}
            </p>
            <h1 className="mt-7 max-w-full hyphens-none text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              {homeHubContent.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-300">
              {homeHubContent.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={homeHubContent.hero.primaryCta.href}>
                {homeHubContent.hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={homeHubContent.hero.secondaryCta.href}
                external
                variant="secondary"
                icon={<BrandIcon name="github" className="h-5 w-5" />}
              >
                {homeHubContent.hero.secondaryCta.label}
              </ButtonLink>
            </div>
            <Link
              href={homeHubContent.hero.exploreCta.href}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition hover:gap-3"
            >
              {homeHubContent.hero.exploreCta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="relative hidden pt-2 lg:block">
            <div className="absolute -inset-8 rounded-full border border-accent-ink/10" />
            <div className="relative rounded-md border border-ink/10 bg-surface/90 p-6 shadow-2xl shadow-black/40">
              <div className="grid min-h-[430px] grid-cols-2 gap-4">
                {homeHubContent.trustNodes.map(([title, text], index) => (
                  <div
                    key={title}
                    className={[
                      "relative rounded-md border border-ink/10 bg-ink/[0.04] p-5",
                      index === 1 || index === 2 ? "translate-y-10" : "",
                    ].join(" ")}
                  >
                    <div className="mb-8 h-1.5 w-14 rounded-full bg-accent" />
                    <p className="text-lg font-semibold text-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-400">{text}</p>
                  </div>
                ))}
              </div>
              <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-ink/30 bg-accent/10" />
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-accent shadow-lg shadow-black/30" />
              <span className="absolute left-1/2 top-[calc(50%+2.25rem)] -translate-x-1/2 rounded-md border border-accent-ink/30 bg-surface-raised/95 px-3 py-1.5 text-xs font-semibold text-accent-ink shadow-lg shadow-black/30">
                {homeHubContent.trustStateLabel}
              </span>
              {homeHubContent.trustLabels.map(
                ({ label, className }) => (
                  <span
                    key={label}
                    className={[
                      "absolute rounded-md border border-ink/10 bg-surface-raised/95 px-3 py-2 text-xs font-semibold text-ink-100 shadow-lg shadow-black/30",
                      className,
                    ].join(" ")}
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-ink/[0.03]">
        <div className="site-container grid gap-0 py-6 md:grid-cols-4">
          {featureStrip.map((item) => (
            <div key={item.title} className="flex gap-4 border-ink/10 py-4 md:border-r md:px-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent">
                <item.icon size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink">{item.title}</h2>
                <p className="mt-1 text-sm leading-5 text-ink-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionIntro
          eyebrow={homeHubContent.sectionIntro.eyebrow}
          title={homeHubContent.sectionIntro.title}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hubCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group link-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-tile text-on-accent transition group-hover:bg-accent">
                  <card.icon size={24} aria-hidden="true" />
                </div>
                <ArrowRight className="text-ink-500 transition group-hover:text-accent-ink" size={18} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-400">{card.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

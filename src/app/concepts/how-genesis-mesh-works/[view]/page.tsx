import type { Metadata } from "next";
import { jsonLdScript } from "@/lib/json-ld";
import { notFound } from "next/navigation";
import { ConceptIndex, conceptsForView } from "@/components/how-it-works/concept-index";
import { ButtonLink } from "@/components/ui";
import { howItWorksPage, howItWorksViews, isViewId } from "@/content/how-genesis-mesh-works";
import { pageMetadata } from "@/content/metadata";
import { siteConfig, siteLinks } from "@/content/site";

type Params = { params: Promise<{ view: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return howItWorksViews.map((view) => ({ view: view.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { view } = await params;
  const meta = howItWorksViews.find((item) => item.id === view);
  if (!meta) {
    return {};
  }

  return pageMetadata({
    title: `${meta.title} | ${howItWorksPage.title}`,
    description: meta.description,
    path: meta.path,
    imageAlt: `${howItWorksPage.title}: ${meta.title}`,
  });
}

export default async function HowGenesisMeshWorksViewPage({ params }: Params) {
  const { view } = await params;
  if (!isViewId(view)) {
    notFound();
  }
  const meta = howItWorksViews.find((item) => item.id === view)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${howItWorksPage.title}: ${meta.title}`,
    description: meta.description,
    url: `${siteConfig.url}${meta.path}`,
    hasDefinedTerm: conceptsForView(view).flatMap((section) =>
      section.concepts.map((concept) => ({
        "@type": "DefinedTerm",
        name: concept.name,
        description: concept.whatItIs.find((block) => typeof block === "string"),
        url: `${siteConfig.url}${meta.path}#${concept.id}`,
      })),
    ),
  };

  return (
    <>
      {/*
        The explorer lives in the shared layout, so this segment's visible
        content (the text index) sits at the bottom. After a client-side
        navigation Next.js scrolls the segment's first visible element into
        view; this marker pins that element to the top of the section so
        arriving from another page starts at the top, not the bottom.
      */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ConceptIndex view={view} />
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/sdks">Build with the SDKs</ButtonLink>
        <ButtonLink href={siteLinks.genesisMeshGlossary} external variant="secondary">
          Open the glossary
        </ButtonLink>
      </div>
    </>
  );
}

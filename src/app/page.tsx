import type { Metadata } from "next";
import { jsonLdScript } from "@/lib/json-ld";
import { HomeHub } from "@/components/home-hub";
import { PageShell } from "@/components/site-shell";
import { pageMetadata } from "@/content/metadata";
import { siteConfig, siteLinks } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} | Open Infrastructure for Sovereign Systems`,
  description:
    "Explore Genesis Mesh portable trust through its protocol guides, SDKs, videos, articles, and operator resources.",
  path: "/",
  imageAlt: "Genesis Mesh portable trust for sovereign systems",
  twitterTitle: siteConfig.name,
  twitterDescription: "Open infrastructure for sovereign systems.",
});

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "GenesisMesh Labs",
      url: siteLinks.githubOrg,
      sameAs: [siteLinks.githubOrg, siteLinks.youtube, siteLinks.patreon],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description:
        "Developer resources, protocols, SDKs, videos, and articles for portable trust across independent operators.",
      publisher: {
        "@type": "Organization",
        name: "GenesisMesh Labs",
        url: siteLinks.githubOrg,
      },
    },
  ];

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <HomeHub />
    </PageShell>
  );
}

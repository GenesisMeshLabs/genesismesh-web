import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageAlt: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  imageAlt,
  twitterTitle = title,
  twitterDescription = description,
}: PageMetadataInput): Metadata {
  return {
    // Page titles already name Genesis Mesh, and the same title is the Open
    // Graph and Twitter title, so the layout's "%s | Genesis Mesh" template
    // must not append the name a second time.
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.socialCard,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [siteConfig.socialCard],
    },
  };
}

import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { PageShell } from "@/components/site-shell";
import { SectionIntro } from "@/components/ui";
import { pageMetadata } from "@/content/metadata";
import { pageIntros } from "@/content/pages";
import { siteLinks } from "@/content/site";
import { getYoutubeVideos } from "@/lib/content-feeds";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Genesis Mesh Videos",
  description:
    "Watch Genesis Mesh campaign videos about portable trust, sovereign systems, recognition, revocation, and protocol interoperability.",
  path: "/videos",
  imageAlt: "Genesis Mesh videos",
});

export default async function VideosPage() {
  const videos = await getYoutubeVideos();

  return (
    <PageShell>
      <section className="page-section">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro {...pageIntros.videos} />
          <a
            href={siteLinks.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-bold text-on-accent transition hover:bg-tile"
          >
            <BrandIcon name="youtube" className="h-5 w-5" />
            Subscribe on YouTube
            <ExternalLink size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.videoId}
              className="surface-card overflow-hidden"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`${video.thumbnailUrl}${video.updated ? `?v=${encodeURIComponent(video.updated)}` : ""}`}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                  <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent text-on-accent shadow-lg shadow-black/30 transition group-hover:bg-tile sm:right-4 sm:top-4 sm:h-12 sm:w-12">
                    <Play size={21} fill="currentColor" aria-hidden="true" className="ml-0.5" />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                    {video.published}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">{video.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink-400">{video.summary}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

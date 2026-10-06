import { articles, videos } from "@/content/genesismesh";

export type FeedVideo = {
  title: string;
  videoId: string;
  published: string;
  updated: string;
  summary: string;
  thumbnailUrl: string;
};

export type FeedArticle = {
  title: string;
  href: string;
  channel: string;
  summary: string;
  published?: string;
};

const youtubeFeedUrl =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCXwK8VWAwnlI_0zmXcuywYA";
const patreonCampaignId = "16329594";
const patreonPostsApiUrl =
  `https://www.patreon.com/api/posts?filter[campaign_id]=${patreonCampaignId}&sort=-published_at&page[count]=100`;

const fallbackVideos: FeedVideo[] = videos.map((video) => ({
  ...video,
  updated: video.published,
  thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
}));

// JSON escapes first, then HTML entities, "&amp;" last: decoding it first
// turned "&amp;lt;" into "<".
function decodeEntities(value: string) {
  return value
    .replace(/\\u002F/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function excerpt(value: string, limit = 220) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) {
    return clean;
  }

  const trimmed = clean.slice(0, limit);
  return `${trimmed.slice(0, Math.max(trimmed.lastIndexOf(" "), 80)).trim()}...`;
}

function matchTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? stripTags(match[1]) : "";
}

function matchAttribute(block: string, tag: string, attribute: string) {
  const tagMatch = block.match(new RegExp(`<${tag}[^>]*>`, "i"));
  if (!tagMatch) {
    return "";
  }

  const attributeMatch = tagMatch[0].match(new RegExp(`${attribute}="([^"]+)"`, "i"));
  return attributeMatch ? decodeEntities(attributeMatch[1]) : "";
}

export async function getYoutubeVideos(): Promise<FeedVideo[]> {
  try {
    const response = await fetch(youtubeFeedUrl, {
      cache: "no-store",
      headers: { Accept: "application/atom+xml, application/xml;q=0.9, */*;q=0.8" },
    });

    if (!response.ok) {
      return fallbackVideos;
    }

    const xml = await response.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const parsed = entries
      .map((entry) => {
        const block = entry[1];
        const videoId = matchTag(block, "yt:videoId");
        const title = matchTag(block, "title");
        const published = matchTag(block, "published").slice(0, 10);
        const updated = matchTag(block, "updated");
        const thumbnailUrl =
          matchAttribute(block, "media:thumbnail", "url") ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const summary = excerpt(
          matchTag(block, "media:description") || "Watch this Genesis Mesh video on YouTube.",
        );

        return videoId && title
          ? {
              title,
              videoId,
              published: published || "Latest",
              updated,
              summary,
              thumbnailUrl,
            }
          : null;
      })
      .filter((video): video is FeedVideo => Boolean(video));

    return parsed.length ? parsed : fallbackVideos;
  } catch {
    return fallbackVideos;
  }
}

function articleKey(article: Pick<FeedArticle, "title" | "href">) {
  return `${article.title.toLowerCase()}|${article.href}`;
}

type PatreonPostNode = {
  type?: string;
  text?: string;
  content?: PatreonPostNode[];
};

type PatreonPost = {
  id: string;
  attributes?: {
    title?: string;
    url?: string;
    published_at?: string;
    content_json_string?: string;
  };
};

function collectPatreonText(node: PatreonPostNode, parts: string[] = []) {
  if (node.type === "text" && node.text) {
    parts.push(node.text);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      collectPatreonText(child, parts);
    }
  }

  return parts;
}

function summaryFromPatreonContent(contentJsonString?: string) {
  if (!contentJsonString) {
    return "";
  }

  try {
    const doc = JSON.parse(contentJsonString) as PatreonPostNode;
    return excerpt(collectPatreonText(doc).join(" "), 220);
  } catch {
    return "";
  }
}

function parsePatreonPosts(payload: unknown): FeedArticle[] {
  const data = (payload as { data?: PatreonPost[] }).data;
  if (!Array.isArray(data)) {
    return [];
  }

  const parsed: FeedArticle[] = [];

  for (const post of data) {
    const attrs = post.attributes;
    const title = attrs?.title?.trim();
    const href = attrs?.url?.trim();

    if (!title || !href) {
      continue;
    }

    parsed.push({
      title,
      href,
      channel: "Patreon",
      published: attrs?.published_at?.slice(0, 10),
      summary:
        summaryFromPatreonContent(attrs?.content_json_string) ||
        "Read this Genesis Mesh article on Patreon.",
    });
  }

  return parsed;
}

export async function getPatreonArticles(): Promise<FeedArticle[]> {
  const fallbackArticles = articles.map(({ title, href, channel, summary }) => ({
    title,
    href,
    channel,
    summary,
  }));

  try {
    const response = await fetch(patreonPostsApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.api+json, application/json;q=0.9, */*;q=0.8",
        "User-Agent": "GenesisMeshWeb/1.0 (+https://www.genesismesh.org)",
      },
    });

    if (!response.ok) {
      return fallbackArticles;
    }

    const parsed = parsePatreonPosts(await response.json());

    if (!parsed.length) {
      return fallbackArticles;
    }

    return [...new Map(parsed.map((article) => [articleKey(article), article])).values()];
  } catch {
    return fallbackArticles;
  }
}

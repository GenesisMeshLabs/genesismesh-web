// The assistant's knowledge: chunks built from the website's own content modules, plus a few
// curated facts (current release, live endpoints, install commands). Built once per instance and
// searched per question, so a request carries only the passages that match.
import { articles, gateway, mcpServer, pillars, sdkCards, videos } from "@/content/genesismesh";
import { concepts, howItWorksBasePath, stories, type Block } from "@/content/how-genesis-mesh-works";
import { homeHubContent, pageIntros, startHerePaths, startHerePoints, startHereWorkflow } from "@/content/pages";
import { externalChannels, siteConfig, siteLinks } from "@/content/site";
// Refreshed from the core docs before every build (scripts/release-facts.mjs).
import release from "@/generated/release.json";
import { buildIndex, type Chunk, type Index } from "./search";

const WWW = siteConfig.url.replace(/\/+$/, "");
const page = (path: string) => `${WWW}${path}`;

function flatten(blocks: Block[] | undefined): string {
  return (blocks ?? [])
    .map((b) => (typeof b === "string" ? b : "code" in b ? b.code.join(" ") : b.quote.join(" ")))
    .join(" ");
}

/** Facts the site states in several places or not at all, kept current here. */
const FACTS: Chunk[] = [
  {
    id: "fact:release",
    title: "Current release and license",
    url: siteLinks.githubCore,
    keywords: "version latest release changelog open source license MIT free",
    text:
      `The current Genesis Mesh release is ${release.version}: the reference implementation and Network Authority, the TypeScript, Go, .NET and Rust SDKs and the gateway all release at the same version. Genesis Mesh is open source under the MIT license, on GitHub at https://github.com/GenesisMeshLabs. Release notes: https://docs.genesismesh.org/changelog.html`,
  },
  {
    id: "fact:install",
    title: "Install and run a Network Authority",
    url: siteLinks.docsQuickstart,
    keywords: "install pip python quickstart get started run sovereign network authority setup",
    text:
      "Install the Python reference implementation with `pip install genesis-mesh`, then run `genesis-mesh init` (local keys, a signed genesis block and CLI config) and `genesis-mesh na start` to start your own Network Authority. The quick start: https://docs.genesismesh.org/quickstart.html. Container images: ghcr.io/genesismeshlabs/genesis-mesh and ghcr.io/genesismeshlabs/genesis-mesh-gateway.",
  },
  {
    id: "fact:live-mesh",
    title: "The live mesh",
    url: siteLinks.liveMesh,
    keywords: "demo try live online playground console tour sandbox",
    text:
      "https://mesh.genesismesh.org is a live Genesis Mesh network: a gateway console in front of its own Network Authority, federated with a read-only public reference authority. It has a guided tour and demo access to watch recognition, verification and revocation happen, with no install.",
  },
  {
    id: "fact:sites",
    title: "Genesis Mesh websites",
    url: WWW,
    keywords: "website marketing landing docs documentation hub thesis where links",
    text:
      "www.genesismesh.org is the hub for concepts, SDKs, docs, videos and articles. genesismesh.org is the multilingual landing site with the thesis. docs.genesismesh.org is the documentation: quick start, concepts, SDK guides, operator runbooks and API reference. mesh.genesismesh.org is the live mesh. Source code is on GitHub at https://github.com/GenesisMeshLabs.",
  },
  {
    id: "fact:mcp-live",
    title: "Using the MCP server and its live instance",
    url: siteLinks.docsMcp,
    keywords: "mcp model context protocol claude ai assistant agent connector chatgpt llm tools approval code oauth",
    text:
      "The Genesis Mesh MCP server (https://github.com/GenesisMeshLabs/genesismesh-mcp) gives AI assistants and agents the Network Authority's operations, offline verification and signing as Model Context Protocol tools. Run it locally over stdio beside your own authority, or remotely over Streamable HTTP with built-in OAuth: each client is authorized with a single-use approval code from the server's operator, and its scopes limit what it can do. A live instance at https://mcp.genesismesh.org/mcp serves the mesh.genesismesh.org authority; ask the Genesis Mesh team for an approval code. Guide: https://docs.genesismesh.org/concepts/mcp-server.html",
  },
  {
    id: "fact:components",
    title: "Components and repositories",
    url: siteLinks.githubOrg,
    keywords: "repositories repos github components edge agent verifier gateway sdk php",
    text:
      "Genesis Mesh components: the Python reference implementation and Network Authority (GenesisMeshLabs/genesismesh, PyPI genesis-mesh); SDKs for TypeScript (sdk-typescript, npm genesis-mesh-sdk), Go (sdk-go), .NET (sdk-dotnet, NuGet genesismesh-sdk-dotnet) and Rust (sdk-rust, which also ships genesis-mesh-verify, a standalone offline verifier, and genesis-mesh-edge, an edge agent for devices, in beta); the Rust gateway (GenesisMeshLabs/gateway); and the MCP server (GenesisMeshLabs/genesismesh-mcp).",
  },
  {
    id: "fact:contact",
    title: "Contact the Genesis Mesh team",
    url: WWW,
    keywords: "contact email team talk human sales partnership support help question inquiry press",
    text:
      "To contact the Genesis Mesh team, the assistant on this website can send an inquiry: it asks for a name, an email, a topic and the message, shows a summary, and sends it only when the visitor confirms. For code issues, open an issue in the relevant GitHub repository.",
  },
  {
    id: "fact:about",
    title: "Who builds Genesis Mesh",
    url: siteLinks.githubOrg,
    keywords: "who made built created author company organization maintainer behind labs genesismesh",
    text: `Genesis Mesh is built by ${siteConfig.organization} and developed in the open on GitHub at https://github.com/GenesisMeshLabs, under the MIT license. Questions for the team can be sent through this assistant's inquiry.`,
  },
  {
    id: "fact:why",
    title: "Why Genesis Mesh: the problem it solves",
    url: page("/start-here"),
    keywords: "why problem solve purpose benefit value use case need motivation boundary",
    text:
      "Systems can connect across organizations, but trust usually stops at the boundary: each side must hand authority to a central party or re-check everything itself. Genesis Mesh lets independent operators keep their own keys, recognize each other through recognition treaties, revoke that recognition, and exchange trust decisions as signed, verifiable evidence that anyone can check offline. It serves services, devices, AI agents and organizations: supply chains, data access authorization, edge infrastructure and cross-boundary agents are worked examples on the site.",
  },
  {
    id: "fact:videos-articles",
    title: "Videos, articles and supporting the project",
    url: siteLinks.youtube,
    keywords: "youtube videos patreon articles support donate follow news updates",
    text: `Videos are on YouTube at ${siteLinks.youtube} and on ${page("/videos")}. Articles and supporter updates are on Patreon at ${siteLinks.patreon} and listed on ${page("/articles")}.`,
  },
];

function build(): Chunk[] {
  const chunks: Chunk[] = [...FACTS];
  chunks.push({
    id: "page:home",
    title: homeHubContent.hero.title,
    url: page("/"),
    keywords: "what is genesis mesh overview introduction",
    text: [homeHubContent.hero.description, ...pillars.map((p) => `${p.title}: ${p.description}`)].join(" "),
  });
  chunks.push({
    id: "page:start-here",
    title: pageIntros.startHere.title,
    url: page("/start-here"),
    keywords: "what is genesis mesh start beginner new paths",
    text: [
      pageIntros.startHere.description,
      ...startHerePoints,
      ...startHerePaths.paths.map((p) => `${p.who}: ${p.title}. ${p.description} (${p.cta.label}: ${p.cta.href})`),
    ].join(" "),
  });
  chunks.push({
    id: "page:workflow",
    title: startHereWorkflow.title,
    url: page("/start-here"),
    keywords: "recognize verify revoke workflow evidence",
    text: [startHereWorkflow.description, ...startHereWorkflow.steps.map((s) => `${s.title}: ${s.description}`)].join(" "),
  });
  for (const [key, intro] of Object.entries(pageIntros)) {
    if (key === "startHere") continue;
    chunks.push({
      id: `page:${key}`,
      title: intro.title,
      url: page(key === "sdk" ? "/sdks" : `/${key}`),
      keywords: `${intro.eyebrow} page`,
      text: intro.description,
    });
  }
  for (const sdk of sdkCards) {
    chunks.push({
      id: `sdk:${sdk.repo.split("/").pop()}`,
      title: `${sdk.name} (${sdk.language})`,
      url: sdk.href,
      keywords: `sdk ${sdk.language} client library package install ${sdk.repo} ${SDK_KEYWORDS[sdk.language.toLowerCase()] ?? ""}`,
      text: `${sdk.description} Repository: ${sdk.repo}. Install: ${sdk.install}. All SDKs: ${page("/sdks")}.`,
    });
  }
  chunks.push({
    id: "product:gateway",
    title: gateway.name,
    url: gateway.href,
    keywords: "gateway rust service verify certificates edge http enforce",
    text: [gateway.title, gateway.description, ...gateway.features, gateway.choose].join(" "),
  });
  chunks.push({
    id: "product:mcp",
    title: mcpServer.name,
    url: mcpServer.docs,
    keywords: "mcp model context protocol ai assistant agent claude",
    text: [mcpServer.title, mcpServer.description, ...mcpServer.features, mcpServer.choose, `Repository: ${mcpServer.href}`].join(" "),
  });
  for (const story of stories) {
    chunks.push({
      id: `story:${story.id}`,
      title: `${story.label}: ${story.title}`,
      url: page(`${howItWorksBasePath}/${story.id}`),
      keywords: "how it works story overview",
      text: flatten(story.intro),
    });
  }
  for (const c of concepts) {
    const view = c.story === "system" ? "foundation" : c.story;
    chunks.push({
      id: `concept:${c.id}`,
      title: `${c.name} (${c.tagline})`,
      url: page(`${howItWorksBasePath}/${view}#${c.id}`),
      keywords: `concept ${c.name} ${CONCEPT_KEYWORDS[c.id] ?? ""}`,
      text: [flatten(c.whatItIs), flatten(c.whereItFits), c.note ? `${c.note.title}: ${flatten(c.note.body)}` : ""].join(" "),
    });
  }
  for (const v of videos) {
    chunks.push({
      id: `video:${v.videoId}`,
      title: `Video: ${v.title}`,
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
      keywords: "video youtube watch",
      text: v.summary,
    });
  }
  for (const a of articles) {
    chunks.push({ id: `article:${a.title}`, title: `Article: ${a.title}`, url: a.href, keywords: "article read patreon", text: a.summary });
  }
  for (const ch of externalChannels) {
    chunks.push({ id: `channel:${ch.name}`, title: ch.name, url: ch.href, keywords: "link channel", text: ch.description });
  }
  return chunks;
}

/** Words visitors use for an SDK's platform that its card does not contain. */
const SDK_KEYWORDS: Record<string, string> = {
  typescript: "node nodejs javascript js npm deno bun backend browser frontend",
  go: "golang",
  "c#": "csharp dotnet net nuget",
  rust: "cargo crate embedded",
  python: "pip pypi django flask fastapi",
};

/** Words visitors use for a concept that its text does not contain. */
const CONCEPT_KEYWORDS: Record<string, string> = {
  revocation: "revoke revoked revoking withdraw remove trust",
  crl: "revoke revoked revocation list certificate",
  "sovereign-revocation-feed": "revoke revoked revocation share",
  "recognition-treaty": "recognize recognise federate federation trust another organization cross boundary",
  "network-authority": "NA authority control plane server operator run",
  node: "enroll enrollment join register device peer",
  "invite-token": "enroll enrollment invite join",
  "boundary-engine": "policy decision allow deny authorization authorize",
  "execution-evidence": "audit proof record log",
  "evidence-chain": "audit tamper hash chain",
};

let index: Index | undefined;
export function knowledgeIndex(): Index {
  return (index ??= buildIndex(build()));
}

/** Names the scope check should recognize as Genesis Mesh vocabulary. */
export const SCOPE_TERMS = [
  ...concepts.map((c) => c.name),
  "Network Authority (NA)",
  "gateway",
  "MCP server",
  "live mesh",
  "edge agent",
  "genesis-mesh-verify",
  "trust API",
  "SDK",
  "thesis and proofs (genesismesh.org)",
  "hub, docs, videos, articles, start here, how it works (site sections)",
].join(", ");

/** The few links the assistant may always give without searching. */
export const ESSENTIAL_LINKS = [
  `Hub: ${WWW}`,
  `Start here: ${page("/start-here")}`,
  `How it works: ${page(`${howItWorksBasePath}/foundation`)}`,
  `SDKs: ${page("/sdks")}`,
  `Docs: ${siteLinks.docs}`,
  `Quick start: ${siteLinks.docsQuickstart}`,
  `Live mesh: ${siteLinks.liveMesh}`,
  `Landing site and thesis: ${siteLinks.thesis}`,
  `GitHub: ${siteLinks.githubOrg}`,
].join("\n");

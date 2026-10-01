import {
  Boxes,
  Braces,
  Cable,
  CircleSlash,
  Code2,
  KeyRound,
  LockKeyhole,
  Network,
  RadioTower,
  ScrollText,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteLinks } from "@/content/site";

export { externalChannels, navItems, siteLinks } from "@/content/site";

export type Pillar = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const pillars: Pillar[] = [
  {
    title: "Open infrastructure",
    description:
      "A protocol-oriented trust layer for systems, operators, SDKs, services, and agents that need to cooperate across boundaries.",
    icon: Network,
  },
  {
    title: "Sovereign systems",
    description:
      "Each operator keeps control of keys, policies, recognition, revocation, and trust decisions.",
    icon: KeyRound,
  },
  {
    title: "Verifiable trust state",
    description:
      "Recognition, revocation, disclosures, and decisions leave signed evidence that can be checked later.",
    icon: ShieldCheck,
  },
  {
    title: "Protocol interoperability",
    description:
      "Genesis Mesh is not tied to one runtime, cloud, or language. SDKs make the same trust artifacts usable from real software.",
    icon: Cable,
  },
];

export type SdkCard = {
  name: string;
  language: string;
  href: string;
  repo: string;
  description: string;
  icon: LucideIcon;
};

export const sdkCards: SdkCard[] = [
  {
    name: "SDK for Go",
    language: "Go",
    href: siteLinks.sdkGo,
    repo: "GenesisMeshLabs/sdk-go",
    description: "Typed client for builders wiring trust checks into Go services and infrastructure.",
    icon: TerminalSquare,
  },
  {
    name: "SDK for TypeScript",
    language: "TypeScript",
    href: siteLinks.sdkTypeScript,
    repo: "GenesisMeshLabs/sdk-typescript",
    description: "Client package for web apps, tools, server routes, and developer-facing integrations.",
    icon: Braces,
  },
  {
    name: ".NET SDK",
    language: "C#",
    href: siteLinks.sdkDotnet,
    repo: "GenesisMeshLabs/sdk-dotnet",
    description: "C# client for enterprise services and Microsoft-stack integration paths.",
    icon: Code2,
  },
];

export type Campaign = {
  title: string;
  message: string;
  image: string;
  icon: LucideIcon;
};

export const campaigns: Campaign[] = [
  {
    title: "Portable trust",
    message: "Trust should move between independent systems without one central owner.",
    image: "/images/marketing/marketing-hero-trust-fabric.png",
    icon: Boxes,
  },
  {
    title: "Recognition and revocation",
    message: "It is not enough to trust once. You must be able to cut trust off with proof.",
    image: "/images/marketing/marketing-provenance-chain.png",
    icon: CircleSlash,
  },
  {
    title: "Independent operators",
    message: "Organizations can cooperate without surrendering local authority.",
    image: "/images/marketing/marketing-independent-operators.png",
    icon: LockKeyhole,
  },
];

export type Video = {
  title: string;
  videoId: string;
  published: string;
  summary: string;
};

export const videos: Video[] = [
  {
    title: "Integration Without Authority Transfer",
    videoId: "Sj1-k7y5jhg",
    published: "2026-06-30",
    summary: "Enterprise integration without making one system the owner of all trust.",
  },
  {
    title: "Portable Trust Across Boundaries",
    videoId: "y3GBM5h-RdY",
    published: "2026-06-30",
    summary: "Why trust has to cross organizational boundaries without centralization.",
  },
  {
    title: "Genesis Mesh Portable Trust Layer",
    videoId: "fv1XebByCbE",
    published: "2026-06-30",
    summary: "The core framing for Genesis Mesh as portable trust for sovereign systems.",
  },
  {
    title: "Auditable Data Access Authorization",
    videoId: "kg_JsRjsxzU",
    published: "2026-06-30",
    summary: "How authorization evidence can travel with data-access decisions.",
  },
  {
    title: "Securing Supply Chain Authorization",
    videoId: "H41w_3mMrcE",
    published: "2026-06-30",
    summary: "Delegation, release gates, and trust revocation after compromise.",
  },
  {
    title: "Portable Trust for Edge Infrastructure",
    videoId: "J7OpYQy3ZkU",
    published: "2026-06-30",
    summary: "Trust paths for distributed devices, nodes, and operators.",
  },
  {
    title: "Cross-Boundary Trust for AI Agents",
    videoId: "hx_OZ6EsejI",
    published: "2026-06-30",
    summary: "Agent networks as one use case for identity, revocation, and provenance.",
  },
  {
    title: "Trust API and SDKs",
    videoId: "E2UQRM7c3Vo",
    published: "2026-06-30",
    summary: "Developer entry points for consuming Genesis Mesh trust primitives.",
  },
  {
    title: "Trust-Layer Protocol Interoperability",
    videoId: "v4ORssb6nLw",
    published: "2026-06-30",
    summary: "The protocol surface across languages, runtimes, and infrastructure.",
  },
  {
    title: "Auditable Trust State",
    videoId: "gp5yqnNQdZI",
    published: "2026-06-30",
    summary: "Trust decisions that leave evidence for later verification.",
  },
  {
    title: "Trust Recognition and Revocation",
    videoId: "PVOfYM48DYo",
    published: "2026-06-30",
    summary: "Signed lifecycle events for recognizing and withdrawing trust.",
  },
  {
    title: "Sovereign Trust Without Central Control",
    videoId: "OS9rGqOMkHY",
    published: "2026-06-30",
    summary: "Local authority, external recognition, and portable trust state.",
  },
];

export type Article = {
  title: string;
  href: string;
  channel: string;
  summary: string;
  icon: LucideIcon;
};

export const articles: Article[] = [
  {
    title: "Why Genesis Mesh?",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Systems can connect, but they cannot carry trust across organizational boundaries.",
    icon: ScrollText,
  },
  {
    title: "Portable Trust",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Trust should move between independent systems without one central owner.",
    icon: ScrollText,
  },
  {
    title: "Sovereign Systems",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Each operator controls its own keys, policies, recognition, revocation, and trust decisions.",
    icon: ScrollText,
  },
  {
    title: "Recognition and Revocation",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "It is not enough to trust once. You must also be able to cut trust off with proof.",
    icon: ScrollText,
  },
  {
    title: "Auditable Trust State",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Every trust decision should leave evidence that can be verified later.",
    icon: ScrollText,
  },
  {
    title: "Protocol Interoperability",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Genesis Mesh is not tied to one runtime, one language, or one operator model.",
    icon: ScrollText,
  },
  {
    title: "Trust API and SDKs",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Developers need a clear API and SDK path for consuming portable trust primitives.",
    icon: ScrollText,
  },
  {
    title: "Cross-Boundary Trust for AI Agents",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Agent networks are one use case for identity, revocation, and verifiable trust state.",
    icon: ScrollText,
  },
  {
    title: "Portable Trust for Edge Infrastructure",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Distributed devices, nodes, and operators need trust state that can survive the edge.",
    icon: ScrollText,
  },
  {
    title: "Securing Supply Chain Authorization",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Supply-chain trust needs delegation, release gates, and revocation after compromise.",
    icon: ScrollText,
  },
  {
    title: "Integration Without Authority Transfer",
    href: siteLinks.patreonPosts,
    channel: "Patreon",
    summary:
      "Enterprise integration should not require one side to become the owner of the other's trust.",
    icon: ScrollText,
  },
  {
    title: "Auditable Data Access Authorization",
    href: "https://www.patreon.com/GenesisMeshLabs/posts/auditable-data-162537779",
    channel: "Patreon",
    summary:
      "Data governance needs an enforcement layer that can prove access was authorized, scoped, and reviewable.",
    icon: ScrollText,
  },
];

export const seo = {
  title: "Genesis Mesh | Portable Trust for Sovereign Systems",
  description:
    "Genesis Mesh is open infrastructure for portable trust, sovereign systems, recognition, revocation, verifiable trust state, and protocol interoperability.",
};

export const heroStats = [
  { label: "Open-source repos", value: "6+" },
  { label: "SDK tracks", value: "3" },
  { label: "Campaign videos", value: "12" },
];

export const developerProof = [
  {
    label: "Trust API",
    value: "HTTP-first integration surface",
    icon: RadioTower,
  },
  {
    label: "Evidence",
    value: "Signed recognition and revocation state",
    icon: ScrollText,
  },
  {
    label: "SDKs",
    value: "Go, TypeScript, and .NET clients",
    icon: Code2,
  },
];

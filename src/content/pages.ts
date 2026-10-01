import { BookOpen, Code2, FileText, Play, ShieldCheck, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteLinks } from "@/content/site";

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
};

export type RouteCard = PageIntro & {
  href: string;
  icon: LucideIcon;
};

export const howItWorksCta = {
  title: "How it works",
  href: "/concepts/how-genesis-mesh-works/foundation",
  description: "An interactive map of the foundation, a governed action, and how they connect.",
  icon: Waypoints,
};

export const homeHubContent = {
  hero: {
    eyebrow: "Genesis Mesh",
    title: "Open infrastructure for sovereign systems.",
    description:
      "Developer resources, protocols, SDKs, videos, and articles for building portable trust across independent operators.",
    primaryCta: {
      label: "New to Genesis Mesh? Start here",
      href: "/genesismesh/start-here",
    },
    secondaryCta: {
      label: "View on GitHub",
      href: siteLinks.githubOrg,
    },
    exploreCta: {
      label: "See how Genesis Mesh works",
      href: howItWorksCta.href,
    },
  },
  trustNodes: [
    ["Issuer", "signs recognition"],
    ["Verifier", "checks evidence"],
    ["Trust API", "returns signed state"],
    ["Audit log", "keeps proof"],
  ],
  trustLabels: [
    { label: "Sovereign identity", className: "right-8 top-14" },
    { label: "Revocation with proof", className: "right-6 bottom-16" },
    { label: "Portable trust", className: "bottom-14 left-1/2 -translate-x-1/2" },
  ],
  trustStateLabel: "Trust state",
  sectionIntro: {
    eyebrow: "Start here",
    title: "One hub, separate paths.",
  },
};

export const genesisMeshIntro: PageIntro = {
  eyebrow: "Portable trust for sovereign systems",
  title: "Genesis Mesh",
  description:
    "Open infrastructure for recognition, revocation, signed evidence, and protocol interoperability across independent operators.",
};

export const genesisMeshRouteCards: RouteCard[] = [
  {
    eyebrow: "",
    title: "Start here",
    href: "/genesismesh/start-here",
    description: "A short explainer for new visitors.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "",
    title: howItWorksCta.title,
    href: howItWorksCta.href,
    description: howItWorksCta.description,
    icon: howItWorksCta.icon,
  },
  {
    eyebrow: "",
    title: "SDKs",
    href: "/genesismesh/sdks",
    description: "Use Genesis Mesh from Go, TypeScript, and .NET.",
    icon: Code2,
  },
  {
    eyebrow: "",
    title: "Docs",
    href: "/genesismesh/docs",
    description: "Read protocol notes, source docs, and implementation entry points.",
    icon: BookOpen,
  },
  {
    eyebrow: "",
    title: "Videos",
    href: "/genesismesh/videos",
    description: "Watch the current public campaign video library.",
    icon: Play,
  },
  {
    eyebrow: "",
    title: "Articles",
    href: "/genesismesh/articles",
    description: "Read long-form campaign writing from Patreon.",
    icon: FileText,
  },
];

export const pageIntros = {
  sdk: {
    eyebrow: "SDKs",
    title: "Build against the trust layer.",
    description:
      "Genesis Mesh SDKs keep the protocol accessible from the languages teams already use for services, tools, infrastructure, and enterprise systems.",
  },
  docs: {
    eyebrow: "Docs",
    title: "Read the protocol and implementation notes.",
    description:
      "Start with the hosted documentation, then explore the core source and SDKs when you are ready to integrate.",
  },
  videos: {
    eyebrow: "Videos",
    title: "Genesis Mesh videos",
    description:
      "Campaign videos on portable trust, sovereign systems, recognition, revocation, and protocol interoperability.",
  },
  articles: {
    eyebrow: "Articles",
    title: "Genesis Mesh articles",
    description:
      "Long-form campaign articles and founder notes on portable trust, sovereign systems, recognition, revocation, and verifiable trust state.",
  },
  startHere: {
    eyebrow: "Start here",
    title: "Genesis Mesh is portable trust for sovereign systems.",
    description:
      "It is a protocol-oriented trust layer for systems that need to cooperate across organizational, runtime, and operator boundaries without handing trust decisions to one central owner.",
  },
} satisfies Record<string, PageIntro>;

export const startHerePoints = [
  "Systems can connect, but trust usually stops at the boundary.",
  "Genesis Mesh carries trust decisions as signed, verifiable evidence.",
  "Each operator keeps control of its own keys, recognition, revocation, and policies.",
  "SDKs and protocol docs make the same trust model usable from real systems.",
];

export const startHereWorkflow = {
  eyebrow: "How it works",
  title: "Recognition, verification, and revocation become portable evidence.",
  description:
    "Genesis Mesh lets independent systems exchange trust state without handing authority to one central owner.",
  steps: [
    {
      title: "Recognize",
      description: "An operator signs a trust relationship or permission boundary.",
    },
    {
      title: "Verify",
      description: "Another system checks the signed evidence before trusting the request.",
    },
    {
      title: "Revoke",
      description: "Trust can be withdrawn later with proof that downstream systems can inspect.",
    },
  ],
  evidenceExample: [
    "{",
    '  "subject": "operator-b",',
    '  "state": "recognized",',
    '  "evidence": "signed",',
    '  "revocable": true',
    "}",
  ],
};

export const articlesFollowCta = {
  title: "Follow the article stream",
  description:
    "Read new campaign writing, founder notes, and supporter updates as the Genesis Mesh story develops.",
  label: "Support on Patreon",
  href: siteLinks.patreonPosts,
};

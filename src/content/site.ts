export const siteConfig = {
  name: "Genesis Mesh",
  url: "https://www.genesismesh.org",
  organization: "GenesisMesh Labs",
  description:
    "Portable trust for sovereign systems, with guides, SDKs, and evidence from independent operators.",
  socialCard: "/images/marketing/social-card.png",
  socialCardAlt: "Genesis Mesh portable trust for sovereign systems",
};

export const siteLinks = {
  home: siteConfig.url,
  genesisMesh: `${siteConfig.url}/overview`,
  docs: "https://docs.genesismesh.org/",
  genesisMeshGlossary: "https://docs.genesismesh.org/concepts/glossary.html",
  githubOrg: "https://github.com/GenesisMeshLabs",
  githubCore: "https://github.com/GenesisMeshLabs/genesismesh",
  githubCoreStargazers: "https://github.com/GenesisMeshLabs/genesismesh/stargazers",
  sdkGo: "https://github.com/GenesisMeshLabs/sdk-go",
  sdkTypeScript: "https://github.com/GenesisMeshLabs/sdk-typescript",
  sdkDotnet: "https://github.com/GenesisMeshLabs/sdk-dotnet",
  youtube: "https://www.youtube.com/@GenesisMeshLabs",
  patreon: "https://www.patreon.com/GenesisMeshLabs",
  patreonPosts: "https://www.patreon.com/cw/GenesisMeshLabs/posts",
};

export type NavItem = {
  label: string;
  href: string;
  /** Also mark the item active for any route under this prefix. */
  activePrefix?: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Overview", href: "/overview" },
  {
    label: "How it works",
    href: "/concepts/how-genesis-mesh-works/foundation",
    activePrefix: "/concepts/how-genesis-mesh-works",
  },
  { label: "SDKs", href: "/sdks" },
  { label: "Docs", href: "/docs" },
  { label: "Videos", href: "/videos" },
  { label: "Articles", href: "/articles" },
];

export type ExternalChannel = {
  name: string;
  href: string;
  description: string;
  icon: "github" | "youtube" | "patreon" | "docs";
};

export const externalChannels: ExternalChannel[] = [
  {
    name: "GitHub",
    href: siteLinks.githubOrg,
    description: "Source code, SDKs, releases, and open infrastructure.",
    icon: "github",
  },
  {
    name: "YouTube",
    href: siteLinks.youtube,
    description: "Campaign videos and technical explainers.",
    icon: "youtube",
  },
  {
    name: "Patreon",
    href: siteLinks.patreon,
    description: "Articles, supporter updates, and public essays.",
    icon: "patreon",
  },
  {
    name: "Documentation",
    href: siteLinks.docs,
    description: "Protocol, SDK, and operator documentation.",
    icon: "docs",
  },
];

export const sitemapRoutes = [
  { path: "/", priority: 1 },
  { path: "/overview", priority: 0.9 },
  { path: "/start-here", priority: 0.85 },
  { path: "/concepts/how-genesis-mesh-works/foundation", priority: 0.85 },
  { path: "/concepts/how-genesis-mesh-works/governed-action", priority: 0.85 },
  { path: "/concepts/how-genesis-mesh-works/full-model", priority: 0.85 },
  { path: "/sdks", priority: 0.8 },
  { path: "/docs", priority: 0.8 },
  { path: "/videos", priority: 0.8 },
  { path: "/articles", priority: 0.8 },
] as const;

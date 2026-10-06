import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The same response headers as the apex (site/vercel.json).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      ...([
        ["/genesismesh", "/overview"],
        ["/genesismesh/start-here", "/start-here"],
        ["/genesismesh/sdks", "/sdks"],
        ["/genesismesh/docs", "/docs"],
        ["/genesismesh/videos", "/videos"],
        ["/genesismesh/articles", "/articles"],
      ] as const).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        // Foundation is where the How Genesis Mesh Works story starts.
        source: "/concepts/how-genesis-mesh-works",
        destination: "/concepts/how-genesis-mesh-works/foundation",
        permanent: true,
      },
      {
        source: "/concepts",
        destination: "/concepts/how-genesis-mesh-works/foundation",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;

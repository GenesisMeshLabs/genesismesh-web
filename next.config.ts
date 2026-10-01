import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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

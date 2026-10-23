import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "/coopercar",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "media.trvely.com.co" },
      { protocol: "https", hostname: "trvely.com.co" },
      { protocol: "https", hostname: "coralcostacaribebeachresort.com" },
    ],
  },
};

export default nextConfig;

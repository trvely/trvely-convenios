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
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "static-resources-elementor.mirai.com" },
      { protocol: "https", hostname: "images.mirai.com" },
      { protocol: "https", hostname: "irp.cdn-website.com" },
      { protocol: "https", hostname: "media.omnibees.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.trvely.com.co" },
    ],
  },
};

export default nextConfig;

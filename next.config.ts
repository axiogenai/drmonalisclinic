import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '172.22.230.215',
    'shares-aim-accessibility-grid.trycloudflare.com',
    '*.trycloudflare.com',
    'localhost:3005',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "primederm.in",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

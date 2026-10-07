import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browser tests use the loopback IP; Next.js 16 restricts dev origins.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
};

export default nextConfig;

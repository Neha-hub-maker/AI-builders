import type { NextConfig } from "next";

const githubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  // Browser tests use the loopback IP; Next.js 16 restricts dev origins.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  ...(githubPages
    ? {
        output: "export" as const,
        basePath: "/AI-builders",
        trailingSlash: true,
        distDir: ".next-pages",
      }
    : {}),
};

export default nextConfig;

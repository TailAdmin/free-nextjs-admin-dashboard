import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  onError(err, errorInfo) {
    // Suppress hydration errors caused by browser extensions like Grammarly
    if (err.message?.includes('data-new-gr-c-s-check-loaded') || 
        err.message?.includes('data-gr-ext-installed')) {
      return;
    }
  },
  experimental: {
    suppressHydrationWarning: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
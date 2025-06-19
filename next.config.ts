import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "202.10.42.172", 
        port: "8000",           
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "tanah3.darius.my.id",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
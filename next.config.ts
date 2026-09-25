import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      { hostname: "*.airtableusercontent.com" },
      { hostname: "dl.airtable.com" },
    ],
  },
};

export default nextConfig;

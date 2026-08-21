import type { NextConfig } from "next";

function apiRemotePattern():
  | {
      protocol: "http" | "https";
      hostname: string;
      port: string;
      pathname: string;
    }
  | undefined {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) {
    return undefined;
  }

  const url = new URL(raw);
  const protocol: "http" | "https" =
    url.protocol === "https:" ? "https" : "http";

  return {
    protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: "/pics/**",
  };
}

const remotePattern = apiRemotePattern();

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: remotePattern ? [remotePattern] : [],
  },
};

export default nextConfig;

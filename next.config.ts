import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/bio", destination: "/about", permanent: true },
      { source: "/stack", destination: "/about", permanent: true },
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/portfolio/portfolio-site", destination: "/projects", permanent: true },
      { source: "/portfolio/portfolio-site-old", destination: "/projects", permanent: true },
      { source: "/portfolio/:slug", destination: "/projects/:slug", permanent: true },
    ];
  },
};

export default nextConfig;

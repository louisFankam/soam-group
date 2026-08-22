import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne pas relayer les logs du navigateur (extensions type Grammarly incluses)
  // dans le terminal : les erreurs restent visibles dans l'overlay du navigateur.
  experimental: {
    browserDebugInfoInTerminal: false,
  },
};

export default nextConfig;

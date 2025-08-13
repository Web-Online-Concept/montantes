import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permet au build de production de réussir même avec des erreurs ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
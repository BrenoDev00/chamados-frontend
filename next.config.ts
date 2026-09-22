import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gera um servidor enxuto em .next/standalone para a imagem Docker
  output: "standalone",
};

export default nextConfig;

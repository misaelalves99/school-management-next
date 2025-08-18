import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.pravatar.cc"], // adiciona aqui os domínios externos que você vai usar
  },
};

export default nextConfig;

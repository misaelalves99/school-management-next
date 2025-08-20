// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.pravatar.cc"], // domínios externos que serão permitidos
  },
};

export default nextConfig;

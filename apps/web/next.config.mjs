/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@eomni/shared"],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;

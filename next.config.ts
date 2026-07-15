import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // Allows all googleusercontent subdomains
        port: '',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;

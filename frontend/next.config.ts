import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/:path*`,
      },
      {
        source: "/seats",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/seats`,
      },
      {
        source: "/shows",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/shows`,
      },
      {
        source: "/shows/:id",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/shows/:id`,
      },
      {
        source: "/book",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/book`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-in.bmscdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

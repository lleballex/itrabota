import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_ATTACHMENT_HOST,
      },
    ],
  },
}

export default nextConfig

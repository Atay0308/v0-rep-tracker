/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /** Prisma nur auf dem Server bundlen — nicht für Client/Middleware. */
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "@prisma/extension-accelerate",
  ],
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable more detailed logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Silence known optional dependency warning in supabase realtime for webpack
  webpack: (config, { isServer }) => {
    // Ignore the specific critical dependency warning pattern
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
    ]
    // Avoid bundling supabase-js on the server to reduce noisy edge runtime checks
    if (isServer) {
      config.externals = [...(config.externals || []), 'jsdom']
    }
    return config
  },
}

export default nextConfig

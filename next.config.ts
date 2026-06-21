import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/bscc", destination: "/student-credit-card", permanent: true },
      { source: "/student-login", destination: "/auth/login", permanent: true },
      { source: "/student-dashboard", destination: "/dashboard", permanent: true },
    ];
  },
  typescript: {
    // Type errors now fail the build (all known errors fixed). Keeps regressions out.
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint is not configured in this project; leave disabled during builds to
    // avoid the interactive setup blocking CI. Run `npm run lint` to configure.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

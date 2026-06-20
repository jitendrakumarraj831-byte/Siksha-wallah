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
    ignoreBuildErrors: true,
  },
  eslint: {
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

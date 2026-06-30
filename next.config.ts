import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin", "firebase-admin/app", "firebase-admin/auth", "firebase-admin/firestore"],

  async redirects() {
    return [
      // The dedicated BSCC page was removed; its content now lives in the
      // "#bscc" section of the homepage. Point both the short link and the
      // old page URL there so neither 404s.
      { source: "/bscc", destination: "/#bscc", permanent: true },
      { source: "/student-credit-card", destination: "/#bscc", permanent: true },
      { source: "/student-login", destination: "/auth/login", permanent: true },
      { source: "/student-dashboard", destination: "/dashboard", permanent: true },
      // The separate /login chooser duplicated the student + office login links
      // already shown in the navbar/footer. Removed; send any old links to the
      // student login (office staff use /admin/login).
      { source: "/login", destination: "/auth/login", permanent: true },
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

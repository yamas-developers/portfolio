/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // distDir: 'build',
  experimental: {
    appDir: true,
  },
  optimizeFonts: false,
  images: {
    domains: ["user-images.githubusercontent.com", "cdn.hashnode.com"],
  },
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/#work",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

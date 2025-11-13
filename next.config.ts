import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  distDir: 'out',
  // Enable dynamic routing for static export
  generateBuildId: () => 'build',
};

export default nextConfig;

/** @type {import('next').NextConfig} */

const Dotenv = require('dotenv-webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  reactStrictMode: false,
  webpack(config, { isServer }) {
    config.resolve.modules.push(__dirname);
    if (!isServer) {
      config.plugins.push(new Dotenv({ silent: true })); // .env 파일이 없어도 오류나지 않도록 설정
    }
    config.module.rules.push({
      // SVG loader configuration
      test: /\.svg$/,
      loader: '@svgr/webpack',
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
        titleProp: true,
      },
    });
    return config;
  },
  env: {
    // GOOGLE_CLIENT_ID: "274054349866-dk2gs2nhgcl85tiqcktion0pivnqbniu.apps.googleusercontent.com",
    // YOUTUBE_TIMEOUT: 5000,
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
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  distDir: process.env.BUILD_DIR || '.next',
};

module.exports = withBundleAnalyzer(nextConfig);

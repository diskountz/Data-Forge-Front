/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // This is important for Cloudflare Pages
  distDir: 'build',
}

module.exports = nextConfig
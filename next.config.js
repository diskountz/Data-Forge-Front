/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Add this line to match Cloudflare's expected directory
  distDir: '.vercel/output/static'
}
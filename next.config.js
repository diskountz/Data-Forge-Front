/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Add this for better error visibility
  onError: (err) => {
    console.error('Next.js build error:', err);
  }
}
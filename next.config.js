/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail build on ESLint errors in production
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
  images: {
    domains: ['images.unsplash.com', 'fyjmczdbllubrssixpnx.supabase.co'],
  },
};

module.exports = nextConfig;

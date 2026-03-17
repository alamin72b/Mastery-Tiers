/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google Photos
      { protocol: 'https', hostname: 'ui-avatars.com' }, // Fallback avatars
    ],
  },
};
export default nextConfig;

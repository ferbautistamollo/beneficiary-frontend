/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "400mb",

    },
  },
  allowedDevOrigins: [
    "192.168.2.240",
  ],
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.rumahmesin.com",
      },
      {
        protocol: "https",
        hostname: "cnc-magazine.oramiland.com",
      },
      {
        protocol: "https",
        hostname: "img.antaranews.com",
      },
      {
        protocol: "https",
        hostname: "www.smp1buduran.sch.id",
      },
    ],
  },
};

module.exports = nextConfig;

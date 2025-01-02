/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**", // Wildcard allows all hosts
        },
      ],
    },
};

export default nextConfig;

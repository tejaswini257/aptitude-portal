import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/**",
//       },
//     ],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pravatar.cc"],
  },
};

module.exports = nextConfig;


// export default nextConfig;


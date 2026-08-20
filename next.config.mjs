/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  ...(process.env.SIGNAPSE_AUTH_MODE === "disabled" &&
  process.env.SIGNAPSE_E2E_MODE === "fixture"
    ? { allowedDevOrigins: ["127.0.0.1"], devIndicators: false }
    : {}),
}

export default nextConfig

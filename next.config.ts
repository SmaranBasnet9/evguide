const isVercelBuild = process.env.VERCEL === "1";
const isDevelopment = process.env.NODE_ENV !== "production";
const localBuildDistDir = !isVercelBuild && !isDevelopment ? ".next-local" : undefined;
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  `script-src 'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval' " : ""}https:`,
  "style-src 'self' 'unsafe-inline' https:",
  "object-src 'none'",
  "media-src 'self' https:",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");
const baseSecurityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];
const productionOnlySecurityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(localBuildDistDir ? { distDir: localBuildDistDir } : {}),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...baseSecurityHeaders,
          ...(isDevelopment ? [] : productionOnlySecurityHeaders),
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.topgear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;

import type { NextConfig } from "next";

// Images (dish photos, logos, QR codes) are served from the same backend
// that NEXT_PUBLIC_API_URL points to. We derive its hostname instead of
// allowing "**" — an unrestricted https wildcard turns Next.js Image
// Optimization into an open proxy for arbitrary remote images.
function backendHostname(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").hostname || null;
  } catch {
    return null;
  }
}

const backendHost = backendHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      ...(backendHost && backendHost !== "localhost"
        ? [{ protocol: "https" as const, hostname: backendHost }]
        : []),
    ],
    // QR codes are generated as SVG by the backend (QrCodeService). Next/Image
    // blocks SVG by default (it can contain scripts); we allow it only with a
    // strict CSP + sandboxed rendering, which is the pattern Next.js docs
    // recommend for trusted-but-not-fully-static SVG sources.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

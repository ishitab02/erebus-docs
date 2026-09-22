import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { KeyProvider } from "@/components/KeyContext";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Grain } from "@/components/Grain";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Display headings, body text, and code use separate font families.
const display = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-face",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.erebusagents.live"),
  title: "Erebus docs",
  description:
    "Private settlement and negotiation infrastructure for AI agents.",
  openGraph: {
    title: "Erebus docs",
    description:
      "Private settlement and negotiation infrastructure for AI agents.",
    type: "website",
    url: "/",
    siteName: "Erebus",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Erebus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erebus docs",
    description:
      "Private settlement and negotiation infrastructure for AI agents.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0908",
};

/**
 * The document ships unkeyed. Every value is still plaintext in the markup —
 * the redaction is an ink bar drawn over it — so a reader with no JavaScript,
 * a crawler, or a link preview sees the complete page. The animation does not hide content from the document.
 */
const BOOT = `
try {
  var r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.setAttribute('data-key', r ? 'held' : 'dropped');
} catch (e) {
  document.documentElement.setAttribute('data-key', 'held');
}
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-key="dropped"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{`[data-key="dropped"] .redact::after{clip-path:inset(0 0 0 100%)}`}</style>
        </noscript>
      </head>
      <body>
        <KeyProvider>
          <SmoothScroll />
          {children}
          <Grain />
        </KeyProvider>
        <Analytics />
      </body>
    </html>
  );
}

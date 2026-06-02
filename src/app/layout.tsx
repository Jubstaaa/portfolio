import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/lib/content";

import "./globals.css";

const hermit = localFont({
  src: [
    {
      path: "../fonts/hermit/Hermit-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/hermit/Hermit-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/hermit/Hermit-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/hermit/Hermit-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-hermit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "ilker balcilar",
    "software engineer",
    "frontend engineer",
    "full-stack developer",
    "istanbul",
    "nextjs",
    "typescript",
    "react",
    "react native",
    "node.js",
    "hono",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: `@${site.handle}`,
  },
  alternates: {
    canonical: site.url,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.17 0.013 255)" },
    { media: "(prefers-color-scheme: light)", color: "oklch(0.985 0.005 85)" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.locale}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${hermit.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-foreground flex min-h-screen flex-col font-mono antialiased"
      >
        <ThemeProvider>
          <Nav />
          <ScrollProgress />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3005";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.jpg`;

  return {
    title: "Psych for LLM — An Interactive Research Map",
    description: "Explore how six areas of psychology inform four stages of LLM development—and learn how to ground multidisciplinary research.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Borrow the theory. Keep its grounding.",
      description: "An interactive companion to the EACL 2026 review of psychological theories in LLMs.",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Borrow the theory. Keep its grounding." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Psych for LLM",
      description: "An interactive EACL 2026 research companion.",
      images: [imageUrl],
    },
  };
}

export const viewport: Viewport = { themeColor: "#f3f0e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = new URL("https://portfolio.krishang.dev");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Krishang Zinzuwadia",
  description:
    "Explore Krishang Zinzuwadia's work in AI systems, full-stack engineering, and cybersecurity through an interactive 1990 Macintosh Classic.",
  applicationName: "Krishang Zinzuwadia Portfolio",
  alternates: { canonical: "/" },
  authors: [{ name: "Krishang Zinzuwadia" }],
  creator: "Krishang Zinzuwadia",
  keywords: [
    "Krishang Zinzuwadia",
    "AI systems",
    "autonomous agents",
    "full-stack engineer",
    "cybersecurity",
    "CTF",
    "Next.js",
    "Rust",
    "Tauri",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Krishang Zinzuwadia",
    description:
      "A working System 7-inspired portfolio inside an original 3D Macintosh Classic.",
    siteName: "Krishang Zinzuwadia",
    images: [
      {
        url: "/og.jpg",
        width: 3840,
        height: 2016,
        alt: "Krishang Zinzuwadia's interactive Macintosh Classic portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishang Zinzuwadia",
    description:
      "AI systems, full-stack engineering, and security—inside a working 3D Macintosh.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#11120f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

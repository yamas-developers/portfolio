import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider } from "./analytics/PostHogProvider";

export const metadata: Metadata = {
  title: "Muhammad Khizr — Flutter & Full Stack Developer",
  description:
    "Mobile apps, Laravel backends, and responsive web platforms. Flutter & Full Stack Developer based in Pakistan, working remotely.",
  alternates: { canonical: "https://www.khizr.net/" },
  generator: "Next.js",
  applicationName: "Muhammad Khizr",
  keywords: [
    "freelance",
    "developer",
    "freelance developer",
    "flutter",
    "laravel",
    "react native",
    "next.js",
    "full stack developer",
    "mobile developer",
    "software developer",
    "portfolio",
  ],
  colorScheme: "light dark",
  openGraph: {
    title: "Muhammad Khizr — Flutter & Full Stack Developer",
    description:
      "Mobile apps, Laravel backends, and responsive web platforms. Focused on interfaces and experiences, working remotely from Pakistan.",
    url: "https://www.khizr.net/",
    siteName: "www.khizr.net",
    images: [
      {
        url: "https://www.khizr.net/projects/pich.png",
        alt: "Muhammad Khizr — Flutter & Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Khizr — Flutter & Full Stack Developer",
    description:
      "Mobile apps, Laravel backends, and responsive web platforms. Based in Pakistan, working remotely.",
    images: ["https://www.khizr.net/projects/pich.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="antialiased">
        <PostHogProvider>
          {children}
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}

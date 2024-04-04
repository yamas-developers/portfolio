import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Syne } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";

const syne = Syne({
  subsets: ["latin"],
  display: "block",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
  description:
    "Flutter Developer | Full Stack Developer | Freelancer. Focused on interfaces and experiences, working remotely from Pakistan.",
  generator: "Next.js",
  applicationName: "Muhammad Khizr",
  keywords: [
    "freelance",
    "developer",
    "freelance developer",
    "frontend",
    "react",
    "frontend developer",
    "frontend engineer",
    "creative",
    "creative developer",
    "creative engineer",
    "tech",
    "nigeria",
    "software",
    "software developer",
    "portfolio",
    "frontend developer portfolio",
    "creative developer portfolio",
  ],
  colorScheme: "dark",
  openGraph: {
    title: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
    description:
      "Flutter Developer | Full Stack Developer | Freelancer. Focused on interfaces and experiences, working remotely from Pakistan.",
    url: "https://www.khizr.net/",
    siteName: "www.khizr.net",
    images: [
      {
        url: "https://drive.google.com/file/d/1avC7QzfHz3M30STAdvk5BAfus3bt6DC7/view?usp=sharing",
        width: 1200,
        height: 630,
        alt: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
      },
      {
        url: "https://drive.google.com/file/d/1ziMwAxUV9ZKSPlKZRh_WqhWtel8Ri3RH/view?usp=sharing",
        width: 1200,
        height: 630,
        alt: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
      },
      {
        url: "https://drive.google.com/file/d/1ziMwAxUV9ZKSPlKZRh_WqhWtel8Ri3RH/view?usp=sharing",
        width: 300,
        height: 300,
        alt: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Muhammad Khizr — Flutter Developer | Full Stack Developer | Freelancer",
  //   description:
  //     "Flutter Developer | Full Stack Developer | Freelancer. Focused on interfaces and experiences, working remotely from Pakistan.",
  //   creator: "khizr__",
  //   creatorId: "1243720976552144897",
  //   images: [
  //     "https://drive.google.com/file/d/1avC7QzfHz3M30STAdvk5BAfus3bt6DC7/view?usp=sharing",
  //   ],
  // },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
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
    <html lang="en">
      <body
        className={`${syne.className} scroll-smooth pl-0 scrollbar-thin scrollbar-track-[#0E1016] scrollbar-thumb-[#212531]`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

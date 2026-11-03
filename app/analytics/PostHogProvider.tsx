"use client";

import { useEffect, ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      "phc_oTcqvUJH4RrrXWjHuqmedr6XF99zZfDz7oCd34XLNNCd";

    if (typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(key, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        disable_session_recording: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            ph.debug();
          }
        },
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

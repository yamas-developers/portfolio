"use client";

import posthog from "posthog-js";

export const captureEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) => {
  if (typeof window === "undefined") return;
  try {
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  } catch {
    // Graceful no-op
  }
};

export default posthog;

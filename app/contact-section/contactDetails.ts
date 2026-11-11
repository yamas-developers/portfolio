export const projectEmail = "khizr@khizr.net";

export const projectEmailHref =
  `mailto:${projectEmail}?subject=Let%27s%20work%20together`;

export const triggerEmailToast = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-email-toast"));
  }
};

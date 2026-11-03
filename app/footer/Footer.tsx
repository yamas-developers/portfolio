"use client";

import { captureEvent } from "../analytics/posthog";

export default function Footer() {
  const onSocialClick = (platform: string, url: string) => {
    captureEvent("social_link_click", { platform, url });
  };

  return (
    <footer className="shell footer">
      <p>© {new Date().getFullYear()} Muhammad Khizr</p>
      <div>
        <a
          href="https://github.com/yamas-developers"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            onSocialClick("github", "https://github.com/yamas-developers")
          }
        >
          GitHub ↗
        </a>
        <a
          href="https://www.linkedin.com/in/muhamad-khizr/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            onSocialClick(
              "linkedin",
              "https://www.linkedin.com/in/muhamad-khizr/"
            )
          }
        >
          LinkedIn ↗
        </a>
        <a
          href="#home"
          onClick={() => captureEvent("back_to_top_click")}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

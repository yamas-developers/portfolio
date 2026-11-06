"use client";

import { captureEvent } from "../analytics/posthog";

export default function Footer() {
  const onSocialClick = (platform: string, url: string) => {
    captureEvent("social_link_click", { platform, url });
  };

  return (
    <footer className="shell footer-wrap">
      <div className="footer-glass-card" aria-label="Site copyright and footer links">
        <p className="footer-copyright">© {new Date().getFullYear()} Muhammad Khizr</p>
        <div className="footer-links">
          <a
            href="https://github.com/yamas-developers"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              onSocialClick("github", "https://github.com/yamas-developers")
            }
          >
            GitHub <span aria-hidden="true">↗</span>
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
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            href="#home"
            onClick={() => captureEvent("back_to_top_click")}
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

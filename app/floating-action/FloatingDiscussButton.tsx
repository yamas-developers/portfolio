"use client";

import { useEffect, useState } from "react";
import { projectEmailHref, triggerEmailToast } from "../contact-section/contactDetails";
import { captureEvent } from "../analytics/posthog";

export default function FloatingDiscussButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let topInView = true;
    let bottomInView = false;

    const checkVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isNearTop = scrollY < 120;
      const scrollBottom =
        scrollY + window.innerHeight >=
        (document.documentElement.scrollHeight || document.body.scrollHeight) -
          120;

      const shouldShow =
        !isNearTop && !scrollBottom && !topInView && !bottomInView;
      setIsVisible(shouldShow);
    };

    const topTarget =
      document.querySelector(".hero-actions") || document.getElementById("home");
    const contactTarget =
      document.querySelector(".contact-action") ||
      document.getElementById("contact");
    const footerTarget = document.querySelector("footer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === topTarget) {
            topInView = entry.isIntersecting;
          }
          if (entry.target === contactTarget || entry.target === footerTarget) {
            // Check if either contact or footer is in view
            const contactRect = contactTarget?.getBoundingClientRect();
            const footerRect = footerTarget?.getBoundingClientRect();
            const contactVisible =
              Boolean(contactRect && contactRect.top < window.innerHeight && contactRect.bottom > 0);
            const footerVisible =
              Boolean(footerRect && footerRect.top < window.innerHeight && footerRect.bottom > 0);
            bottomInView = contactVisible || footerVisible;
          }
        });
        checkVisibility();
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    if (topTarget) observer.observe(topTarget);
    if (contactTarget) observer.observe(contactTarget);
    if (footerTarget) observer.observe(footerTarget);

    const onScroll = () => {
      checkVisibility();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = () => {
    triggerEmailToast();
    captureEvent("contact_click", {
      location: "floating_action_button",
      target: "mailto",
    });
  };

  return (
    <aside aria-label="Quick contact action">
      <a
        href={projectEmailHref}
        className={`floating-discuss-btn${isVisible ? " is-visible" : ""}`}
        onClick={handleClick}
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={!isVisible}
        aria-label="Discuss a project via email"
      >
        <span>Discuss a project</span>
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}

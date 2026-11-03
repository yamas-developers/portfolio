"use client";

import { useEffect } from "react";

const sectionIds = ["home", "work", "experience", "feedback", "contact"];

export default function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    root.classList.add("motion-ready");

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const revealObserver = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.14, rootMargin: "0px 0px -8%" }
        );

    revealElements.forEach((element) => revealObserver?.observe(element));

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav-links a")
    );
    const setActiveLink = (id: string) => {
      navLinks.forEach((link) => {
        const active = link.hash === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    let scrollFrame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.38;
        const activeSection = sectionIds
          .map((id) => document.getElementById(id))
          .filter((section): section is HTMLElement => Boolean(section))
          .filter((section) => section.getBoundingClientRect().top <= marker)
          .at(-1);

        setActiveLink(activeSection?.id ?? "home");
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      root.classList.remove("motion-ready");
      revealObserver?.disconnect();
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  return null;
}

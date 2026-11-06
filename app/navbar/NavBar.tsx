"use client";

import { useEffect, useState } from "react";
import { captureEvent } from "../analytics/posthog";

export default function NavBar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    let initial: "light" | "dark" = "light";
    try {
      const saved = localStorage.getItem("khizr-studio-theme");
      if (saved === "dark" || saved === "light") {
        initial = saved;
      } else if (
        root.dataset.theme === "dark" ||
        root.dataset.theme === "light"
      ) {
        initial = root.dataset.theme;
      }
    } catch {}
    root.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("khizr-studio-theme", nextTheme);
    } catch {}
    setTheme(nextTheme);
    captureEvent("theme_toggle", { theme: nextTheme });
  };

  const onNavClick = (section: string) => {
    captureEvent("nav_click", { section });
  };

  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <a
          href="#home"
          className="brand"
          aria-label="Muhammad Khizr home"
          onClick={() => onNavClick("home")}
        >
          MK<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#introduction" onClick={() => onNavClick("introduction")}>
            Introduction
          </a>
          <a href="#work" onClick={() => onNavClick("work")}>
            Work
          </a>
          <a href="#feedback" onClick={() => onNavClick("feedback")}>
            Feedback
          </a>
          <a href="#experience" onClick={() => onNavClick("experience")}>
            Experience
          </a>
          <a href="#contact" onClick={() => onNavClick("contact")}>
            Contact
          </a>
        </div>
        <button
          className="theme-toggle"
          id="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <span aria-hidden="true">◐</span>
          <span id="theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </header>
  );
}

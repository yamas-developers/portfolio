"use client";

import { useEffect, useState } from "react";

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
  };

  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <a href="#home" className="brand" aria-label="Muhammad Khizr home">
          MK<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#feedback">Feedback</a>
          <a href="#contact">Contact</a>
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

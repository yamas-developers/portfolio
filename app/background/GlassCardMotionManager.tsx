"use client";

import { useEffect } from "react";

/**
 * Universal 3D Perspective Tilt, Specular Glare, and Revolving 3D Cylinder Scroll Manager
 * 1. Interactive 3D hover physics on ALL glass cards (including Work & Experience headers).
 * 2. 3D Revolving Cylinder Scroll: tilts cards as they travel through the viewport circle.
 */
export default function GlassCardMotionManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let activeCard: HTMLElement | null = null;
    let cardRect: DOMRect | null = null;
    let glareEl: HTMLElement | null = null;
    let rafMoveId: number | null = null;
    let rafScrollId: number | null = null;

    const findGlassCard = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof HTMLElement)) return null;
      return target.closest<HTMLElement>(
        ".hero-glass-slab, .glass-portrait-card, .feedback-heading, .work-heading, .about-intro, .contact-section, .footer-glass-card, .project-card, .about-section .capabilities > div, .work-section.glass-slab-outer, .about-section.glass-slab-outer"
      );
    };

    // Calculate natural revolving cylindrical transform based on scroll position
    const getRevolvingTransform = (el: HTMLElement): string => {
      const isRevolving = document.documentElement.dataset.revolvingScroll !== "off";
      if (!isRevolving) return "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

      const rect = el.getBoundingClientRect();
      const viewCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const normOffset = (elCenter - viewCenter) / (window.innerHeight * 0.75);
      const clamped = Math.max(-1.25, Math.min(1.25, normOffset));

      const isLarge =
        el.classList.contains("hero-glass-slab") ||
        el.classList.contains("contact-section") ||
        el.classList.contains("feedback-heading");

      const maxDeg = isLarge ? 7.5 : 11;
      const rotX = (clamped * maxDeg).toFixed(2);
      const sc = (1 - Math.abs(clamped) * 0.035).toFixed(3);
      const tz = (Math.abs(clamped) * -22).toFixed(1);

      return `perspective(1400px) rotateX(${rotX}deg) scale3d(${sc}, ${sc}, ${sc}) translateZ(${tz}px)`;
    };

    const updateAllRevolvingTransforms = () => {
      const isRevolving = document.documentElement.dataset.revolvingScroll !== "off";
      const cards = document.querySelectorAll<HTMLElement>(
        ".hero-glass-slab, .feedback-heading, .work-heading, .about-intro, .contact-section, .footer-glass-card, .project-card, .about-section .capabilities > div, .work-section.glass-slab-outer, .about-section.glass-slab-outer"
      );

      cards.forEach((card) => {
        if (card === activeCard) return; // Don't override currently hovered card
        if (isRevolving) {
          card.style.transform = getRevolvingTransform(card);
          card.style.transition = "transform 140ms ease-out, box-shadow 200ms ease";
        } else {
          card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
          card.style.transition = "transform 400ms ease-out, box-shadow 200ms ease";
        }
      });
    };

    const resetCard = (card: HTMLElement) => {
      card.style.transform = getRevolvingTransform(card);
      card.style.transition = "transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 300ms ease";
      const glare = card.querySelector<HTMLElement>(".glass-card-glare");
      if (glare) glare.style.opacity = "0";
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (window.matchMedia("(hover: none)").matches) return;
      const card = findGlassCard(e.target);
      if (!card) return;

      if (activeCard !== card) {
        if (activeCard) resetCard(activeCard);
        activeCard = card;
        cardRect = card.getBoundingClientRect();

        glareEl = card.querySelector<HTMLElement>(".glass-card-glare");
        if (!glareEl) {
          glareEl = document.createElement("div");
          glareEl.className = "glass-card-glare";
          glareEl.setAttribute("aria-hidden", "true");
          card.appendChild(glareEl);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeCard || window.matchMedia("(hover: none)").matches) return;

      const rawIntensity = getComputedStyle(document.documentElement)
        .getPropertyValue("--card-motion-intensity")
        .trim();
      const intensity = rawIntensity ? parseFloat(rawIntensity) : 0.65;

      if (intensity <= 0.02) {
        resetCard(activeCard);
        return;
      }

      if (rafMoveId) cancelAnimationFrame(rafMoveId);
      rafMoveId = requestAnimationFrame(() => {
        if (!activeCard) return;
        cardRect = activeCard.getBoundingClientRect();

        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;

        const normX = x / cardRect.width - 0.5;
        const normY = y / cardRect.height - 0.5;

        const isLarge =
          activeCard.classList.contains("hero-glass-slab") ||
          activeCard.classList.contains("contact-section") ||
          activeCard.classList.contains("work-section") ||
          activeCard.classList.contains("about-section");

        const isMedium =
          activeCard.classList.contains("work-heading") ||
          activeCard.classList.contains("about-intro") ||
          activeCard.classList.contains("feedback-heading") ||
          activeCard.classList.contains("footer-glass-card");

        const maxDegrees = isLarge ? 8 : isMedium ? 11.5 : 15;
        const rotateX = -(normY * maxDegrees * intensity).toFixed(2);
        const rotateY = (normX * maxDegrees * intensity).toFixed(2);
        const scale = isLarge ? 1.012 : isMedium ? 1.02 : 1.032;

        activeCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        activeCard.style.transition = "transform 80ms ease-out, box-shadow 160ms ease";

        if (glareEl) {
          const glareX = Math.round((x / cardRect.width) * 100);
          const glareY = Math.round((y / cardRect.height) * 100);
          const glareRadius = isLarge ? 420 : 240;
          const glareOpacity = (0.42 * intensity).toFixed(2);

          glareEl.style.background = `radial-gradient(circle ${glareRadius}px at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 80%)`;
          glareEl.style.opacity = "1";
        }
      });
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (!activeCard) return;
      if (!activeCard.contains(e.relatedTarget as Node)) {
        resetCard(activeCard);
        activeCard = null;
        cardRect = null;
        glareEl = null;
      }
    };

    const handleScroll = () => {
      if (rafScrollId) cancelAnimationFrame(rafScrollId);
      rafScrollId = requestAnimationFrame(() => {
        updateAllRevolvingTransforms();
      });
    };

    // Initial update
    updateAllRevolvingTransforms();

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafMoveId) cancelAnimationFrame(rafMoveId);
      if (rafScrollId) cancelAnimationFrame(rafScrollId);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return null;
}

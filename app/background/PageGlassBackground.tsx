/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";

export default function PageGlassBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance-optimized mouse-tracking for physical glass specular light reflection
  useEffect(() => {
    let ticking = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = 300;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
            containerRef.current.style.setProperty("--mouse-y", `${mouseY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="page-glass-layer-root" aria-hidden="true">
      {/* LAYER 0: Ambient Color Mesh (Single-pass hardware composited Warm Gourmet background) */}
      <div className="site-ambient-mesh" />

      {/* LAYER 0.5: Static Gourmet Botanical & Spices Layer (Zero GPU Blur Overhead, pure hardware compositing) */}
      <div className="ambient-culinary-accents" aria-hidden="true">
        <img
          src="/ambient-herbs-top.png"
          alt=""
          className="culinary-herb-top"
          loading="eager"
          decoding="async"
        />
        <img
          src="/ambient-herbs-right.png"
          alt=""
          className="culinary-herb-right"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* LAYER 1: Optical Frosted Glass Veil (With Noise Grain & Reactive Specular Flare) */}
      <div className="page-glass-veil" />
    </div>
  );
}

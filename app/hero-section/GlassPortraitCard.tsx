"use client";

import { useRef, useState, PointerEvent } from "react";
import Image from "next/image";
import profile from "../../public/profile-portrait.webp";

export default function GlassPortraitCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates from -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Read motion factor from CSS variable
    const rawIntensity = getComputedStyle(document.documentElement).getPropertyValue("--card-motion-intensity").trim();
    const factor = rawIntensity ? parseFloat(rawIntensity) : 0.65;
    if (factor <= 0.02) {
      setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    // Calculate 3D tilt angles (Max 16 degrees tilt scaled by intensity)
    const rotateX = -(normY * 18 * factor).toFixed(2);
    const rotateY = (normX * 18 * factor).toFixed(2);
    const scale = (1 + 0.035 * factor).toFixed(3);

    // Apply interactive 3D perspective transform
    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    // Position specular light glare right under pointer
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: Number((0.45 * factor).toFixed(2)),
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Smoothly return to the natural resting angle
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="glass-portrait-container">
      <div
        ref={cardRef}
        className={`glass-portrait-card${isHovered ? " is-hovered" : " is-idle"}`}
        style={{
          transform: isHovered ? transformStyle : undefined,
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        aria-label="Interactive 3D Glass Portrait Card"
      >
        {/* Specular Inner Glass Bevel Highlight */}
        <div className="glass-card-bevel" aria-hidden="true" />

        {/* Dynamic Specular Light Glare (Follows Cursor) */}
        <div
          className="glass-card-glare"
          style={{
            background: `radial-gradient(circle 180px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)`,
            opacity: glarePos.opacity,
          }}
          aria-hidden="true"
        />

        {/* Chic Corner Star Accent (Matching Reference Glass Card) */}
        <div className="glass-card-sparkle" aria-hidden="true">
          ✦
        </div>

        {/* The Portrait Image */}
        <div className="glass-card-img-wrap">
          <Image
            src={profile}
            className="portrait glass-portrait-img"
            alt="Muhammad Khizr"
            priority
            sizes="(max-width: 767px) 64px, (max-width: 1000px) 190px, 240px"
          />
        </div>
      </div>
    </div>
  );
}

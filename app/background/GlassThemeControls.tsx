"use client";

import { useEffect, useState } from "react";

export type GlassMode = "slabs" | "panels" | "hybrid";
export type BgPalette = "warm" | "mint" | "sunset";

export default function GlassThemeControls() {
  // 1. Main Background Controls (User requested defaults: 9px blur, 16% tint)
  // 1. Main Background Controls (User requested defaults: 20px blur, 5% tint)
  const [bgBlur, setBgBlur] = useState(20);
  const [bgTint, setBgTint] = useState(5);
  const [hasNoise, setHasNoise] = useState(true);
  const [isLevitating, setIsLevitating] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  // 2. Section Cards Controls (User requested defaults: 20px blur, 45% tint, Inner Panels mode)
  const [cardBlur, setCardBlur] = useState(20);
  const [cardTint, setCardTint] = useState(45);
  const [glassMode, setGlassMode] = useState<GlassMode>("panels");

  // 3. Background Color Contrast & Palette (User requested defaults: Warm Gourmet, 100% contrast)
  const [palette, setPalette] = useState<BgPalette>("warm");
  const [bgContrast, setBgContrast] = useState(100);

  // 4. Card Motion & 3D Tilt Intensity (User requested default: 100% tilt)
  const [motionIntensity, setMotionIntensity] = useState(100);

  // 5. 3D Revolving Cylinder Scroll Effect (User requested default: ON)
  const [isRevolvingScroll, setIsRevolvingScroll] = useState(true);

  // 6. Feedback Board Stick Intensity (User requested default: 4.0x, with extended ceiling)
  const [stickIntensity, setStickIntensity] = useState(4.0);

  const [isCollapsed, setIsCollapsed] = useState(true);

  // Sync Background Blur to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-glass-blur", `${bgBlur}px`);
  }, [bgBlur]);

  // Sync Background Tint Opacity
  useEffect(() => {
    const factor = bgTint / 100;
    const alpha = factor.toFixed(2);

    const updateBgTint = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      if (isDark) {
        document.documentElement.style.setProperty(
          "--bg-glass-fill",
          `rgba(17, 27, 22, ${alpha})`
        );
      } else {
        if (palette === "warm") {
          document.documentElement.style.setProperty(
            "--bg-glass-fill",
            `rgba(247, 243, 235, ${alpha})`
          );
        } else {
          document.documentElement.style.setProperty(
            "--bg-glass-fill",
            `rgba(243, 245, 243, ${alpha})`
          );
        }
      }
    };

    updateBgTint();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "data-theme") updateBgTint();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [bgTint, palette]);

  // Sync Section Cards Blur to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--card-glass-blur", `${cardBlur}px`);
  }, [cardBlur]);

  // Sync Section Cards Tint & Gradient Fills (Applies to all section cards)
  useEffect(() => {
    const factor = cardTint / 100;

    const updateCardTint = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      if (isDark) {
        const topAlpha = (factor * 0.70).toFixed(2);
        const botAlpha = (factor * 0.45).toFixed(2);
        const borderAlpha = (0.10 + factor * 0.14).toFixed(2);
        const specAlpha = (0.15 + factor * 0.20).toFixed(2);

        document.documentElement.style.setProperty(
          "--card-glass-fill",
          `rgba(20, 32, 24, ${(factor * 0.65).toFixed(2)})`
        );
        document.documentElement.style.setProperty(
          "--slab-fill-top",
          `rgba(26, 42, 32, ${topAlpha})`
        );
        document.documentElement.style.setProperty(
          "--slab-fill-bottom",
          `rgba(16, 26, 20, ${botAlpha})`
        );
        document.documentElement.style.setProperty(
          "--card-glass-border",
          `rgba(255, 255, 255, ${borderAlpha})`
        );
        document.documentElement.style.setProperty(
          "--card-glass-specular",
          `inset 0 1.5px 2px 0 rgba(255, 255, 255, ${specAlpha})`
        );
        document.documentElement.style.setProperty(
          "--mini-card-fill",
          `rgba(255, 255, 255, ${(factor * 0.08).toFixed(2)})`
        );
        document.documentElement.style.setProperty(
          "--portrait-fill",
          `rgba(32, 51, 40, ${(factor * 0.40).toFixed(2)})`
        );
      } else {
        const topAlpha = (factor * 0.75).toFixed(2);
        const botAlpha = (factor * 0.40).toFixed(2);
        const borderAlpha = Math.min(1, 0.40 + factor * 0.50).toFixed(2);
        const specAlpha = Math.min(1, 0.50 + factor * 0.45).toFixed(2);

        const topFill =
          palette === "warm"
            ? `rgba(255, 252, 246, ${topAlpha})`
            : `rgba(255, 255, 255, ${topAlpha})`;
        const botFill =
          palette === "warm"
            ? `rgba(247, 241, 231, ${botAlpha})`
            : `rgba(255, 255, 255, ${botAlpha})`;

        document.documentElement.style.setProperty(
          "--card-glass-fill",
          palette === "warm"
            ? `rgba(252, 249, 242, ${(factor * 0.60).toFixed(2)})`
            : `rgba(255, 255, 255, ${(factor * 0.60).toFixed(2)})`
        );
        document.documentElement.style.setProperty("--slab-fill-top", topFill);
        document.documentElement.style.setProperty("--slab-fill-bottom", botFill);
        document.documentElement.style.setProperty(
          "--card-glass-border",
          `rgba(255, 255, 255, ${borderAlpha})`
        );
        document.documentElement.style.setProperty(
          "--card-glass-specular",
          `inset 0 1.5px 2px 0 rgba(255, 255, 255, ${specAlpha})`
        );
        document.documentElement.style.setProperty(
          "--mini-card-fill",
          `rgba(255, 255, 255, ${(factor * 0.55).toFixed(2)})`
        );
        document.documentElement.style.setProperty(
          "--portrait-fill",
          `rgba(255, 255, 255, ${(factor * 0.35).toFixed(2)})`
        );
      }
    };

    updateCardTint();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "data-theme") updateCardTint();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [cardTint, palette]);

  // Sync Glass Mode (Slabs vs Panels vs Hybrid)
  useEffect(() => {
    document.documentElement.dataset.glassMode = glassMode;
  }, [glassMode]);

  // Sync Background Palette & Contrast
  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    const contrastVal = (0.85 + (bgContrast / 100) * 0.95).toFixed(2);
    const saturateVal = (1.0 + (bgContrast / 100) * 0.95).toFixed(2);
    document.documentElement.style.setProperty("--mesh-contrast", contrastVal);
    document.documentElement.style.setProperty("--mesh-saturate", saturateVal);
    document.documentElement.style.setProperty(
      "--ambient-opacity",
      Math.min(1, 0.55 + (bgContrast / 100) * 0.45).toFixed(2)
    );
  }, [palette, bgContrast]);

  // Sync Card Motion & Tilt Intensity
  useEffect(() => {
    const factor = (motionIntensity / 100).toFixed(2);
    document.documentElement.style.setProperty("--card-motion-intensity", factor);
  }, [motionIntensity]);

  // Sync Revolving Cylinder Scroll (🎡)
  useEffect(() => {
    document.documentElement.dataset.revolvingScroll = isRevolvingScroll ? "on" : "off";
    window.dispatchEvent(new Event("scroll"));
  }, [isRevolvingScroll]);

  // Sync Feedback Board Stick Intensity
  useEffect(() => {
    document.documentElement.style.setProperty("--feedback-pin-multiplier", String(stickIntensity));
    window.dispatchEvent(new CustomEvent("feedback-stick-change", { detail: stickIntensity }));
  }, [stickIntensity]);

  // Sync Micro-Frost Noise Texture
  useEffect(() => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (hasNoise) {
      document.documentElement.style.setProperty(
        "--glass-noise-opacity",
        isDark ? "0.045" : "0.035"
      );
    } else {
      document.documentElement.style.setProperty("--glass-noise-opacity", "0");
    }
  }, [hasNoise]);

  // Sync Floating Levitate (🎈)
  useEffect(() => {
    const stream = document.querySelector(".page-feedback-stream");
    if (!stream) return;
    if (isLevitating) {
      stream.classList.remove("levitate-disabled");
    } else {
      stream.classList.add("levitate-disabled");
    }
  }, [isLevitating]);

  // Sync Freeze / Drift
  useEffect(() => {
    const stream = document.querySelector(".page-feedback-stream");
    if (!stream) return;
    if (isFrozen) {
      stream.classList.add("stream-frozen");
    } else {
      stream.classList.remove("stream-frozen");
    }
  }, [isFrozen]);

  if (isCollapsed) {
    return (
      <button
        type="button"
        className="glass-tweak-toggle-pill"
        onClick={() => setIsCollapsed(false)}
        aria-label="Expand glass prototype controls"
      >
        <span>🎈</span>
        <span>Glass Controls</span>
      </button>
    );
  }

  const cycleMode = () => {
    if (glassMode === "slabs") setGlassMode("panels");
    else if (glassMode === "panels") setGlassMode("hybrid");
    else setGlassMode("slabs");
  };

  const cyclePalette = () => {
    if (palette === "warm") setPalette("mint");
    else if (palette === "mint") setPalette("sunset");
    else setPalette("warm");
  };

  const modeLabel =
    glassMode === "slabs"
      ? "🔲 Full Slabs"
      : glassMode === "panels"
      ? "📑 Inner Panels"
      : "✨ Both (Hybrid)";

  const paletteLabel =
    palette === "warm"
      ? "🍽️ Warm Gourmet (Reference)"
      : palette === "mint"
      ? "🌿 Mint & Emerald"
      : "🌅 Sunset Amber";

  return (
    <aside className="glass-tweak-bar" aria-label="Glass Theme Controls">
      <div className="glass-tweak-brand">
        <span>🎈 Glass Controls</span>
        <span className="glass-tweak-badge">Live</span>
      </div>

      <div className="glass-tweak-controls">
        {/* GROUP 1: Background Controls */}
        <div className="glass-control-group" aria-label="Main background controls">
          <span className="glass-group-tag">Main BG:</span>
          <div className="glass-tweak-item">
            <label htmlFor="tweak-bg-blur">Blur:</label>
            <input
              id="tweak-bg-blur"
              type="range"
              min="0"
              max="36"
              value={bgBlur}
              onChange={(e) => setBgBlur(Number(e.target.value))}
            />
            <span className="val">{bgBlur}px</span>
          </div>

          <div className="glass-tweak-item">
            <label htmlFor="tweak-bg-tint">Tint:</label>
            <input
              id="tweak-bg-tint"
              type="range"
              min="0"
              max="100"
              value={bgTint}
              onChange={(e) => setBgTint(Number(e.target.value))}
            />
            <span className="val">{bgTint}%</span>
          </div>
        </div>

        <div className="glass-tweak-divider" aria-hidden="true" />

        {/* GROUP 2: Section Cards Controls */}
        <div className="glass-control-group" aria-label="Section cards glass controls">
          <span className="glass-group-tag cards-tag">Cards Glass:</span>
          <div className="glass-tweak-item">
            <label htmlFor="tweak-card-blur">Blur:</label>
            <input
              id="tweak-card-blur"
              type="range"
              min="0"
              max="40"
              value={cardBlur}
              onChange={(e) => setCardBlur(Number(e.target.value))}
            />
            <span className="val">{cardBlur}px</span>
          </div>

          <div className="glass-tweak-item">
            <label htmlFor="tweak-card-tint">Tint:</label>
            <input
              id="tweak-card-tint"
              type="range"
              min="0"
              max="100"
              value={cardTint}
              onChange={(e) => setCardTint(Number(e.target.value))}
            />
            <span className="val">{cardTint}%</span>
          </div>

          <button
            type="button"
            className="glass-tweak-btn glass-mode-btn"
            onClick={cycleMode}
            title="Toggle Work & Experience between Full Slabs, Inner Panels, and Both"
          >
            Style: {modeLabel}
          </button>
        </div>

        <div className="glass-tweak-divider" aria-hidden="true" />

        {/* GROUP 3: Background Palette & Contrast */}
        <div className="glass-control-group" aria-label="Background color and contrast controls">
          <span className="glass-group-tag color-tag">BG Colors:</span>
          <button
            type="button"
            className="glass-tweak-btn glass-palette-btn active"
            onClick={cyclePalette}
            title="Cycle between Warm Gourmet, Mint & Emerald, and Sunset palettes"
          >
            {paletteLabel}
          </button>

          <div className="glass-tweak-item">
            <label htmlFor="tweak-bg-contrast">Contrast:</label>
            <input
              id="tweak-bg-contrast"
              type="range"
              min="0"
              max="100"
              value={bgContrast}
              onChange={(e) => setBgContrast(Number(e.target.value))}
            />
            <span className="val">{bgContrast}%</span>
          </div>
        </div>

        <div className="glass-tweak-divider" aria-hidden="true" />

        {/* GROUP 4: 3D Motion, Tilt & Revolving Scroll */}
        <div className="glass-control-group" aria-label="3D Card Motion and Revolving Scroll">
          <span className="glass-group-tag motion-tag">3D Motion:</span>
          <div className="glass-tweak-item">
            <label htmlFor="tweak-motion">Tilt:</label>
            <input
              id="tweak-motion"
              type="range"
              min="0"
              max="100"
              value={motionIntensity}
              onChange={(e) => setMotionIntensity(Number(e.target.value))}
            />
            <span className="val">{motionIntensity}%</span>
          </div>

          <button
            type="button"
            className={`glass-tweak-btn ${isRevolvingScroll ? "active" : ""}`}
            onClick={() => setIsRevolvingScroll(!isRevolvingScroll)}
            title="Toggle cylindrical revolving 3D scroll effect on all widgets"
          >
            🎡 Revolving: {isRevolvingScroll ? "ON" : "OFF"}
          </button>
        </div>

        <div className="glass-tweak-divider" aria-hidden="true" />

        {/* GROUP 5: Feedback Board Stick Intensity */}
        <div className="glass-control-group" aria-label="Feedback Board Pin Intensity">
          <span className="glass-group-tag stick-tag">Board Pin:</span>
          <div className="glass-tweak-item">
            <label htmlFor="tweak-stick">Stick:</label>
            <input
              id="tweak-stick"
              type="range"
              min="0.5"
              max="12.0"
              step="0.1"
              value={stickIntensity}
              onChange={(e) => setStickIntensity(Number(e.target.value))}
            />
            <span className="val">{stickIntensity.toFixed(1)}x</span>
          </div>
        </div>

        <div className="glass-tweak-divider" aria-hidden="true" />

        {/* GROUP 6: Actions / Utilities */}
        <div className="glass-utility-group">
          <button
            type="button"
            className={`glass-tweak-btn ${hasNoise ? "active" : ""}`}
            onClick={() => setHasNoise(!hasNoise)}
            title="Toggle micro-frost noise texture"
          >
            ✨ Grain: {hasNoise ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            className={`glass-tweak-btn ${isLevitating ? "active" : ""}`}
            onClick={() => setIsLevitating(!isLevitating)}
            title="Toggle card floating bobbing"
          >
            🎈 Levitate: {isLevitating ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            className={`glass-tweak-btn ${isFrozen ? "active" : ""}`}
            onClick={() => setIsFrozen(!isFrozen)}
            title="Pause/Resume stream scrolling"
          >
            {isFrozen ? "▶ Resume" : "⏸ Freeze"}
          </button>

          <button
            type="button"
            className="glass-tweak-btn glass-tweak-hide"
            onClick={() => setIsCollapsed(true)}
            title="Minimize toolbar"
          >
            Hide ✕
          </button>
        </div>
      </div>
    </aside>
  );
}

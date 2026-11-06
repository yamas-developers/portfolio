"use client";

import { useEffect, useRef } from "react";
import { feedbackReviews, FeedbackReview } from "../feedback-section/feedbackReviews";
import { cardQuote, stars } from "../feedback-section/feedbackText";

// Sourced directly from the live feedback section card dataset (16 top client reviews)
const STREAM_COLUMNS: FeedbackReview[][] = [
  feedbackReviews.slice(0, 4),
  feedbackReviews.slice(4, 8),
  feedbackReviews.slice(8, 12),
  feedbackReviews.slice(12, 16),
];

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
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div ref={containerRef} className="page-glass-layer-root" aria-hidden="true">
      {/* LAYER 0: Ambient Color Mesh Orbs (provides glowing color depth for the glass to refract) */}
      <div className="site-ambient-mesh">
        <div className="mesh-orb-1" />
        <div className="mesh-orb-2" />
        <div className="mesh-orb-3" />
        <div className="mesh-orb-4" />
      </div>

      {/* LAYER 1: Full-Page Continuous Auto-Scrolling & Levitating Feedback Cards */}
      <div className="page-feedback-stream">
        <div className="page-stream-grid">
          {STREAM_COLUMNS.map((colReviews, colIdx) => {
            const isUp = colIdx % 2 === 0;
            const colClass = `stream-col ${
              isUp ? "stream-drift-up" : "stream-drift-down"
            } ${colIdx >= 2 ? "col-desktop-only" : ""}`;

            // Duplicate cards for seamless, glitch-free continuous vertical loop
            const loopCards = [...colReviews, ...colReviews];

            return (
              <div key={colIdx} className={colClass}>
                {loopCards.map((review, idx) => (
                  <div
                    key={`${review.id}-${idx}`}
                    className="review-card page-bg-card"
                    tabIndex={-1}
                  >
                    <div className="card-rating">
                      <span className="card-stars">{stars(review.rating)}</span>
                      <span className="card-platform-pill">{review.platform} • 5.0</span>
                    </div>
                    <div className="card-quote">
                      “{cardQuote(review)}”
                    </div>
                    <div className="card-author">
                      <span className="avatar">
                        {review.author[0].toUpperCase()}
                      </span>
                      <span>
                        {review.author}
                        <small>{review.subtitle}</small>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* LAYER 2: Optical Frosted Glass Veil (With Noise Grain & Reactive Specular Flare) */}
      <div className="page-glass-veil" />
    </div>
  );
}

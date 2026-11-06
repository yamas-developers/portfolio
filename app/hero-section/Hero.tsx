"use client";

import { projectEmailHref, triggerEmailToast } from "../contact-section/contactDetails";
import { captureEvent } from "../analytics/posthog";
import GlassPortraitCard from "./GlassPortraitCard";

export default function Hero() {
  return (
    <div className="shell hero-outer-wrap">
      <section className="hero hero-glass-slab" id="home" aria-labelledby="hero-title">
        <span id="introduction" className="anchor-alias" aria-hidden="true" />
        {/* Top Micro-Bar inside Slab (Inspired by UI Reference) */}
        <div className="slab-top-bar" aria-label="Professional status">
          <div className="slab-top-left">
            <span className="slab-tag-brand">Muhammad Khizr</span>
            <span className="slab-tag-sep" aria-hidden="true">•</span>
            <span className="slab-tag-role">Full Stack Engineer</span>
          </div>
          <div className="slab-top-right">
            <span className="slab-nav-item slab-status-pill">
              <span className="status-dot-pulse" aria-hidden="true" />
              Available for Projects
            </span>
          </div>
        </div>

        {/* Hero Main Grid: Copy on left, 3D Portrait on right */}
        <div className="hero-main-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Mobile apps.
              <br />
              <span>Built end to end.</span>
            </h1>
            <p className="hero-description">
              Flutter apps, Laravel backends, and web platforms. I turn product
              ideas into software people can use.
            </p>
            <div className="hero-actions">
              <a
                className="button primary slab-capsule-btn"
                href="#work"
                onClick={() => captureEvent("view_work_click", { location: "hero" })}
              >
                View work <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button secondary slab-secondary-btn"
                href={projectEmailHref}
                onClick={() => {
                  triggerEmailToast();
                  captureEvent("contact_click", {
                    location: "hero",
                    target: "mailto",
                  });
                }}
              >
                Discuss a project <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Mini Frosted Glass Cards (Inspired by the preview cards in the reference image) */}
            <div className="slab-mini-cards-row">
              <div className="slab-mini-card">
                <span className="mini-card-icon" aria-hidden="true">📱</span>
                <div className="mini-card-info">
                  <strong>Flutter & Dart</strong>
                  <small>iOS & Android native feel</small>
                </div>
              </div>
              <div className="slab-mini-card">
                <span className="mini-card-icon" aria-hidden="true">⚡</span>
                <div className="mini-card-info">
                  <strong>Laravel & APIs</strong>
                  <small>Scalable cloud backends</small>
                </div>
              </div>
              <div className="slab-mini-card">
                <span className="mini-card-icon" aria-hidden="true">⭐</span>
                <div className="mini-card-info">
                  <strong>5.0 / 100% JSS</strong>
                  <small>95+ verified reviews</small>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Portrait Card */}
          <div className="portrait-wrap slab-portrait-column">
            <GlassPortraitCard />
            <div className="slab-floating-badge" aria-hidden="true">
              <span className="badge-sparkle">✦</span>
              <span>6+ Years Experience</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

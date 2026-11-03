"use client";

import { developmentExperience } from "./developmentExperience";
import { captureEvent } from "../analytics/posthog";

export default function About() {
  return (
    <section
      className="shell about-section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <span id="about" className="anchor-alias" aria-hidden="true" />
      <div className="about-intro">
        <p className="eyebrow">Development experience</p>
        <h2 id="experience-title">
          The app. The backend.
          <br />
          <span>The person behind both.</span>
        </h2>
        <p>
          I’m Khizr, a full stack developer based in Pakistan. I work across
          mobile apps, websites, and the backend systems that connect them.
        </p>
        <p>
          My work spans Flutter, React Native and Expo, Laravel, Node.js,
          Firebase, WordPress, and Next.js across different projects.
        </p>
        <a
          className="text-link"
          href="https://docs.google.com/document/d/1E2_jcAz_NKCHMYEzyoomG8Nwh7kO4LyjIIPMu3kVAAs/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => captureEvent("resume_view_click", { destination: "google_docs" })}
        >
          View résumé <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="capabilities">
        {developmentExperience.map((item, index) => (
          <div key={item.title}>
            <span className="capability-label">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p className="experience-tools">{item.technologies}</p>
            <p className="experience-evidence">{item.evidence}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

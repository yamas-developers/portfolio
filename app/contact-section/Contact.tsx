"use client";

import { projectEmailHref, triggerEmailToast } from "./contactDetails";
import { captureEvent } from "../analytics/posthog";

export default function Contact() {
  return (
    <section
      className="shell contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div>
        <p className="contact-intro">Have a product in mind?</p>
        <h2 id="contact-title">
          Let’s build
          <br />
          what’s next<span>.</span>
        </h2>
      </div>
      <div className="contact-action">
        <p>
          Tell me what you’re building, where you need help, and your timeline.
        </p>
        <a
          className="button primary slab-capsule-btn contact-capsule-btn"
          href={projectEmailHref}
          onClick={() => {
            triggerEmailToast();
            captureEvent("contact_click", {
              location: "contact_section",
              target: "mailto",
            });
          }}
        >
          Discuss a project <span aria-hidden="true" className="slab-btn-arrow slab-btn-arrow-up-right">↗</span>
        </a>
        <p className="fiverr-note">
          Visiting from Fiverr? Please continue in our Fiverr chat.
        </p>
      </div>
    </section>
  );
}

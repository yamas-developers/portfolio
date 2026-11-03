import { projectEmailHref } from "./contactDetails";

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
        <a className="button primary" href={projectEmailHref}>
          Discuss a project <span aria-hidden="true">↗</span>
        </a>
        <p className="fiverr-note">
          Visiting from Fiverr? Please continue in our Fiverr chat.
        </p>
      </div>
    </section>
  );
}

import Image from "next/image";
import profile from "../../public/profile-portrait.webp";
import { projectEmailHref } from "../contact-section/contactDetails";

export default function Hero() {
  return (
    <section className="shell hero" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="identity">
          Muhammad Khizr <span>Full stack developer</span>
        </p>
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
          <a className="button primary" href="#work">
            View work <span aria-hidden="true">↗</span>
          </a>
          <a className="button secondary" href={projectEmailHref}>
            Discuss a project <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="portrait-wrap">
        <Image
          src={profile}
          className="portrait"
          alt="Muhammad Khizr"
          priority
          sizes="(max-width: 767px) 64px, (max-width: 1000px) 190px, 240px"
        />
      </div>
    </section>
  );
}

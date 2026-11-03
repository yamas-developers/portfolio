import Hero from "./hero-section/Hero";
import NavBar from "./navbar/NavBar";
import Work from "./work-section/Work";
import About from "./about-section/About";
import Feedback from "./feedback-section/Feedback";
import Contact from "./contact-section/Contact";
import Footer from "./footer/Footer";
import MotionController from "./animations/MotionController";

export default function Home() {
  return (
    <>
      <MotionController />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Feedback />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

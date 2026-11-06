import Hero from "./hero-section/Hero";
import NavBar from "./navbar/NavBar";
import Work from "./work-section/Work";
import Feedback from "./feedback-section/Feedback";
import About from "./about-section/About";
import Contact from "./contact-section/Contact";
import Footer from "./footer/Footer";
import MotionController from "./animations/MotionController";
import FloatingDiscussButton from "./floating-action/FloatingDiscussButton";
import EmailToast from "./floating-action/EmailToast";
import PageGlassBackground from "./background/PageGlassBackground";
import GlassThemeControls from "./background/GlassThemeControls";
import GlassCardMotionManager from "./background/GlassCardMotionManager";

export default function Home() {
  return (
    <>
      <MotionController />
      <PageGlassBackground />
      <GlassThemeControls />
      <GlassCardMotionManager />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar />
      <main id="main">
        <Hero />
        <Work />
        <Feedback />
        <About />
        <Contact />
        <Footer />
      </main>
      <FloatingDiscussButton />
      <EmailToast />
    </>
  );
}

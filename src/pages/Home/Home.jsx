import { useEffect } from "react";
import IntroOverlay from "@/components/effects/IntroOverlay";
import Hero from "./sections/Hero";
import AboutQuick from "./sections/AboutQuick";
import FeaturedProjects from "./sections/FeaturedProjects";
import ContactCTA from "./sections/ContactCTA";
import Footer from "@/components/layout/Footer";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useHomeIntro from "@/hooks/useHomeIntro";

export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { phase, skip, onLineComplete } = useHomeIntro(prefersReducedMotion);

  useEffect(() => {
    document.body.dataset.homeIntroPhase = phase;

    return () => {
      delete document.body.dataset.homeIntroPhase;
    };
  }, [phase]);

  return (
    <>
      <Hero phase={phase} prefersReducedMotion={prefersReducedMotion} />
      <IntroOverlay
        phase={phase}
        onLineComplete={onLineComplete}
        onSkip={skip}
      />
      <AboutQuick />
      <FeaturedProjects />
      <ContactCTA />
      <Footer />
    </>
  );
}

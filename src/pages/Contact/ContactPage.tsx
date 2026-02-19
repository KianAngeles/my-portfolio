import { useEffect, useState } from "react";
import LightRays from "@/components/LightRays";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "./sections/ContactFormSection";
import useIsMobile from "@/hooks/useIsMobile";

export default function ContactPage() {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });

  useEffect(() => {
    const body = document.body;
    if (!body) return undefined;

    const syncTheme = () => {
      setIsDarkMode(body.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="contact-page relative isolate min-h-screen overflow-x-clip bg-gradient-to-b from-slate-50 via-sky-50/70 to-white dark:from-navy dark:to-navy-light">
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.62) 74%, rgba(0,0,0,0.36) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.62) 74%, rgba(0,0,0,0.36) 100%)",
        }}
        aria-hidden="true"
      >
        {isDarkMode && !isMobile && (
          <LightRays
            raysOrigin="top-center"
            raysColor="#7dd3fc"
            raysSpeed={0.72}
            lightSpread={0.95}
            rayLength={3.1}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.08}
            distortion={0.015}
            pulsating={false}
            fadeDistance={1.1}
            saturation={1.35}
            className="opacity-95 [filter:saturate(130%)_brightness(1.12)_contrast(1.05)]"
          />
        )}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-b from-[#1e3a8a14] via-[#0b11274a] to-[#0206172a]"
              : "bg-gradient-to-b from-white/55 via-sky-100/35 to-transparent"
          }`}
        />
      </div>

      <div className="relative z-10">
        <ContactFormSection />
        <Footer />
      </div>
    </main>
  );
}

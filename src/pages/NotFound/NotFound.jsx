import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LightRays from "@/components/LightRays";

export default function NotFound() {
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
    <main
      className={`relative isolate min-h-screen overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-b from-navy via-navy-light to-[#102f58]"
          : "bg-white"
      }`}
    >
      {isDarkMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#7dd3fc"
            raysSpeed={0.72}
            lightSpread={0.95}
            rayLength={3.2}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.08}
            distortion={0.015}
            pulsating={false}
            fadeDistance={1.1}
            saturation={1.3}
            className="opacity-90 [filter:saturate(120%)_brightness(1.08)]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f3f70] via-[#0b1f3f7a] to-[#0b1f3fc4]" />
          <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[460px] w-[460px] rounded-full bg-accent/18 blur-[140px]" />
        </div>
      )}

      <section className="container-wrapper flex min-h-[calc(100vh-96px)] items-center py-28 md:py-32">
        <div
          className={`w-full p-8 sm:p-10 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.24em] ${
              isDarkMode ? "text-white/70" : "text-slate-700"
            }`}
          >
            Error 404
          </p>
          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {isDarkMode ? "Lost At Sea?" : "Page Not Found"}
          </h1>
          {isDarkMode ? (
            <>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
                Looks like this page drifted off course. The link may be
                broken, or the route no longer exists.
              </p>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
                Let&apos;s navigate you back to safer waters.
              </p>
            </>
          ) : (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 sm:text-xl">
              We couldn&apos;t find the page you requested. It may have been
              removed or relocated..
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/"
              className="btn-primary inline-flex items-center px-8 py-4 text-base sm:text-lg"
            >
              Back Home
            </Link>
            <Link
              to="/projects"
              className={`inline-flex items-center rounded-2xl border px-8 py-4 text-base font-semibold transition-colors duration-200 sm:text-lg ${
                isDarkMode
                  ? "border-white/35 text-white hover:bg-white hover:text-navy"
                  : "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              }`}
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

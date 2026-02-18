import { useEffect, useRef, useState } from "react";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import "./story-section.css";

// TODO: Replace placeholder copy with your finalized professional story.
const STORY_PARAGRAPHS = [
  "I build software with an editorial mindset: every detail has intent, every interaction has a purpose, and every line of code should earn its place. I care about systems that feel quiet and confident, not noisy or overdesigned.",
  "Over the years, I have learned that strong products are shaped by balance. Speed matters, but so does structure. A polished interface means little without reliable foundations, and robust architecture means little if the experience feels heavy.",
  "Today, I focus on creating full-stack products that stay clear under pressure, scale without chaos, and make complex workflows feel simple. The goal is always the same: deliver outcomes that are thoughtful, usable, and built to last.",
];

// TODO: Swap these quote chips with your final personal philosophy lines.
const STORY_QUOTES = [
  "Ship fast, keep it clean.",
  "Performance and UX matter equally.",
];

function revealClass(isVisible: boolean) {
  return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";
}

export default function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24" aria-labelledby="story-section-title">
      <SectionRadialGlowAlt />

      <div className="container-wrapper max-w-6xl">
        <header
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass(isVisible)}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Who I Am</p>
          <h2 id="story-section-title" className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Beyond the Code
          </h2>
          <span className="mx-auto mt-5 block h-px w-14 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        </header>

        <article
          className={`story-card-ring group relative mx-auto mt-10 overflow-hidden rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass(isVisible)}`}
          style={{ transitionDelay: "120ms" }}
        >
          <div className="story-card-inner rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-lg leading-relaxed text-white/85 backdrop-blur-sm md:p-10">
            <div className="space-y-6">
              {STORY_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-base font-semibold text-white">Kian Charles S. Angeles</p>
              <p className="mt-1 text-sm text-white/60">Full Stack Developer</p>
            </div>
          </div>
        </article>

        <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
          {STORY_QUOTES.map((quote, index) => (
            <blockquote
              key={quote}
              className={`rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-medium text-white/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/35 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_14px_30px_-22px_rgba(96,165,250,0.8)] ${revealClass(isVisible)}`}
              style={{ transitionDelay: `${220 + index * 120}ms` }}
            >
              "{quote}"
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

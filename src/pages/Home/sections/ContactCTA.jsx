import { useState } from "react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@appletosolutions/reactbits";
import "./contactCta.css";
import { profile } from "@/data/profile";
import { Send } from "@/components/animate-ui/icons/send";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { Clock } from "@/components/animate-ui/icons/clock";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";

const CONTACT_CTA_SEEN_KEY = "homeContactCTASeen";

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M7 10v7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path
        d="M11 10v7m0-4.5c0-1.6 1.1-2.5 2.4-2.5 1.5 0 2.6.9 2.6 3v4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M9 19c-4.5 1.5-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.7-.5-2.4 2.3-.3 4.8-1.1 4.8-5A3.9 3.9 0 0 0 18 5.5 3.6 3.6 0 0 0 17.9 2s-1 .3-3.2 2a11 11 0 0 0-5.8 0C6.6 2.3 5.6 2 5.6 2a3.6 3.6 0 0 0-.1 3.5A3.9 3.9 0 0 0 4.2 8c0 3.9 2.5 4.7 4.8 5-.4.3-.5.9-.5 1.7V19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M14 8.5h2.5V6h-2.1c-2 0-3.4 1.2-3.4 3.5V12H8.5v2.5H11V20h2.5v-5.5h2.3L16 12h-2.5V9.8c0-.8.4-1.3 1.2-1.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const INFO_ROWS = [
  {
    title: "Email",
    detail: "angeleskiancharles@gmail.com",
    statusClass: "bg-blue-400",
    Icon: Send,
  },
  {
    title: "Availability",
    detail: "Open for new projects",
    statusClass: "bg-green-400",
    Icon: BadgeCheck,
  },
  {
    title: "Response Time",
    detail: "Usually within 24 hours",
    statusClass: "bg-indigo-400",
    Icon: Clock,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.08, ease: "easeOut" },
  }),
};

function InfoCard({ title, detail, Icon, index, statusClass }) {
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem(CONTACT_CTA_SEEN_KEY) !== "1";
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial={shouldAnimate ? "hidden" : false}
      whileInView={shouldAnimate ? "show" : undefined}
      animate={shouldAnimate ? undefined : "show"}
      viewport={shouldAnimate ? { once: true, amount: 0.4 } : undefined}
      onViewportEnter={() => {
        if (!shouldAnimate) return;
        window.sessionStorage.setItem(CONTACT_CTA_SEEN_KEY, "1");
        setShouldAnimate(false);
      }}
      className="h-full"
    >
      <div
        className="group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={() => setIsHovered(false)}
      >
        <SpotlightCard
          className="rounded-2xl border border-navy/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5"
          spotlightColor="rgba(37, 99, 235, 0.22)"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy/10 bg-white text-black dark:border-white/10 dark:bg-white/10 dark:text-white">
                <Icon
                  animate={isHovered}
                  className="h-5 w-5 text-black transition-colors duration-300 dark:text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="flex items-center text-base font-semibold text-navy dark:text-white">
                {title}
                <span
                  className={`mx-2 h-2 w-2 rounded-full ${statusClass}`}
                  aria-hidden="true"
                />
              </p>
            </div>
            <p className="min-w-0 flex-1 text-right text-base text-navy/70 break-words dark:text-white/70">
              {detail}
            </p>
          </div>
        </SpotlightCard>
      </div>
    </motion.div>
  );
}

export default function ContactCTA() {
  const email = profile?.email ?? "angeleskiancharles@gmail.com";
  const linkedin = profile?.linkedin ?? "https://www.linkedin.com/";
  const github = profile?.github ?? "https://github.com/";
  const facebook = profile?.facebook ?? "https://www.facebook.com/";

  return (
    <div className="relative overflow-visible">
      <SectionRadialGlow />

      <section id="contact" className="relative isolate w-full py-20 md:py-20">
        <div className="container-wrapper relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold text-navy dark:text-white md:text-4xl">
                Ready to Start a Project?
              </h2>
              <p className="mt-4 text-base text-navy/70 md:text-lg">
                Let’s collaborate and bring your ideas to life. I’m available
                for freelance work, consulting, and full-time opportunities.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <a
                  href={linkedin}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white/70 text-navy/75 transition duration-200 hover:-translate-y-0.5 hover:border-navy/25 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/20 dark:hover:bg-white/10"
                >
                  <LinkedInIcon className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={github}
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white/70 text-navy/75 transition duration-200 hover:-translate-y-0.5 hover:border-navy/25 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/20 dark:hover:bg-white/10"
                >
                  <GithubIcon className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={facebook}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white/70 text-navy/75 transition duration-200 hover:-translate-y-0.5 hover:border-navy/25 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/20 dark:hover:bg-white/10"
                >
                  <FacebookIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  aria-label="Go to contact page"
                  className="btn-primary inline-flex items-center justify-center text-sm"
                >
                  Get In Touch
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/90 px-6 py-3 text-sm font-semibold text-navy transition hover:border-white/40 hover:bg-white hover:text-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  View Projects
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {INFO_ROWS.map(({ title, detail, Icon, statusClass }, index) => (
                <InfoCard
                  key={title}
                  title={title}
                  detail={detail}
                  Icon={Icon}
                  statusClass={statusClass}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}






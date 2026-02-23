import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { resume } from "@/data/resume";
import { containerStagger, EASE_OUT, fadeUp, wipeReveal } from "../motionVariants";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";

type ResumeHeroProps = {
  shouldAnimate?: boolean;
};

function formatWebsiteLink(website: string) {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
}

function formatPhoneLink(phone: string) {
  const cleaned = phone.replace(/[^+\d]/g, "");
  return `tel:${cleaned}`;
}

export default function ResumeHero({ shouldAnimate = true }: ResumeHeroProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = !!useReducedMotion() || isMobile;

  const contactItems = [
    {
      label: "Phone",
      value: resume.contact.phone,
      href: formatPhoneLink(resume.contact.phone),
      Icon: Phone,
    },
    {
      label: "Email",
      value: resume.contact.email,
      href: `mailto:${resume.contact.email}`,
      Icon: Mail,
    },
    {
      label: "Website",
      value: resume.contact.website,
      href: formatWebsiteLink(resume.contact.website),
      Icon: Globe,
    },
    {
      label: "Location",
      value: resume.contact.address,
      href: null,
      Icon: MapPin,
    },
  ];

  const heroButtonVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 6,
      scale: prefersReducedMotion ? 1 : 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.18 : 0.34,
        delay: prefersReducedMotion ? 0 : 0.5,
        ease: EASE_OUT,
      },
    },
  };

  const contactStripVariants = {
    hidden: {
      opacity: 0,
      scaleX: prefersReducedMotion ? 1 : 0.96,
    },
    show: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: prefersReducedMotion ? 0.18 : 0.42,
        delay: prefersReducedMotion ? 0 : 0.62,
        ease: EASE_OUT,
      },
    },
  };

  const contactItemsContainerVariants = containerStagger(
    prefersReducedMotion,
    prefersReducedMotion ? 0 : 0.75,
    0.08,
  );

  return (
    <motion.section
      {...getMotionProps(isMobile, {
        initial: shouldAnimate ? "hidden" : false,
        animate: "show",
      })}
      className="relative px-4 pb-10 pt-28 sm:px-6 md:pb-14 md:pt-32"
    >
      <div className="mx-auto w-full max-w-[84rem]">
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            {...getMotionProps(isMobile, {
              initial: shouldAnimate ? {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
              } : false,
              animate: {
                opacity: prefersReducedMotion ? 0.08 : 0.12,
                scale: 1,
              },
              transition: {
                duration: prefersReducedMotion ? 0.2 : 0.56,
                delay: prefersReducedMotion ? 0 : 0.12,
                ease: EASE_OUT,
              },
            })}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[22%] -z-10 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.35)_0%,rgba(125,211,252,0.05)_42%,transparent_72%)]"
          />

          <motion.p
            variants={fadeUp(prefersReducedMotion, 0, 6, 0.3)}
            className="inline-flex items-center rounded-full border border-slate-300/75 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white/70"
          >
            Professional Profile
          </motion.p>

          <h1 className="mt-7 overflow-hidden text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
            <motion.span className="inline-block" variants={wipeReveal(prefersReducedMotion, 0.1, 0.5)}>
              {resume.name}
            </motion.span>
          </h1>

          <motion.p
            variants={fadeUp(prefersReducedMotion, 0.26, 6, 0.32)}
            className="mt-4 text-2xl font-medium text-slate-700/95 dark:text-white/75"
          >
            {resume.title}
          </motion.p>

          <motion.p
            variants={fadeUp(prefersReducedMotion, 0.36, 8, 0.34)}
            className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-slate-700 dark:text-white/70 sm:text-lg"
          >
            {resume.careerObjective}
          </motion.p>

          <motion.div variants={heroButtonVariants} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href={resume.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex h-14 min-w-[230px] items-center justify-center gap-2.5 px-7 text-base"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Download Resume
            </motion.a>

            <Link
              to="/projects"
              className="btn-primary inline-flex h-14 min-w-[195px] items-center justify-center gap-2.5 px-7 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/70"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              View Projects
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto mt-14 max-w-[82rem] rounded-2xl border border-slate-300/70 bg-white/75 p-4 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.9)] backdrop-blur-md dark:border-white/10 dark:bg-[#16305a]/55 sm:p-6"
          variants={contactStripVariants}
          style={{ transformOrigin: "center" }}
        >
          <motion.ul
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            variants={contactItemsContainerVariants}
          >
            {contactItems.map(({ label, value, href, Icon }) => (
              <motion.li
                key={label}
                variants={fadeUp(prefersReducedMotion, 0, 6, 0.24)}
                className="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/75 hover:bg-white/85 dark:border-white/10 dark:bg-[#1d3b67]/55 dark:hover:border-sky-300/40 dark:hover:bg-[#214878]/72"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-sky-300/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 dark:bg-sky-300/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.34)_50%,transparent_100%)] opacity-0 transition-all duration-500 group-hover:translate-x-[130%] group-hover:opacity-100 dark:bg-[linear-gradient(115deg,transparent_0%,rgba(148,197,255,0.22)_50%,transparent_100%)]"
                />
                {href ? (
                  <a
                    href={href}
                    target={label === "Website" ? "_blank" : undefined}
                    rel={label === "Website" ? "noreferrer" : undefined}
                    className="relative flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-white/10 dark:text-white/80 dark:group-hover:bg-sky-400/20 dark:group-hover:text-sky-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-600 dark:text-white/55">
                        {label}
                      </span>
                      <span
                        title={value}
                        className="block truncate text-[15px] font-semibold text-slate-800 transition-colors duration-300 group-hover:text-slate-900 dark:text-white/90 dark:group-hover:text-white"
                      >
                        {value}
                      </span>
                    </span>
                  </a>
                ) : (
                  <div className="relative flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-white/10 dark:text-white/80 dark:group-hover:bg-sky-400/20 dark:group-hover:text-sky-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-600 dark:text-white/55">
                        {label}
                      </span>
                      <span
                        title={value}
                        className="block truncate text-[15px] font-semibold text-slate-800 transition-colors duration-300 group-hover:text-slate-900 dark:text-white/90 dark:group-hover:text-white"
                      >
                        {value}
                      </span>
                    </span>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.section>
  );
}

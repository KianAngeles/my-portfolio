import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import useFirstVisit from "@/hooks/useFirstVisit";
import { profile, socialusernames } from "@/data/profile";
import emailIcon from "@/assets/icons/contact-icons/email.png";
import phoneIcon from "@/assets/icons/contact-icons/telephone.png";
import locationIcon from "@/assets/icons/contact-icons/location.png";
import businessIcon from "@/assets/icons/contact-icons/business.png";
import githubIcon from "@/assets/icons/contact-icons/github-sign.png";
import socialMediaIcon from "@/assets/icons/contact-icons/social-media.png";
import instagramIcon from "@/assets/icons/contact-icons/instagram.png";

const socialLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: profile.linkedin,
    username: socialusernames.linkedin,
    icon: businessIcon,
  },
  {
    id: "github",
    label: "GitHub",
    href: profile.github,
    username: socialusernames.github,
    icon: githubIcon,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: profile.facebook,
    username: socialusernames.facebook,
    icon: socialMediaIcon,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: profile.instagram,
    username: socialusernames.instagram,
    icon: instagramIcon,
  },
].filter((item) => Boolean(item.href));

const contactRows = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: emailIcon,
  },
  {
    label: "Phone",
    value: profile.phonenum,
    href: `tel:${profile.phonenum.replace(/\s+/g, "")}`,
    icon: phoneIcon,
  },
  {
    label: "Address",
    value: profile.Address,
    icon: locationIcon,
  },
];

const heroContainerVariants = {
  hidden: {},
  show: (reduceMotion: boolean) => ({
    transition: {
      delayChildren: reduceMotion ? 0.04 : 0.1,
      staggerChildren: reduceMotion ? 0.05 : 0.1,
    },
  }),
};

const heroItemVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 8,
  }),
  show: (reduceMotion: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0.2 : 0.35,
      ease: "easeOut",
    },
  }),
};

const cardVariants = {
  hidden: ({ direction, reduceMotion }: { direction: number; reduceMotion: boolean }) => ({
    opacity: 0,
    x: reduceMotion ? 0 : direction * 24,
  }),
  show: ({ reduceMotion }: { direction: number; reduceMotion: boolean }) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: reduceMotion ? 0.24 : 0.4,
      delay: reduceMotion ? 0.12 : 0.35,
      ease: "easeOut",
    },
  }),
};

const fieldsContainerVariants = {
  hidden: {},
  show: (reduceMotion: boolean) => ({
    transition: {
      delayChildren: reduceMotion ? 0.18 : 0.75,
      staggerChildren: reduceMotion ? 0.05 : 0.1,
    },
  }),
};

const fieldItemVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 8,
  }),
  show: (reduceMotion: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0.2 : 0.25,
      ease: "easeOut",
    },
  }),
};

export default function ContactFormSection() {
  const prefersReducedMotion = !!useReducedMotion();
  const { isFirstVisit, markVisited } = useFirstVisit("contactPageAnimated");
  const hasMarkedVisitRef = useRef(false);
  const shouldAnimateIntro = isFirstVisit;
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [startSheen, setStartSheen] = useState(false);

  useEffect(() => {
    if (!isFirstVisit || hasMarkedVisitRef.current) return undefined;

    const completeDelay = prefersReducedMotion ? 450 : 2100;
    const timerId = window.setTimeout(() => {
      if (hasMarkedVisitRef.current) return;
      hasMarkedVisitRef.current = true;
      markVisited();
    }, completeDelay);

    return () => window.clearTimeout(timerId);
  }, [isFirstVisit, markVisited, prefersReducedMotion]);

  useEffect(() => {
    if (!isFirstVisit || prefersReducedMotion) return undefined;

    const timerId = window.setTimeout(() => {
      setStartSheen(true);
    }, 1150);

    return () => window.clearTimeout(timerId);
  }, [isFirstVisit, prefersReducedMotion]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

    if (!accessKey) {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setSubmitState("sending");
    setSubmitMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio message from ${name || "Visitor"}`,
          from_name: name || "Visitor",
          from_email: email,
          message,
          replyto: email,
          to_email: profile.email,
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send message");
      }

      form.reset();
      setSubmitState("success");
      setSubmitMessage("Message sent. I will get back to you soon.");
    } catch {
      setSubmitState("error");
      setSubmitMessage("Message failed to send. Please try again or email me directly.");
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-28" aria-labelledby="contact-heading">
      <SectionRadialGlow />

      <div className="mx-auto max-w-6xl px-4">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          variants={heroContainerVariants}
          custom={prefersReducedMotion}
          initial={shouldAnimateIntro ? "hidden" : false}
          animate="show"
        >
          <motion.h1
            id="contact-heading"
            variants={heroItemVariants}
            custom={prefersReducedMotion}
            className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          >
            GET IN TOUCH
          </motion.h1>
          <motion.p
            variants={heroItemVariants}
            custom={prefersReducedMotion}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-white/72 sm:text-base"
          >
            I&apos;d love to hear from you, feel free to reachout anytime
          </motion.p>
        </motion.header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.aside
            variants={cardVariants}
            custom={{ direction: -1, reduceMotion: prefersReducedMotion }}
            initial={shouldAnimateIntro ? "hidden" : false}
            animate="show"
            className="rounded-3xl border border-slate-300/70 bg-white/75 p-5 dark:border-slate-500/35 dark:bg-white/[0.03] dark:shadow-[0_0_30px_rgba(255,255,255,0.12)] sm:p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact Information</h2>

            <div className="mt-5 space-y-3">
              {contactRows.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-300/70 bg-white/18 px-4 py-3 backdrop-blur-md dark:border-slate-500/35 dark:bg-white/[0.04]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">
                    {item.label}
                  </p>
                  <div className="mt-1 flex items-center gap-2.5">
                    <img
                      src={item.icon}
                      alt={`${item.label} icon`}
                      width={16}
                      height={16}
                      className="h-3.5 w-3.5 shrink-0 object-contain opacity-80 dark:invert dark:opacity-85"
                      loading="lazy"
                    />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex text-sm font-medium text-slate-700 transition-colors hover:text-accent dark:text-white dark:hover:text-accent"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-700 dark:text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connect on Socials</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-300/70 bg-white/18 px-4 py-3 backdrop-blur-md transition-colors hover:border-accent dark:border-slate-500/35 dark:bg-white/[0.04] dark:hover:border-accent"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.icon}
                        alt={`${item.label} icon`}
                        className="mt-0.5 h-5 w-5 opacity-80 dark:invert dark:opacity-90"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-white/62">@{item.username}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>

          <motion.article
            variants={cardVariants}
            custom={{ direction: 1, reduceMotion: prefersReducedMotion }}
            initial={shouldAnimateIntro ? "hidden" : false}
            animate="show"
            className="rounded-3xl border border-slate-300/70 bg-white/75 p-5 dark:border-slate-500/35 dark:bg-white/[0.03] dark:shadow-[0_0_30px_rgba(255,255,255,0.12)] sm:p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Send a Message</h2>

            <motion.form
              className="mt-5 space-y-4"
              onSubmit={handleSubmit}
              variants={fieldsContainerVariants}
              custom={prefersReducedMotion}
              initial={shouldAnimateIntro ? "hidden" : false}
              animate="show"
            >
              <motion.div variants={fieldItemVariants} custom={prefersReducedMotion}>
                <label htmlFor="contact-name" className="text-sm font-medium text-slate-700 dark:text-white/75">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300/80 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-accent dark:border-slate-500/40 dark:!bg-transparent dark:text-white"
                  placeholder="Your name"
                />
              </motion.div>

              <motion.div variants={fieldItemVariants} custom={prefersReducedMotion}>
                <label htmlFor="contact-email" className="text-sm font-medium text-slate-700 dark:text-white/75">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300/80 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-accent dark:border-slate-500/40 dark:!bg-transparent dark:text-white"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div variants={fieldItemVariants} custom={prefersReducedMotion}>
                <label htmlFor="contact-message" className="text-sm font-medium text-slate-700 dark:text-white/75">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  required
                  className="mt-2 w-full resize-y rounded-xl border border-slate-300/80 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-accent dark:border-slate-500/40 dark:!bg-transparent dark:text-white"
                  placeholder="Type your message here..."
                />
              </motion.div>

              <motion.div variants={fieldItemVariants} custom={prefersReducedMotion}>
                <button
                  type="submit"
                  disabled={submitState === "sending"}
                  className="relative isolate inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-md border border-slate-300/80 bg-transparent px-5 text-sm font-semibold text-slate-800 transition-colors hover:bg-white hover:text-black dark:border-slate-500/40 dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <span className="relative z-10">{submitState === "sending" ? "Sending..." : "Send"}</span>
                  {startSheen ? (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/80"
                      initial={{ x: "-120%", opacity: 0 }}
                      animate={{ x: "340%", opacity: [0, 0.55, 0] }}
                      transition={{ duration: 0.75, ease: "easeInOut" }}
                      onAnimationComplete={() => setStartSheen(false)}
                    />
                  ) : null}
                </button>
              </motion.div>

              {submitMessage && (
                <p
                  className={`text-sm ${
                    submitState === "success"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-rose-600 dark:text-rose-300"
                  }`}
            >
              {submitMessage}
            </p>
          )}
            </motion.form>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

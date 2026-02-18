import logo from "../../assets/images/logo.png";
import { profile } from "@/data/profile";
import { Link } from "react-router-dom";
import githubIcon from "@/assets/icons/socials/github.png";
import linkedinIcon from "@/assets/icons/socials/linkedin.png";
import facebookIcon from "@/assets/icons/socials/facebook.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

const navLinkClass =
  "border-b border-transparent text-sm font-medium tracking-wide text-white/70 transition-colors duration-200 hover:border-white/60 hover:text-white";

const socialButtonClass =
  "inline-flex items-center justify-center p-1 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

function FooterNav({ className = "" }) {
  return (
    <nav className={className} aria-label="Footer navigation">
      {NAV_LINKS.map((link) => (
        <Link key={link.label} to={link.href} className={navLinkClass}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Footer() {
  const github = profile?.github ?? "https://github.com/";
  const linkedin = profile?.linkedin ?? "https://www.linkedin.com/";
  const facebook = profile?.facebook ?? "https://www.facebook.com/";

  return (
    <footer className="relative bg-[#071427] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-12 lg:px-14">
        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
            <Link
              to="/"
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-90"
              aria-label="Back to top"
            >
              <img src={logo} alt="KA logo" className="h-9 w-auto" />
            </Link>

            <FooterNav className="hidden items-center justify-center gap-8 md:flex" />

            <div className="flex items-center justify-end gap-2.5">
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={socialButtonClass}
              >
                <img src={githubIcon} alt="" className="h-6 w-6 object-contain [filter:brightness(0)_invert(1)]" aria-hidden="true" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={socialButtonClass}
              >
                <img src={linkedinIcon} alt="" className="h-6 w-6 object-contain [filter:brightness(0)_invert(1)]" aria-hidden="true" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className={socialButtonClass}
              >
                <img src={facebookIcon} alt="" className="h-6 w-6 object-contain [filter:brightness(0)_invert(1)]" aria-hidden="true" />
              </a>
            </div>
          </div>

          <FooterNav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:hidden" />

          <div className="h-px w-full bg-white/10" />

          <p className="text-center text-xs tracking-[0.2em] text-white/55">
            &copy; {new Date().getFullYear()} Kian Charles S. Angeles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

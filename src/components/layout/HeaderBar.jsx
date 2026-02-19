import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Resume", to: "/resume" },
  { label: "Contact", to: "/contact" },
];

export default function HeaderBar() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedIsDark = savedTheme ? savedTheme === "dark" : true;

    setIsDark(savedIsDark);

    document.body.classList.toggle("dark", savedIsDark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const nextIsDark = !prevIsDark;

      if (nextIsDark) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return nextIsDark;
    });
  };

  return (
    <header className="home-intro-header fixed top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div
          className={`rounded-full px-6 py-3 backdrop-blur-2xl transition-all duration-300 ease-out hover:scale-[1.01] ${
            isDark
              ? "border border-white/10 bg-black/20 shadow-2xl shadow-black/40 supports-[backdrop-filter]:bg-black/20 hover:bg-black/30"
              : "border border-slate-300/70 bg-white/80 shadow-[0_14px_34px_rgba(15,23,42,0.2)] supports-[backdrop-filter]:bg-white/74 hover:bg-white/88"
          }`}
        >
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-1 items-center">
              <NavLink
                to="/"
                aria-label="Go to Home"
                className="group inline-flex items-center rounded-full p-1 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80"
              >
                <img
                  src={logo}
                  alt="Logo"
                  width="40"
                  height="40"
                  className={`h-10 w-auto transition-transform duration-300 group-hover:rotate-[4deg] group-hover:scale-110 ${
                    isDark ? "invert-0" : "invert"
                  }`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </NavLink>
            </div>

            <nav className="hidden flex-1 justify-center md:flex" aria-label="Primary navigation">
              <div className="flex items-center space-x-8">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `relative text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 ${
                        isDark
                          ? `after:bg-white/70 ${
                              isActive
                                ? "text-white after:scale-x-100"
                                : "text-gray-300 hover:text-white hover:after:scale-x-100"
                            }`
                          : `[text-shadow:0_1px_1px_rgba(255,255,255,0.72),0_0_10px_rgba(255,255,255,0.26)] after:bg-black/70 ${
                              isActive
                                ? "text-slate-950 after:scale-x-100"
                                : "text-slate-800 hover:text-black hover:after:scale-x-100"
                            }`
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="flex flex-1 justify-end">
              <AnimatedThemeToggler
                type="button"
                isDark={isDark}
                onToggle={toggleTheme}
                disableAnimationBelow={1024}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={`flex h-10 w-10 items-center justify-center rounded-full p-2 backdrop-blur-md transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isDark
                    ? "bg-black/30 text-white shadow-sm"
                    : "border border-slate-300/70 bg-white/80 text-slate-900 shadow-sm [text-shadow:0_1px_1px_rgba(255,255,255,0.65)]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

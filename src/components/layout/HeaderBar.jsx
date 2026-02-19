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
        <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 ease-out supports-[backdrop-filter]:bg-white/10 hover:scale-[1.01] hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:shadow-black/40 dark:supports-[backdrop-filter]:bg-black/20 dark:hover:bg-black/30">
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
                  className="h-10 w-auto invert transition-transform duration-300 group-hover:rotate-[4deg] group-hover:scale-110 dark:invert-0"
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
                      `relative text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-black/70 after:transition-transform after:duration-200 dark:after:bg-white/70 ${
                        isActive
                          ? "text-black after:scale-x-100 dark:text-white"
                          : "text-gray-700 hover:text-black hover:after:scale-x-100 dark:text-gray-300 dark:hover:text-white"
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2 text-navy shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-black/30 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

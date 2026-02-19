import { NavLink } from "react-router-dom";
import { House, UserRound, FolderOpen, FileText, Mail } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", to: "/", Icon: House, end: true },
  { label: "About", to: "/about", Icon: UserRound },
  { label: "Projects", to: "/projects", Icon: FolderOpen },
  { label: "Resume", to: "/resume", Icon: FileText },
  { label: "Contact", to: "/contact", Icon: Mail },
];

export default function BottomNavbar() {
  return (
    <div className="home-intro-bottomnav pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden">
      <nav
        className="pointer-events-auto w-full border-t border-white/20 bg-white/10 px-2 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/10 dark:border-white/10 dark:bg-black/30 dark:shadow-black/50 dark:supports-[backdrop-filter]:bg-black/30"
        aria-label="Bottom navigation"
      >
        <ul className="grid grid-cols-5 items-center gap-1">
          {NAV_ITEMS.map(({ label, to, Icon, end }) => (
            <li key={to} className="flex justify-center">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex min-w-0 flex-col items-center justify-center rounded-full px-2 py-1.5 text-[11px] font-medium leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 ${
                    isActive
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-800 hover:text-black dark:text-white/75 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="mt-1 truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

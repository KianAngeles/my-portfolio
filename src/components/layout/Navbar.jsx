import { NavLink } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const linkBase =
  "px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-white/10";
const linkActive = "bg-white/10";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-navy/80 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <NavLink to={ROUTES.home} className="font-bold tracking-tight text-white">
          YourName
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink
            to={ROUTES.home}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.about}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to={ROUTES.projects}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to={ROUTES.resume}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Resume
          </NavLink>
          <NavLink
            to={ROUTES.contact}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

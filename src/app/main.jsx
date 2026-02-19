import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "@/styles/index.css";

const HOME_INTRO_STORAGE_KEY = "homeIntroSeen";
document.documentElement.lang = "en";
document.documentElement.dir = "ltr";
const savedTheme = window.localStorage.getItem("theme");
const initialIsDark = savedTheme ? savedTheme === "dark" : true;
document.body.classList.toggle("dark", initialIsDark);

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const isHomeRoute = pathname === "/";

if (isHomeRoute) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const hasSeenHomeIntro =
    window.sessionStorage.getItem(HOME_INTRO_STORAGE_KEY) === "1";

  document.body.dataset.homeIntroPhase =
    prefersReducedMotion || hasSeenHomeIntro ? "ready" : "intro";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HeaderBar from "@/components/layout/HeaderBar";
import BottomNavbar from "@/components/layout/BottomNavbar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/Home/Home";
import GlobalClickSpark from "@/components/effects/GlobalClickSpark";
import SeoManager from "@/seo/SeoManager";

const About = lazy(() => import("@/pages/About/About"));
const Projects = lazy(() => import("@/pages/Projects/Projects"));
const LinqlyProjectPage = lazy(() =>
  import("@/pages/Projects/projects/LinqlyProjectPage"),
);
const QZoneProjectPage = lazy(() =>
  import("@/pages/Projects/projects/QZoneProjectPage"),
);
const ThryveProjectPage = lazy(() =>
  import("@/pages/Projects/projects/ThryveProjectPage"),
);
const XpenSyncProjectPage = lazy(() =>
  import("@/pages/Projects/projects/XpenSyncProjectPage"),
);
const Resume = lazy(() => import("@/pages/Resume/Resume"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));

function RouteLoadingFallback() {
  return (
    <div
      className="container-wrapper py-10 text-sm text-slate-500 dark:text-white/60"
      role="status"
      aria-live="polite"
    >
      Loading page...
    </div>
  );
}

export default function App() {
  return (
    <GlobalClickSpark>
      <div className="w-full overflow-x-clip pb-24 md:pb-0">
        <SeoManager />
        <ScrollToTop />
        <HeaderBar />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/linqly" element={<LinqlyProjectPage />} />
            <Route path="/projects/thryve" element={<ThryveProjectPage />} />
            <Route path="/projects/qzone" element={<QZoneProjectPage />} />
            <Route path="/projects/xpensync" element={<XpenSyncProjectPage />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
        <BottomNavbar />
      </div>
    </GlobalClickSpark>
  );
}

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HeaderBar from "@/components/layout/HeaderBar";
import BottomNavbar from "@/components/layout/BottomNavbar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/Home/Home";
import GlobalClickSpark from "@/components/effects/GlobalClickSpark";
import SeoManager from "@/seo/SeoManager";
import { PROJECT_ROUTES, ROUTES } from "@/lib/routes";

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
const BakeWithLoveProjectPage = lazy(() =>
  import("@/pages/Projects/projects/BakeWithLoveProjectPage"),
);
const AccoreProjectPage = lazy(() =>
  import("@/pages/Projects/projects/AccoreProjectPage"),
);
const Resume = lazy(() => import("@/pages/Resume/Resume"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

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
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.projects} element={<Projects />} />
            <Route path={PROJECT_ROUTES.linqly} element={<LinqlyProjectPage />} />
            <Route path={PROJECT_ROUTES.thryve} element={<ThryveProjectPage />} />
            <Route path={PROJECT_ROUTES.qzone} element={<QZoneProjectPage />} />
            <Route path={PROJECT_ROUTES.accore} element={<AccoreProjectPage />} />
            <Route path={PROJECT_ROUTES.bakeWithLove} element={<BakeWithLoveProjectPage />} />
            <Route path={ROUTES.resume} element={<Resume />} />
            <Route path={ROUTES.contact} element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <BottomNavbar />
      </div>
    </GlobalClickSpark>
  );
}

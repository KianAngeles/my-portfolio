import { Routes, Route } from "react-router-dom";
import HeaderBar from "@/components/layout/HeaderBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Projects from "@/pages/Projects/Projects";
import LinqlyProjectPage from "@/pages/Projects/projects/LinqlyProjectPage";
import QZoneProjectPage from "@/pages/Projects/projects/QZoneProjectPage";
import ThryveProjectPage from "@/pages/Projects/projects/ThryveProjectPage";
import XpenSyncProjectPage from "@/pages/Projects/projects/XpenSyncProjectPage";
import Resume from "@/pages/Resume/Resume";
import Contact from "@/pages/Contact/Contact";
import GlobalClickSpark from "@/components/effects/GlobalClickSpark";

export default function App() {
  return (
    <GlobalClickSpark>
      <div className="w-full overflow-x-clip">
        <ScrollToTop />
        <HeaderBar />
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
      </div>
    </GlobalClickSpark>
  );
}

export const ROUTES = {
  home: "/",
  about: "/about/",
  projects: "/projects/",
  resume: "/resume/",
  contact: "/contact/",
};

export const PROJECT_ROUTES = {
  linqly: "/projects/linqly/",
  thryve: "/projects/thryve/",
  qzone: "/projects/qzone/",
  accore: "/projects/accore/",
  bakeWithLove: "/projects/bake-with-love/",
};

export function normalizeTrailingSlashPath(pathname) {
  if (!pathname || pathname === "/") return "/";

  const normalized = pathname.replace(/\/+$/, "");
  return normalized ? `${normalized}/` : "/";
}

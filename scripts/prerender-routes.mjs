import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const ROUTE_META = {
  "/": {
    title: "Kian Angeles | Full-Stack Developer",
    description:
      "Portfolio of Kian Angeles, a full-stack developer building modern web apps with React, Node.js, and MongoDB.",
    type: "website",
  },
  "/about/": {
    title: "About | Kian Angeles Portfolio",
    description:
      "Learn more about Kian Angeles, his development process, technical expertise, and certifications.",
    type: "profile",
  },
  "/projects/": {
    title: "Projects | Kian Angeles Portfolio",
    description:
      "Explore selected full-stack and frontend projects by Kian Angeles, including architecture decisions and outcomes.",
    type: "website",
  },
  "/projects/linqly/": {
    title: "Linqly Case Study | Kian Angeles Portfolio",
    description:
      "Linqly is a real-time social messaging web app built with React, Node.js, MongoDB, and Socket.IO.",
    type: "article",
  },
  "/projects/thryve/": {
    title: "Thryve Case Study | Kian Angeles Portfolio",
    description:
      "Thryve is a full-stack health and fitness app built with Vue, Express, Node.js, and MongoDB.",
    type: "article",
  },
  "/projects/qzone/": {
    title: "Q-Zone Case Study | Kian Angeles Portfolio",
    description:
      "Q-Zone Professional Detailers is a multi-page business website built with Angular and TypeScript.",
    type: "article",
  },
  "/projects/bake-with-love/": {
    title: "Bake With Love Case Study | Kian Angeles Portfolio",
    description:
      "Bake With Love is a responsive multi-page bakery website built with HTML, CSS, and JavaScript.",
    type: "article",
  },
  "/projects/xpensync/": {
    title: "XpenSync Case Study | Kian Angeles Portfolio",
    description:
      "XpenSync is a personal finance web app built with PHP and MySQL for expense and lending management.",
    type: "article",
  },
  "/resume/": {
    title: "Resume | Kian Angeles Portfolio",
    description:
      "View the resume of Kian Angeles, including skills, technical stack, and professional experience.",
    type: "profile",
  },
  "/contact/": {
    title: "Contact | Kian Angeles Portfolio",
    description:
      "Get in touch with Kian Angeles for software development opportunities and collaborations.",
    type: "website",
  },
};

const CRAWLABLE_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/about/", label: "About" },
  { path: "/projects/", label: "Projects" },
  { path: "/projects/linqly/", label: "Linqly Case Study" },
  { path: "/projects/thryve/", label: "Thryve Case Study" },
  { path: "/projects/qzone/", label: "Q-Zone Case Study" },
  { path: "/projects/bake-with-love/", label: "Bake With Love Case Study" },
  { path: "/projects/xpensync/", label: "XpenSync Case Study" },
  { path: "/resume/", label: "Resume" },
  { path: "/contact/", label: "Contact" },
];

function normalizeRoutePath(route) {
  if (!route) return "/";
  const normalized = route.replace(/\/+$/, "");
  return normalized || "/";
}

function parseEnvContent(content) {
  const env = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadEnvFiles() {
  const envPaths = [".env", ".env.local"];

  for (const envPath of envPaths) {
    try {
      const filePath = resolve(process.cwd(), envPath);
      const content = await readFile(filePath, "utf8");
      const parsed = parseEnvContent(content);

      for (const [key, value] of Object.entries(parsed)) {
        process.env[key] = value;
      }
    } catch (error) {
      if (error && error.code === "ENOENT") continue;
      throw error;
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setHtmlLanguage(html, lang = "en", dir = "ltr") {
  return html.replace(/<html\b[^>]*>/i, (tag) => {
    let nextTag = tag;

    if (/\blang\s*=\s*["'][^"']*["']/i.test(nextTag)) {
      nextTag = nextTag.replace(/\blang\s*=\s*["'][^"']*["']/i, `lang="${lang}"`);
    } else {
      nextTag = nextTag.replace(/^<html\b/i, `<html lang="${lang}"`);
    }

    if (/\bdir\s*=\s*["'][^"']*["']/i.test(nextTag)) {
      nextTag = nextTag.replace(/\bdir\s*=\s*["'][^"']*["']/i, `dir="${dir}"`);
    } else {
      nextTag = nextTag.replace(/^<html\b/i, `<html dir="${dir}"`);
    }

    return nextTag;
  });
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function setOrInsertMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagPattern = new RegExp(
    `<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`,
    "i",
  );
  const safeContent = escapeHtml(content);

  if (tagPattern.test(html)) {
    return html.replace(tagPattern, (tag) => {
      if (/content=["'][^"']*["']/i.test(tag)) {
        return tag.replace(
          /content=["'][^"']*["']/i,
          `content="${safeContent}"`,
        );
      }

      return tag.replace(/>$/, ` content="${safeContent}">`);
    });
  }

  return html.replace(
    "</head>",
    `  <meta ${attribute}="${key}" content="${safeContent}" />\n  </head>`,
  );
}

function setCanonical(html, canonicalUrl) {
  const safeCanonical = escapeHtml(canonicalUrl);
  const canonicalPattern = /<link\s+rel=["']canonical["'][^>]*>/i;

  if (canonicalPattern.test(html)) {
    return html.replace(canonicalPattern, `<link rel="canonical" href="${safeCanonical}" />`);
  }

  return html.replace(
    "</head>",
    `  <link rel="canonical" href="${safeCanonical}" />\n  </head>`,
  );
}

function buildRouteSupportText(route) {
  const routeBase = normalizeRoutePath(route);

  if (routeBase === "/projects") {
    return "Browse all case studies with architecture choices, stack details, and delivery outcomes.";
  }

  if (routeBase.startsWith("/projects/")) {
    return "This case study includes project goals, implementation details, and the technical stack used in production.";
  }

  if (routeBase === "/resume") {
    return "Review technical skills, experience highlights, and the current downloadable resume.";
  }

  if (routeBase === "/contact") {
    return "Use the contact page for collaboration, freelance work, and software development opportunities.";
  }

  if (routeBase === "/about") {
    return "Learn more about development approach, strengths, and professional background.";
  }

  return "Explore this page for portfolio details and relevant project information.";
}

function buildStaticRouteLinks(siteUrl, activeRoute) {
  return CRAWLABLE_ROUTES.map(({ path, label }) => {
    const isActive = path === activeRoute;
    const style = isActive
      ? "font-weight:700;text-decoration:underline;"
      : "font-weight:500;";
    return `<li style="margin:0;">
            <a href="${escapeHtml(`${siteUrl}${path}`)}" style="color:#0f172a;${style}">${escapeHtml(label)}</a>
          </li>`;
  }).join("\n");
}

function setNoscriptFallback(html, route, title, description, canonicalUrl, siteUrl) {
  const supportText = buildRouteSupportText(route);
  const staticLinks = buildStaticRouteLinks(siteUrl, route);
  const noscript = `<noscript id="route-prerender-noscript">
      <main style="padding:1.25rem;font-family:system-ui,Arial,sans-serif;max-width:760px;margin:0 auto;color:#0f172a;">
        <h1 style="font-size:1.5rem;line-height:1.2;margin-bottom:.75rem;">${escapeHtml(title)}</h1>
        <p style="line-height:1.5;margin-bottom:.75rem;">${escapeHtml(description)}</p>
        <p style="line-height:1.5;margin-bottom:.9rem;">${escapeHtml(supportText)}</p>
        <p style="line-height:1.5;margin-bottom:.9rem;">Canonical URL: <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(route)}</a></p>
        <h2 style="font-size:1rem;line-height:1.2;margin:0 0 .55rem;">Site Pages</h2>
        <ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.4rem 1rem;padding-left:1rem;margin:0;">
${staticLinks}
        </ul>
      </main>
    </noscript>`;

  let nextHtml = html.replace(
    /<noscript id=["']route-prerender-noscript["'][\s\S]*?<\/noscript>/i,
    "",
  );

  if (/<div id="root"><\/div>/i.test(nextHtml)) {
    return nextHtml.replace(/<div id="root"><\/div>/i, `<div id="root"></div>\n    ${noscript}`);
  }

  return nextHtml;
}

function buildRouteHtml(template, route, siteUrl, meta) {
  const canonicalUrl = `${siteUrl}${route}`;
  let nextHtml = setHtmlLanguage(template, "en", "ltr");

  nextHtml = setTitle(nextHtml, meta.title);
  nextHtml = setCanonical(nextHtml, canonicalUrl);
  nextHtml = setOrInsertMeta(nextHtml, "name", "description", meta.description);
  nextHtml = setOrInsertMeta(nextHtml, "property", "og:title", meta.title);
  nextHtml = setOrInsertMeta(nextHtml, "property", "og:description", meta.description);
  nextHtml = setOrInsertMeta(nextHtml, "property", "og:url", canonicalUrl);
  nextHtml = setOrInsertMeta(nextHtml, "property", "og:type", meta.type);
  nextHtml = setOrInsertMeta(nextHtml, "name", "twitter:title", meta.title);
  nextHtml = setOrInsertMeta(nextHtml, "name", "twitter:description", meta.description);
  nextHtml = setNoscriptFallback(
    nextHtml,
    route,
    meta.title,
    meta.description,
    canonicalUrl,
    siteUrl,
  );

  return nextHtml;
}

await loadEnvFiles();

const distDir = resolve(process.cwd(), "dist");
const templatePath = resolve(distDir, "index.html");
const templateHtml = await readFile(templatePath, "utf8");
const siteUrl = (process.env.VITE_SITE_URL || "https://example.com").replace(
  /\/+$/,
  "",
);

for (const [route, meta] of Object.entries(ROUTE_META)) {
  const routeHtml = buildRouteHtml(templateHtml, route, siteUrl, meta);
  const outputPath =
    route === "/"
      ? resolve(distDir, "index.html")
      : resolve(distDir, route.replace(/^\//, ""), "index.html");

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, routeHtml, "utf8");
}

console.log(
  `[prerender] Generated static route HTML for ${Object.keys(ROUTE_META).length} routes.`,
);

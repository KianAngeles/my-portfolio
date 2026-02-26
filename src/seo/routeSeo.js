import { featuredProjects } from "@/data/projects";
import { profile, socialusernames } from "@/data/profile";

const SITE_NAME = "Kian Angeles Portfolio";
const DEFAULT_TITLE = "Kian Angeles | Full-Stack Developer";
const DEFAULT_DESCRIPTION =
  "Portfolio of Kian Angeles, a full-stack developer building modern web apps with React, Node.js, and MongoDB.";
const DEFAULT_IMAGE = "/og-image-v2.webp";
const AUTHOR_NAME = "Kian Angeles";

const STATIC_ROUTE_SEO = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
  },
  "/about": {
    title: `About | ${SITE_NAME}`,
    description:
      "Learn more about Kian Angeles, his development process, technical expertise, and certifications.",
    type: "profile",
  },
  "/projects": {
    title: `Projects | ${SITE_NAME}`,
    description:
      "Explore selected full-stack and frontend projects by Kian Angeles, including architecture decisions and outcomes.",
    type: "website",
  },
  "/resume": {
    title: `Resume | ${SITE_NAME}`,
    description:
      "View the resume of Kian Angeles, including skills, technical stack, and professional experience.",
    type: "profile",
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Get in touch with Kian Angeles for software development opportunities and collaborations.",
    type: "website",
  },
};

const PROJECT_ROUTE_SEO = featuredProjects.reduce((acc, project) => {
  const topStack = project.stack.slice(0, 4).join(", ");

  acc[project.projectHref] = {
    title: `${project.title} Case Study | ${SITE_NAME}`,
    description: `${project.description} Stack: ${topStack}.`,
    type: "article",
    image: project.preview || DEFAULT_IMAGE,
    project,
  };

  return acc;
}, {});

function buildPersonJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: siteUrl,
    email: profile.email,
    jobTitle: "Full-Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.Address,
    },
    sameAs: [
      profile.linkedin,
      profile.github,
      profile.facebook,
      profile.instagram,
    ].filter(Boolean),
  };
}

function buildWebSiteJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "en",
  };
}

function buildCollectionJsonLd(siteUrl, routePath) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Project Case Studies",
    url: `${siteUrl}${routePath}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

function buildProjectJsonLd(siteUrl, routePath, project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteUrl}${routePath}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    creator: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    image: project.preview ? `${siteUrl}${project.preview}` : undefined,
    keywords: project.stack,
  };
}

function buildJsonLd(siteUrl, routePath, routeSeo) {
  if (routePath === "/") {
    return [buildPersonJsonLd(siteUrl), buildWebSiteJsonLd(siteUrl)];
  }

  if (routePath === "/projects") {
    return [buildCollectionJsonLd(siteUrl, routePath)];
  }

  if (routeSeo.project) {
    return [buildProjectJsonLd(siteUrl, routePath, routeSeo.project)];
  }

  return [];
}

export function getSiteSeoConfig(pathname, siteUrl) {
  const knownRouteSeo =
    STATIC_ROUTE_SEO[pathname] || PROJECT_ROUTE_SEO[pathname] || null;
  const routeSeo = knownRouteSeo || {
    title: `Page Not Found | ${SITE_NAME}`,
    description:
      "This page could not be found. Use the main navigation to access available sections.",
    type: "website",
    noindex: true,
  };

  const title = routeSeo.title || DEFAULT_TITLE;
  const description = routeSeo.description || DEFAULT_DESCRIPTION;

  const canonicalPath = pathname === "/" ? "/" : `${pathname}/`;

  return {
    title,
    description,
    canonicalPath,
    image: routeSeo.image || DEFAULT_IMAGE,
    type: routeSeo.type || "website",
    robots: routeSeo.noindex ? "noindex, nofollow" : "index, follow",
    jsonLd: buildJsonLd(siteUrl, pathname, routeSeo),
    author: AUTHOR_NAME,
    siteName: SITE_NAME,
    twitterCreator: socialusernames?.twitter
      ? `@${socialusernames.twitter}`
      : undefined,
  };
}

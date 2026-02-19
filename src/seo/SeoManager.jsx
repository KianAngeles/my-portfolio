import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSiteSeoConfig } from "./routeSeo";

function normalizePathname(pathname) {
  if (!pathname) return "/";
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function getSiteUrl() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export default function SeoManager() {
  const location = useLocation();
  const siteUrl = getSiteUrl();
  const pathname = normalizePathname(location.pathname);
  const seo = getSiteSeoConfig(pathname, siteUrl);
  const canonicalUrl = `${siteUrl}${seo.canonicalPath}`;
  const imageUrl = seo.image.startsWith("http")
    ? seo.image
    : `${siteUrl}${seo.image}`;
  const cardType = seo.image ? "summary_large_image" : "summary";

  return (
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={seo.description} />
      <meta name="robots" content={seo.robots} />
      <meta name="author" content={seo.author} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={seo.siteName} />
      <meta name="twitter:card" content={cardType} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={imageUrl} />
      {seo.twitterCreator ? (
        <meta name="twitter:creator" content={seo.twitterCreator} />
      ) : null}
      {seo.jsonLd.map((item, index) => (
        <script
          key={`route-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  );
}

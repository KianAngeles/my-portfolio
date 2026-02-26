import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const routes = [
  "/",
  "/about/",
  "/projects/",
  "/projects/linqly/",
  "/projects/thryve/",
  "/projects/qzone/",
  "/projects/bake-with-love/",
  "/projects/xpensync/",
  "/resume/",
  "/contact/",
];

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

await loadEnvFiles();

const siteUrl = (process.env.VITE_SITE_URL || "https://example.com").replace(
  /\/+$/,
  ""
);
const today = new Date().toISOString().split("T")[0];

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const publicDir = resolve(process.cwd(), "public");
await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, "robots.txt"), robotsTxt, "utf8");
await writeFile(resolve(publicDir, "sitemap.xml"), sitemapXml, "utf8");

if (!process.env.VITE_SITE_URL) {
  console.warn(
    "[seo] VITE_SITE_URL is not set. Generated robots/sitemap with https://example.com"
  );
} else {
  console.log(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl}`);
}

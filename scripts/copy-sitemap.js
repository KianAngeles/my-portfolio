import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, "..", "public", "sitemap.xml");
const targetPath = path.resolve(__dirname, "..", "dist", "sitemap.xml");

async function copySitemap() {
  try {
    await fs.copyFile(sourcePath, targetPath);
    console.log(`Copied sitemap: ${sourcePath} -> ${targetPath}`);
  } catch (error) {
    console.error("Failed to copy sitemap.xml after build.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

copySitemap();

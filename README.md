# Kian Angeles Portfolio

Modern personal portfolio built with React and Vite, showcasing project case studies, technical skills, certifications, and contact information.

## Features

- Project archive with dedicated case study pages
- Dedicated project detail routes (including Bake With Love)
- About, Resume, and Contact sections
- SEO metadata and JSON-LD per route
- Sitemap and robots generation
- Static prerendering for key routes

## Tech Stack

- React
- Vite
- TypeScript/JavaScript
- Tailwind CSS
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build pipeline includes:

1. SEO file generation (`robots.txt`, `sitemap.xml`)
2. Production Vite build
3. Route prerendering

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Generate SEO files, build, and prerender routes
- `npm run preview` - Preview production build locally

## SEO Notes

- Route SEO config: `src/seo/routeSeo.js`
- Sitemap generator: `scripts/generate-seo-files.mjs`
- Route prerenderer: `scripts/prerender-routes.mjs`

# Portfolio Interview Cheat Sheet

## App Summary (5–8 bullets)
- Single-page React portfolio app (Vite) with client-side routing for Home, About, Projects, project case studies, Resume, Contact, and a custom 404 page.
- Core routes are defined in `src/app/App.jsx` and rendered inside a shared app shell with `HeaderBar`, `BottomNavbar`, `ScrollToTop`, and `SeoManager`.
- Main technologies: React 19, React Router, Tailwind CSS utilities, Framer Motion/Motion, GSAP, and React Helmet Async.
- Content is mostly static and local (`src/data/*.js`), especially profile/resume/project data and project detail narratives.
- Contact page includes real submission flow via Web3Forms (`POST https://api.web3forms.com/submit`) with a `mailto:` fallback when no API key is configured.
- UX polish includes theme toggling, route-level lazy loading with `Suspense`, intro/reveal animations, responsive desktop/mobile nav patterns, and reusable section glow/effects.
- SEO is implemented with route-aware metadata + canonical tags + Open Graph + Twitter cards + JSON-LD (`src/seo/SeoManager.jsx`, `src/seo/routeSeo.js`).
- Build pipeline also generates sitemap/robots and pre-rendered route HTML (`npm run build` runs `seo:generate` + `prerender:routes`).

## Architecture Overview
- Folder structure overview
- `src/app`: app entry and router (`main.jsx`, `App.jsx`)
- `src/pages`: route-level pages and route-specific sections (`Home`, `About`, `Projects`, `Resume`, `Contact`, `NotFound`)
- `src/components`: shared UI/layout/effects (header, footer, bottom nav, theme toggler, radial glows, etc.)
- `src/data`: static data sources (`projects.js`, project detail data files, `resume.js`, `profile.js`)
- `src/seo`: runtime SEO manager and route SEO config
- `scripts`: build-time SEO/sitemap/prerender scripts
- `public`: static assets + generated `robots.txt` and `sitemap.xml`

- Routing setup (React Router config location)
- Route config is in `src/app/App.jsx` using `<Routes>` and explicit static paths.
- Main routes: `/`, `/about`, `/projects`, `/projects/linqly`, `/projects/thryve`, `/projects/qzone`, `/projects/xpensync`, `/resume`, `/contact`, `*`.

- Styling approach (Tailwind / CSS modules / plain CSS)
- Primary styling is Tailwind utility classes plus route/feature CSS files (for effect-heavy sections), e.g. `src/pages/About/sections/MagicBento.css` and `src/pages/Projects/sections/projects-grid-glow.css`.

- Data flow (static vs API)
- Mostly static content from local JS data files.
- One runtime API integration in contact form: Web3Forms endpoint, with access key from `VITE_WEB3FORMS_ACCESS_KEY`.

## “Professor Interview” Q&A Prep
- 1) Walk me through your project.
- I built a React + Vite portfolio with route-based pages for profile, projects, resume, and contact.
- I centralized navigation and layout in shared components, then composed each page from focused sections.
- Projects use a shared detail layout and per-project data files, so adding a new case study is mostly a data + route change.
- I added route-aware SEO metadata, structured data, sitemap/robots generation, and static route prerendering for better crawlability.

- 2) What was the hardest part and how did you solve it?
- The hardest part was balancing advanced animations with usability and performance.
- I handled this by checking reduced-motion/mobile states, running one-time animations with session storage flags, and degrading effects safely on smaller devices.
- I also split heavy dependencies in Vite manual chunks (`vendor-motion`, `vendor-three`) to keep loading practical.

- 3) How is the code organized?
- Routes and shell are in `src/app`; page implementations are in `src/pages` with section-level files.
- Shared UI/layout and effects live in `src/components`.
- Content/configuration data is in `src/data`.
- SEO behavior is isolated in `src/seo` and build scripts in `scripts`.

- 4) How do you handle responsiveness?
- Mobile/desktop nav is split (`HeaderBar` desktop + `BottomNavbar` mobile).
- Many heavy visual effects are disabled or reduced on mobile via `useIsMobile` and reduced-motion checks.
- Components use responsive Tailwind classes and mobile-first layout fallbacks.

- 5) How do you handle loading/error states?
- Route-level lazy loading uses `Suspense` with a loading fallback.
- Missing project data redirects detail pages back to `/projects` via `<Navigate />`.
- Contact form handles sending/success/error states and falls back to `mailto` if API config is missing.
- Unknown routes go to a dedicated 404 page with clear recovery actions.

- 6) If you had 1 more week, what would you improve?
- Replace remaining placeholder/TODO content notes and clean minor data issues (e.g., typos/encoding in `resume.js`).
- Add automated tests for routing, contact form flow, and key interactive sections.
- Add stronger analytics/monitoring and richer error telemetry.
- Expand true server-side rendering or static export strategy for SEO-critical pages.

- 7) What feature are you most proud of and why?
- The reusable project-detail architecture: each case-study route reuses `ProjectDetailLayout` while details come from separate data files.
- It keeps the code maintainable, consistent across pages, and easy to scale when new projects are added.

## / — Home
### 1) Purpose (1-2 sentences)
- Serves as the landing page introducing you, your positioning, key highlights, featured projects, and quick contact entry points.

### 2) What the user can do
- Use hero CTAs to navigate to `/about` and `/contact`.
- Watch/skip the first-visit intro overlay animation.
- Read a short About summary and open resume download link.
- Open featured project detail pages and external demo/code links.
- Open social links and navigate to full Contact/Projects pages.

### 3) What I built (implementation summary)
- Composed sections: `Hero`, `IntroOverlay`, `AboutQuick`, `FeaturedProjects`, `ContactCTA`, and shared `Footer`.
- Home intro state machine via `useHomeIntro` (`intro` -> `exit` -> `ready`) with skip behavior and session persistence.
- IntersectionObserver-driven reveal animations for sections/cards; many effects are one-time per session.
- Responsive behavior: heavy effects disabled/reduced on mobile and reduced-motion users.
- Reusable UI patterns: spotlight cards, tilt/shine cards, radial glow sections, shared button styles.

### 4) Data / content source
- Static content only.
- Data sources: `src/data/projects.js`, `src/data/resume.js`, `src/data/profile.js`.
- No backend/API calls on this route.

### 5) Notable technical points (interview bullets)
- One-time intro UX persisted in session storage (`homeIntroSeen`) to avoid repeat friction.
- IntersectionObserver + motion classes for progressive reveals without heavy scroll libraries.
- Home card/effect components are reusable and theme-aware (light/dark via body class).
- Mobile-first guardrails prevent expensive effects from degrading performance.
- Featured projects are filtered from a shared project dataset for consistency with `/projects`.

### 6) Edge cases / error handling
- Reduced-motion or mobile users bypass most intro-heavy animation paths.
- Intro can be skipped via click/Escape to avoid blocking the user.
- External links have fallback labels/states (e.g., “Coming Soon” when no demo/source).

### 7) Files to review
- `src/pages/Home/Home.jsx`
- `src/pages/Home/sections/Hero.jsx`
- `src/components/effects/IntroOverlay.jsx`
- `src/hooks/useHomeIntro.js`
- `src/pages/Home/sections/AboutQuick.jsx`
- `src/pages/Home/sections/FeaturedProjects.jsx`
- `src/pages/Home/sections/ContactCTA.jsx`
- `src/pages/Home/sections/contactCta.css`
- `src/components/layout/Footer.jsx`
- `src/data/projects.js`
- `src/data/resume.js`
- `src/data/profile.js`

## /about — About
### 1) Purpose (1-2 sentences)
- Presents your professional story, values, technical strengths, and certifications with a high-polish visual narrative.

### 2) What the user can do
- View animated hero intro and tech-orbit interactions.
- Open social links, resume download, and contact CTA.
- Explore “Beyond the Code” bento cards and soft skills interactions.
- Browse skills marquee and stats.
- Cycle/view certification cards and open certificate links.

### 3) What I built (implementation summary)
- Page assembly in `AboutPage`: `AboutHero`, `StoryBentoSection`, `SkillsExpertiseSection`, `CertificationsSection`, `Footer`.
- Strong animation architecture with first-visit gating (`useFirstVisit`), reduced-motion checks, and staged reveal sequencing.
- Advanced interactive UI: orbital tech icons, animated beams, spotlight cards, marquee track, counter animations, GSAP particle effects.
- Responsive behavior: desktop-only heavy orbit/beam effects, mobile fallbacks, dark-mode-specific glow layers.
- Reusable section backgrounds (`SectionRadialGlow`, `SectionRadialGlowAlt`) and shared hooks for theme/mobile detection.

### 4) Data / content source
- Static content only.
- Most content is in component constants + assets; profile/resume links come from `src/data/profile.js` and `src/data/resume.js`.
- Certification metadata is currently embedded in `CertificationsSection.tsx`.

### 5) Notable technical points (interview bullets)
- About page uses composable section architecture rather than one monolithic component.
- First-visit animation flags avoid re-running long intros every navigation.
- Motion systems are accessibility-aware via reduced-motion and device checks.
- Interactive visuals (orbit + beams + spotlight) are isolated to dedicated sections/components.
- Content remains maintainable through local data and modular section boundaries.
- Inference: `StorySection.tsx` exists but is not currently mounted; likely an earlier/alternate version.

### 6) Edge cases / error handling
- If animations should not run (mobile/reduced motion), sections render directly in a stable state.
- Social URLs fallback to `#` in hero link config if profile data is missing.
- Visual effects degrade gracefully without blocking content readability.

### 7) Files to review
- `src/pages/About/About.jsx`
- `src/pages/About/AboutPage.tsx`
- `src/pages/About/sections/AboutHero.tsx`
- `src/pages/About/sections/AboutHero.css`
- `src/pages/About/sections/StoryBentoSection.tsx`
- `src/pages/About/sections/StoryBentoSection.css`
- `src/pages/About/sections/MagicBento.jsx`
- `src/pages/About/sections/MagicBento.css`
- `src/pages/About/sections/SoftSkillsGrid.jsx`
- `src/pages/About/sections/SoftSkillsGrid.css`
- `src/pages/About/sections/SkillsExpertiseSection.tsx`
- `src/pages/About/sections/skills-marquee.css`
- `src/pages/About/sections/CertificationsSection.tsx`
- `src/data/profile.js`
- `src/data/resume.js`

## /projects — Projects
### 1) Purpose (1-2 sentences)
- Acts as the central project archive page, showing project highlights and cards linking to individual case studies.

### 2) What the user can do
- Read project hero summary and quick stats.
- Browse all selected build cards.
- Open each project detail page via image/title/details links.
- Open external Live Demo links when provided.

### 3) What I built (implementation summary)
- Section composition: `ProjectsHero`, `ProjectsHighlightsSection`, `ProjectsGridSection`, `Footer`.
- Data-driven rendering from shared `featuredProjects` array.
- Animated intro sequencing with phase delays for hero/stats/grid.
- Pointer-proximity glow spotlight system for project cards on devices that support hover.
- Responsive grid layout with graceful fallback when glow/animation is disabled.

### 4) Data / content source
- Static content only.
- Project list and metadata from `src/data/projects.js`.
- No backend/API calls on this route.

### 5) Notable technical points (interview bullets)
- Single source of truth for project metadata is reused by home highlights, projects grid, and detail routes.
- Hover-capability detection (`(hover: hover) and (pointer: fine)`) gates expensive pointer effects.
- Intro animation progression is coordinated via phase delay constants.
- Strong route linking strategy: every card anchors to a dedicated case-study route.
- Components are typed and modular (`ProjectsPage.tsx` + section components).

### 6) Edge cases / error handling
- If hover is unavailable or reduced motion is enabled, glow system is disabled automatically.
- If a project has no demo URL, card shows “Coming Soon” badge.

### 7) Files to review
- `src/pages/Projects/Projects.jsx`
- `src/pages/Projects/ProjectsPage.tsx`
- `src/pages/Projects/sections/ProjectsHero.tsx`
- `src/pages/Projects/sections/ProjectsHighlightsSection.tsx`
- `src/pages/Projects/sections/ProjectsGridSection.tsx`
- `src/pages/Projects/sections/projects-grid-glow.css`
- `src/data/projects.js`

## /projects/linqly — Linqly Case Study
### 1) Purpose (1-2 sentences)
- Provides a full case-study page for Linqly, including stack, project overview, key features, focus areas, outcomes, and demo/video.

### 2) What the user can do
- Navigate back to `/projects`.
- Open external Live Demo and Source Code links.
- Watch embedded Vimeo demo.
- Review project metadata (timeline, role, category) and feature/outcome sections.

### 3) What I built (implementation summary)
- Thin route component resolves project by ID then delegates rendering to reusable `ProjectDetailLayout`.
- `ProjectDetailLayout` drives hero, media, metadata, overview, focus, outcomes, and side panels.
- Intro reveal animations are first-visit aware and reduced-motion aware.
- CTA sheen effect triggers after delay for visual polish.
- Same layout pattern is reused across all project detail routes for consistency.

### 4) Data / content source
- Static content only.
- Core project record from `src/data/projects.js` via `getProjectById("linqly")`.
- Detail copy and media URLs from `src/data/projects/linqly.js`.
- External media embed source: Vimeo URL hardcoded in project detail data.

### 5) Notable technical points (interview bullets)
- Reusable detail layout + per-project data files keeps detail pages scalable.
- Guard clause prevents broken routes when project ID missing.
- Uses typed props in layout and animation variants for maintainable page structure.
- Combines internal route content with external demo/embed resources safely.

### 6) Edge cases / error handling
- If project lookup fails, route redirects to `/projects` using `<Navigate replace />`.
- If no video/embed exists, layout displays placeholder text area.

### 7) Files to review
- `src/pages/Projects/projects/LinqlyProjectPage.tsx`
- `src/pages/Projects/projects/ProjectDetailLayout.tsx`
- `src/pages/Projects/projects/project-detail-glow.css`
- `src/data/projects.js`
- `src/data/projects/linqly.js`

## /projects/thryve — Thryve Case Study
### 1) Purpose (1-2 sentences)
- Shows the Thryve project case study using the shared detail template and project-specific content.

### 2) What the user can do
- Navigate back to `/projects`.
- Open Live Demo and Source Code links.
- Watch embedded Vimeo demo.
- Read architecture focus, outcomes, and feature details.

### 3) What I built (implementation summary)
- Route adapter component fetches project metadata then renders `ProjectDetailLayout`.
- Reuses shared layout sections and animation flow from all detail routes.
- Injects Thryve-specific content through `thryveProjectDetails` data object.

### 4) Data / content source
- Static content only.
- Project base metadata from `src/data/projects.js`.
- Thryve-specific narrative/media data from `src/data/projects/thryve.js`.

### 5) Notable technical points (interview bullets)
- Data-driven case-study pages avoid copy-pasting markup across projects.
- MEVN-oriented stack details are separated as content, not hardcoded view logic.
- Shared layout enforces consistent UX and reduces maintenance risk.

### 6) Edge cases / error handling
- Missing project record triggers redirect to `/projects`.
- Missing optional media falls back to placeholder block in shared layout.

### 7) Files to review
- `src/pages/Projects/projects/ThryveProjectPage.tsx`
- `src/pages/Projects/projects/ProjectDetailLayout.tsx`
- `src/pages/Projects/projects/project-detail-glow.css`
- `src/data/projects.js`
- `src/data/projects/thryve.js`

## /projects/qzone — Q-Zone Case Study
### 1) Purpose (1-2 sentences)
- Presents the Q-Zone project case study in the same reusable detail framework.

### 2) What the user can do
- Navigate back to `/projects`.
- Open Live Demo and Source Code links.
- Watch embedded Vimeo demo.
- Read implementation highlights and outcomes.

### 3) What I built (implementation summary)
- Route-level wrapper with project existence check + shared `ProjectDetailLayout` rendering.
- Q-Zone content is supplied as data object fields (stack, overview, features, outcomes).
- Maintains identical interaction and layout behavior to other case-study pages.

### 4) Data / content source
- Static content only.
- Base project list from `src/data/projects.js`.
- Case-specific content from `src/data/projects/qzone.js`.

### 5) Notable technical points (interview bullets)
- Project pages are normalized through one layout component and distinct data files.
- Route-level fallback avoids rendering null/undefined project state.
- Strong consistency across project routes simplifies interview walkthrough.

### 6) Edge cases / error handling
- Invalid/missing project data redirects to `/projects`.
- Optional media gracefully degrades to placeholder messaging.

### 7) Files to review
- `src/pages/Projects/projects/QZoneProjectPage.tsx`
- `src/pages/Projects/projects/ProjectDetailLayout.tsx`
- `src/pages/Projects/projects/project-detail-glow.css`
- `src/data/projects.js`
- `src/data/projects/qzone.js`

## /projects/xpensync — XpenSync Case Study
### 1) Purpose (1-2 sentences)
- Provides XpenSync case-study details including finance-focused features and outcomes.

### 2) What the user can do
- Navigate back to `/projects`.
- Open Live Demo and Source Code links.
- Review overview, focus areas, and outcomes.
- See placeholder notice for missing demo video.

### 3) What I built (implementation summary)
- Same route-wrapper pattern + shared `ProjectDetailLayout` reuse.
- Project detail data indicates no video embed and uses custom placeholder text.
- Uniform styling/animation/metadata blocks kept consistent with other project routes.

### 4) Data / content source
- Static content only.
- Base project metadata from `src/data/projects.js`.
- XpenSync-specific copy from `src/data/projects/xpensync.js`.
- Inference: `demoHref` is internal (`/XpenSync/`) and may rely on separate hosted asset/path outside this repo.

### 5) Notable technical points (interview bullets)
- Demonstrates handling of optional data fields in a reusable template (video omitted).
- Maintains route consistency while allowing per-project differences via data overrides.
- Good example of scalable case-study model for adding future projects.

### 6) Edge cases / error handling
- Missing project object redirects to `/projects`.
- Empty `videoHref` triggers fallback placeholder (“Quick demo coming soon.”).

### 7) Files to review
- `src/pages/Projects/projects/XpenSyncProjectPage.tsx`
- `src/pages/Projects/projects/ProjectDetailLayout.tsx`
- `src/pages/Projects/projects/project-detail-glow.css`
- `src/data/projects.js`
- `src/data/projects/xpensync.js`

## /resume — Resume
### 1) Purpose (1-2 sentences)
- Displays a polished, structured online resume with profile summary, contact strip, skills, education, certifications, projects, and references.

### 2) What the user can do
- Download resume via external link.
- Jump to Projects page.
- Open phone/email/website links from contact strip.
- Scan resume sections and project highlight summaries.

### 3) What I built (implementation summary)
- Page is split into `ResumeHero` and `ResumeDetailsSection` under `ResumePage`.
- One-time intro animation behavior per session using `sessionStorage` key.
- Section-level motion variants and staggered reveals for readability.
- Content sections are data-driven from a single `resume` object.
- Responsive two-column layout on larger screens; stacked sections on mobile.

### 4) Data / content source
- Static content only.
- Resume content from `src/data/resume.js`.
- No backend/API calls on this route.

### 5) Notable technical points (interview bullets)
- Resume is fully data-driven, so content updates mostly happen in one file.
- Contact info links are normalized (`tel:` and website URL formatting).
- Animation variants are centralized (`motionVariants.js`) to keep transitions consistent.
- Good sectioning semantics improve readability and maintainability.
- Inference: there are minor encoding artifacts in resume data (e.g., smart quote rendering) to clean before interview.

### 6) Edge cases / error handling
- If session storage access fails, page still renders; animation defaults safely.
- Reduced-motion/mobile users get simplified animation behavior.

### 7) Files to review
- `src/pages/Resume/Resume.jsx`
- `src/pages/Resume/ResumePage.tsx`
- `src/pages/Resume/sections/ResumeHero.tsx`
- `src/pages/Resume/sections/ResumeDetailsSection.tsx`
- `src/pages/Resume/motionVariants.js`
- `src/data/resume.js`

## /contact — Contact
### 1) Purpose (1-2 sentences)
- Lets visitors contact you directly and view core contact/social information.

### 2) What the user can do
- View email/phone/address and click direct contact links.
- Open social profile links.
- Submit Name/Email/Message through contact form.

### 3) What I built (implementation summary)
- Contact route renders `ContactFormSection` + shared `Footer`.
- Two-column layout: contact info/socials panel and message form panel.
- Form submit state machine (`idle`, `sending`, `success`, `error`) with inline status feedback.
- First-visit intro animation sequencing and CTA sheen micro-animation.
- Accessibility-aware labels/required fields and responsive layout.

### 4) Data / content source
- Mixed static + API.
- Static contact/social data from `src/data/profile.js` and `socialusernames`.
- API call: `POST https://api.web3forms.com/submit` in `ContactFormSection.tsx`.
- API credential source: `VITE_WEB3FORMS_ACCESS_KEY` from `.env`.
- If API key is absent, fallback behavior opens `mailto:` using entered values.

### 5) Notable technical points (interview bullets)
- Pragmatic API fallback design: no key means direct email still works.
- Clear async UX states prevent silent submission failure.
- Form logic is local and lightweight without adding heavy form libraries.
- Contact/social panel content is data-driven and easy to maintain.
- Motion is controlled by visit state and reduced-motion checks.

### 6) Edge cases / error handling
- Failed API response sets error state and shows user-facing error message.
- Missing Web3Forms key bypasses fetch and redirects to `mailto:` fallback.
- Social link list is filtered to remove empty URLs.

### 7) Files to review
- `src/pages/Contact/Contact.jsx`
- `src/pages/Contact/ContactPage.tsx`
- `src/pages/Contact/sections/ContactFormSection.tsx`
- `src/data/profile.js`
- `.env`

## * — Not Found
### 1) Purpose (1-2 sentences)
- Handles unmatched routes with a themed 404 experience and recovery navigation options.

### 2) What the user can do
- Go back to Home.
- Navigate to Projects from fallback CTA.

### 3) What I built (implementation summary)
- Dedicated `NotFound` component rendered by wildcard route.
- Theme-aware visual mode synchronized from body class via `MutationObserver`.
- Dark mode includes `LightRays` layered visual effects; light mode uses minimal fallback UI.
- Responsive full-height layout with clear action buttons.

### 4) Data / content source
- Static content only.
- No data files or API calls.

### 5) Notable technical points (interview bullets)
- Explicit wildcard route (`*`) ensures bad URLs are handled cleanly.
- Theme synchronization keeps 404 experience consistent with app-wide mode.
- Recovery CTAs reduce dead ends and preserve user flow.
- Polished fallback page demonstrates attention to UX beyond happy paths.

### 6) Edge cases / error handling
- Any unmatched URL resolves to this page.
- Theme observer disconnects on unmount to avoid leaks.

### 7) Files to review
- `src/pages/NotFound/NotFound.jsx`
- `src/app/App.jsx`

## Global Route Shell / Shared Behavior (applies to all routes)
### 1) Purpose (1-2 sentences)
- Defines shared app behavior across every page: routing, lazy loading, SEO injection, navigation, theme toggling, and scroll reset.

### 2) What the user can do
- Use top navigation (desktop) and bottom navigation (mobile).
- Toggle dark/light theme.
- Navigate between all pages with automatic scroll-to-top.

### 3) What I built (implementation summary)
- `App.jsx` wraps all routes with shared layout/effects and `Suspense` fallback.
- `HeaderBar` controls global theme state via body class + localStorage.
- `BottomNavbar` provides mobile-optimized route nav.
- `SeoManager` computes route-specific metadata each navigation.

### 4) Data / content source
- Static route map + static SEO config.
- No runtime backend dependency for route shell behavior.

### 5) Notable technical points (interview bullets)
- Lazy loading for non-home routes improves initial load strategy.
- Centralized SEO manager keeps metadata consistent and DRY.
- View-transition-ready animated theme toggle with responsive fallback.
- Scroll restoration prevents confusing mid-page route entry.

### 6) Edge cases / error handling
- Unknown routes route to NotFound.
- Theme defaults to dark if no stored preference is present.
- Loading fallback handles delayed lazy imports.

### 7) Files to review
- `src/app/main.jsx`
- `src/app/App.jsx`
- `src/components/layout/HeaderBar.jsx`
- `src/components/layout/BottomNavbar.jsx`
- `src/components/layout/ScrollToTop.jsx`
- `src/components/ui/animated-theme-toggler.jsx`
- `src/seo/SeoManager.jsx`
- `src/seo/routeSeo.js`

## SEO + Deployment Notes
### 1) Purpose (1-2 sentences)
- Documents discoverability and deployment-related implementation found in the repo.

### 2) What the user can do
- N/A (build/deploy oriented).

### 3) What I built (implementation summary)
- Runtime SEO tags through Helmet (title, meta description, robots, OG/Twitter, canonical, JSON-LD).
- Build-time route prerendering script outputs static `dist/<route>/index.html` variants.
- Build-time sitemap/robots generation and postbuild sitemap copy into `dist`.

### 4) Data / content source
- Static route metadata in `src/seo/routeSeo.js` and `scripts/prerender-routes.mjs`.
- Site URL source from `VITE_SITE_URL` in `.env`.

### 5) Notable technical points (interview bullets)
- Canonical URLs and route-specific OG metadata are computed from active pathname.
- JSON-LD includes Person/WebSite/CollectionPage/CreativeWork depending on route.
- Sitemap includes all core routes and project detail pages.
- Vite build uses manual chunking for motion/three vendor groups.
- Inference: no explicit host config file (`vercel.json`, `netlify.toml`, etc.) was found, so deployment likely uses platform defaults.

### 6) Edge cases / error handling
- If `VITE_SITE_URL` is missing, SEO generation scripts fall back to `https://example.com` and warn.
- Unknown runtime routes are marked `noindex, nofollow` via SEO config fallback.

### 7) Files to review
- `src/seo/SeoManager.jsx`
- `src/seo/routeSeo.js`
- `scripts/generate-seo-files.mjs`
- `scripts/prerender-routes.mjs`
- `scripts/copy-sitemap.js`
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`
- `vite.config.js`
- `package.json`
- `.env`

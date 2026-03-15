import linqlyPreview from "@/assets/images/projects/linqlypreview.webp";
import qzonePreview from "@/assets/images/projects/qzonepreview.webp";
import thryvePreview from "@/assets/images/projects/thryvepreview.webp";
import bakeWithLovePreview from "@/assets/images/projects/bakewithlovepreview.webp";
import accorePreview from "@/assets/images/projects/accorepreview.webp";

export const featuredProjects = [
  {
    id: "linqly",
    projectHref: "/projects/linqly",
    title: "Linqly",
    description:
      "Linqly is a real-time social messaging web app built with React and Bootstrap on the frontend, and Node.js/Express with MongoDB on the backend.",
    stack: ["React", "Node", "MongoDB", "Socket.IO", "JWT"],
    preview: linqlyPreview,
    demoHref: "https://linqly.kianangeles.dev/",
    sourceHref: "https://github.com/KianAngeles/Linqly",
  },
  {
    id: "thryve",
    projectHref: "/projects/thryve",
    title: "Thryve",
    description:
      "Thryve is a full-stack health and fitness web app built with Vue 3 and PrimeVue on the frontend, and Node.js/Express with MongoDB on the backend.",
    stack: ["MongoDB", "Express", "Vue.js", "Node.js", "JWT auth"],
    preview: thryvePreview,
    demoHref: "https://thryvefitness.vercel.app/",
    sourceHref: "https://github.com/iyawnnn/Thryve",
  },
  {
    id: "qzone",
    projectHref: "/projects/qzone",
    title: "Q-Zone Professional Detailers",
    description:
      "Q-Zone Professional Detailers is a multi-page car detailing web app built with Angular and TypeScript, featuring services, company information, and an employee directory.",
    stack: ["Angular", "TypeScript", "Bootstrap", "Angular Router", "RxJS"],
    preview: qzonePreview,
    demoHref: "https://qzoneph.netlify.app/",
    sourceHref: "https://github.com/iyawnnn/Q-Zone-Professional-Detailers",
  },
  {
    id: "accore",
    projectHref: "/projects/accore",
    title: "AC-CORE",
    description:
      "AC-CORE is a full-stack civic hazard reporting platform for Angeles City, featuring citizen-side reporting and tracking, plus an admin command center with maps, analytics, and report management.",
    stack: [
      "Angular",
      "TypeScript",
      "Express",
      "MongoDB",
      "Leaflet",
      "JWT auth",
    ],
    preview: accorePreview,
    demoHref: "https://ac-coreph.netlify.app/",
    sourceHref: "https://github.com/MMPA-Works/AC-CORE/tree/main",
  },
  {
    id: "bake-with-love",
    projectHref: "/projects/bake-with-love",
    title: "Bake With Love",
    description:
      "Bake With Love is a responsive multi-page bakery website built with HTML, CSS, and JavaScript, featuring product browsing, cart management with localStorage, filtering/search, testimonials, and a contact form powered by EmailJS.",
    stack: [
      "HTML5",
      "CSS3",
      "JavaScript",
    ],
    preview: bakeWithLovePreview,
    demoHref: "https://kianangeles.github.io/Bake-With-Love/",
    sourceHref: "https://github.com/KianAngeles/Bake-With-Love",
  },
];

export function getProjectById(projectId) {
  return featuredProjects.find((project) => project.id === projectId) ?? null;
}

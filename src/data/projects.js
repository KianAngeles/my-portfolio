import linqlyPreview from "@/assets/images/projects/linqlypreview.webp";
import qzonePreview from "@/assets/images/projects/qzonepreview.webp";
import thryvePreview from "@/assets/images/projects/thryvepreview.webp";
import xpensyncPreview from "@/assets/images/projects/xpensyncpreview.webp";

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
    id: "xpensync",
    projectHref: "/projects/xpensync",
    title: "XpenSync",
    description:
      "XpenSync is a multi-page personal finance web app built with PHP and MySQL, featuring user authentication, expense tracking, lending management, and analytics dashboards.",
    stack: [
      "PHP",
      "MySQL",
      "JavaScript",
      "HTML",
      "CSS",
      "Bootstrap",
    ],
    preview: xpensyncPreview,
    demoHref: "/XpenSync/",
    sourceHref: "https://github.com/KianAngeles/XpenSync-Finals",
  },
];

export function getProjectById(projectId) {
  return featuredProjects.find((project) => project.id === projectId) ?? null;
}

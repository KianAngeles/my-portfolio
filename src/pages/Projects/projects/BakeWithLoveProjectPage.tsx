import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { bakeWithLoveProjectDetails } from "@/data/projects/bakewithlove";
import { ROUTES } from "@/lib/routes";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function BakeWithLoveProjectPage() {
  const project = getProjectById("bake-with-love");
  if (!project) return <Navigate to={ROUTES.projects} replace />;

  return <ProjectDetailLayout project={project} {...bakeWithLoveProjectDetails} />;
}

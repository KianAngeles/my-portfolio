import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { bakeWithLoveProjectDetails } from "@/data/projects/bakewithlove";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function BakeWithLoveProjectPage() {
  const project = getProjectById("bake-with-love");
  if (!project) return <Navigate to="/projects" replace />;

  return <ProjectDetailLayout project={project} {...bakeWithLoveProjectDetails} />;
}

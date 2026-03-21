import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { acCoreProjectDetails } from "@/data/projects/accore";
import { ROUTES } from "@/lib/routes";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function AccoreProjectPage() {
  const project = getProjectById("accore");
  if (!project) return <Navigate to={ROUTES.projects} replace />;

  return <ProjectDetailLayout project={project} {...acCoreProjectDetails} />;
}

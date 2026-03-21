import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { linqlyProjectDetails } from "@/data/projects/linqly";
import { ROUTES } from "@/lib/routes";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function LinqlyProjectPage() {
  const project = getProjectById("linqly");
  if (!project) return <Navigate to={ROUTES.projects} replace />;

  return <ProjectDetailLayout project={project} {...linqlyProjectDetails} />;
}

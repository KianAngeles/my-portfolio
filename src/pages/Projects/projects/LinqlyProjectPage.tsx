import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { linqlyProjectDetails } from "@/data/projects/linqly";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function LinqlyProjectPage() {
  const project = getProjectById("linqly");
  if (!project) return <Navigate to="/projects" replace />;

  return <ProjectDetailLayout project={project} {...linqlyProjectDetails} />;
}

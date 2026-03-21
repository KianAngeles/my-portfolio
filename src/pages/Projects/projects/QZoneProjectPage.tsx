import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { qzoneProjectDetails } from "@/data/projects/qzone";
import { ROUTES } from "@/lib/routes";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function QZoneProjectPage() {
  const project = getProjectById("qzone");
  if (!project) return <Navigate to={ROUTES.projects} replace />;

  return <ProjectDetailLayout project={project} {...qzoneProjectDetails} />;
}

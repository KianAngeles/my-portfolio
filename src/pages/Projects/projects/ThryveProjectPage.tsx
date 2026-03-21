import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { thryveProjectDetails } from "@/data/projects/thryve";
import { ROUTES } from "@/lib/routes";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function ThryveProjectPage() {
  const project = getProjectById("thryve");
  if (!project) return <Navigate to={ROUTES.projects} replace />;

  return <ProjectDetailLayout project={project} {...thryveProjectDetails} />;
}

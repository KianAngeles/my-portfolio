import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { thryveProjectDetails } from "@/data/projects/thryve";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function ThryveProjectPage() {
  const project = getProjectById("thryve");
  if (!project) return <Navigate to="/projects" replace />;

  return <ProjectDetailLayout project={project} {...thryveProjectDetails} />;
}

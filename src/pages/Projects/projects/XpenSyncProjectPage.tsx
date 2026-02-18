import { Navigate } from "react-router-dom";
import { getProjectById } from "@/data/projects";
import { xpensyncProjectDetails } from "@/data/projects/xpensync";
import ProjectDetailLayout from "./ProjectDetailLayout";

export default function XpenSyncProjectPage() {
  const project = getProjectById("xpensync");
  if (!project) return <Navigate to="/projects" replace />;

  return <ProjectDetailLayout project={project} {...xpensyncProjectDetails} />;
}

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";

export const getProjectForCurrentWorkspaceOrThrow = async (
  projectId: string
) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspace.id,
    },
  });

  if (!project) {
    notFound();
  }

  return project;
};
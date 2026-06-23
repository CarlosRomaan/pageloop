import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const getWorkspaceActivity = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const activities = await prisma.activityLog.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: true,
      project: true,
    },
  });

  return {
    workspace,
    activities,
  };
};
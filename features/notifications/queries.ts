import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const getNotificationItems = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const activities = await prisma.activityLog.findMany({
    where: {
      workspaceId: workspace.id,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: true,
      project: true,
    },
  });

  return activities;
};
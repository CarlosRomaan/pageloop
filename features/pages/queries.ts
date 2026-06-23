import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const getWorkspacePages = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const pages = await prisma.page.findMany({
    where: {
      project: {
        workspaceId: workspace.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      project: true,
      comments: true,
    },
  });

  return pages;
};
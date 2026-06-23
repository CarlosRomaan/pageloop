import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export type WorkspacePagesFilter = "active" | "archived" | "with-comments";

export const getWorkspacePages = async (filter?: WorkspacePagesFilter) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const pages = await prisma.page.findMany({
    where: {
      isArchived:
        filter === "active"
          ? false
          : filter === "archived"
            ? true
            : undefined,
      comments:
        filter === "with-comments"
          ? {
              some: {},
            }
          : undefined,
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
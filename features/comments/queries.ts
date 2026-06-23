import type { CommentStatus } from "@prisma/client";

import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const getWorkspaceComments = async (status?: CommentStatus) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const comments = await prisma.comment.findMany({
    where: {
      status,
      project: {
        workspaceId: workspace.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      page: true,
      author: true,
      assignee: true,
    },
  });

  return comments;
};
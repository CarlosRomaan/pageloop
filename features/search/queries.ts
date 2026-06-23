import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const searchWorkspace = async (query: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return {
      projects: [],
      comments: [],
      pages: [],
    };
  }

  const [projects, comments, pages] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
        name: {
          contains: cleanQuery,
          mode: "insensitive",
        },
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.comment.findMany({
      where: {
        message: {
          contains: cleanQuery,
          mode: "insensitive",
        },
        project: {
          workspaceId: workspace.id,
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
        page: true,
      },
    }),

    prisma.page.findMany({
      where: {
        OR: [
          {
            title: {
              contains: cleanQuery,
              mode: "insensitive",
            },
          },
          {
            path: {
              contains: cleanQuery,
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: cleanQuery,
              mode: "insensitive",
            },
          },
        ],
        project: {
          workspaceId: workspace.id,
        },
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        project: true,
      },
    }),
  ]);

  return {
    projects,
    comments,
    pages,
  };
};
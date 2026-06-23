import { prisma } from "@/lib/prisma";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";

export const getDefaultWorkspace = async () => {
  const workspace = await prisma.workspace.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  return workspace;
};

export const getWorkspaceSettings = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const [members, projectsCount] = await Promise.all([
    prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: true,
      },
    }),

    prisma.project.count({
      where: {
        workspaceId: workspace.id,
      },
    }),
  ]);

  return {
    workspace,
    members,
    membersCount: members.length,
    projectsCount,
  };
};
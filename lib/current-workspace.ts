import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { getCurrentUser } from "@/lib/current-user";

export const getCurrentWorkspace = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const existingMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      workspace: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (existingMembership) {
    return existingMembership.workspace;
  }

  const workspaceName = user.name
    ? `${user.name}'s Workspace`
    : "My Workspace";

  const workspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
      slug: `${createSlug(workspaceName)}-${user.id.slice(0, 6)}`,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  return workspace;
};
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const getPostLoginRedirectPath = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return "/login";
  }

  const clientProject = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      role: "CLIENT",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const adminOrMemberProject = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      role: {
        in: ["ADMIN", "MEMBER"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (adminOrMemberProject) {
    return "/dashboard";
  }

  if (clientProject) {
    return "/client";
  }

  return "/dashboard";
};
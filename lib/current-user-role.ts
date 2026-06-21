import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const isCurrentUserClientOnly = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const adminOrMemberProject = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      role: {
        in: ["ADMIN", "MEMBER"],
      },
    },
  });

  if (adminOrMemberProject) {
    return false;
  }

  const clientProject = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      role: "CLIENT",
    },
  });

  return Boolean(clientProject);
};
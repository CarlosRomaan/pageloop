import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const getCurrentProjectMemberOrThrow = async (projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: user.id,
      },
    },
    include: {
      user: true,
    },
  });

  if (!member) {
    notFound();
  }

  return member;
};

export const canManageProject = (role: string) => {
  return role === "ADMIN";
};

export const canAccessProjectSettings = (role: string) => {
  return role === "ADMIN";
};

export const canAccessProjectTeam = (role: string) => {
  return role === "ADMIN";
};

export const canAccessInstallation = (role: string) => {
  return role === "ADMIN";
};
import type { ActivityType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const createActivityLog = async ({
  workspaceId,
  projectId,
  actorId,
  type,
  message,
  metadata,
}: {
  workspaceId: string;
  projectId?: string | null;
  actorId?: string | null;
  type: ActivityType;
  message?: string;
  metadata?: Prisma.InputJsonValue;
}) => {
  await prisma.activityLog.create({
    data: {
      workspaceId,
      projectId,
      actorId,
      type,
      message,
      metadata,
    },
  });
};
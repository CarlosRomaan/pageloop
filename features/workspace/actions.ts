"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";

export const updateWorkspaceSettings = async ({
  name,
}: {
  name: string;
}) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  if (!name.trim()) {
    return;
  }

  await prisma.workspace.update({
    where: {
      id: workspace.id,
    },
    data: {
      name: name.trim(),
    },
  });

  revalidatePath("/settings");
};
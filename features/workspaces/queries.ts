import { prisma } from "@/lib/prisma";

export const getDefaultWorkspace = async () => {
  const workspace = await prisma.workspace.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  return workspace;
};


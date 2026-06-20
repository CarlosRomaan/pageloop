import { notFound } from "next/navigation";

import { getCurrentWorkspace } from "@/lib/current-workspace";

export const getCurrentWorkspaceOrThrow = async () => {
  const workspace = await getCurrentWorkspace();

  if (!workspace) {
    notFound();
  }

  return workspace;
};
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export const updateProjectSettings = async ({
  projectId,
  projectSlug,
  name,
  description,
}: {
  projectId: string;
  projectSlug: string;
  name: string;
  description?: string;
}) => {
  if (!name.trim()) {
    return;
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: name.trim(),
      description: description?.trim() || null,
    },
  });

  revalidatePath(`/projects/${projectSlug}`);
  revalidatePath(`/projects/${projectSlug}/settings`);
};

export const toggleProjectArchiveStatus = async ({
  projectId,
  projectSlug,
}: {
  projectId: string;
  projectSlug: string;
}) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return;
  }

  const isArchived = project.status === "ARCHIVED";

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status: isArchived ? "ACTIVE" : "ARCHIVED",
      archivedAt: isArchived ? null : new Date(),
    },
  });

  revalidatePath(`/projects/${projectSlug}`);
  revalidatePath(`/projects/${projectSlug}/settings`);
  revalidatePath("/dashboard");
};

export const addProjectDomain = async ({
  projectId,
  projectSlug,
  domain,
}: {
  projectId: string;
  projectSlug: string;
  domain: string;
}) => {
  const cleanDomain = domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!cleanDomain) {
    return;
  }

  await prisma.projectDomain.create({
    data: {
      projectId,
      domain: cleanDomain,
      isVerified: false,
    },
  });

  revalidatePath(`/projects/${projectSlug}/settings`);
  revalidatePath(`/projects/${projectSlug}/installation`);
};

export const removeProjectDomain = async ({
  domainId,
  projectSlug,
}: {
  domainId: string;
  projectSlug: string;
}) => {
  await prisma.projectDomain.delete({
    where: {
      id: domainId,
    },
  });

  revalidatePath(`/projects/${projectSlug}/settings`);
  revalidatePath(`/projects/${projectSlug}/installation`);
};
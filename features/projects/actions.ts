"use server";

import { redirect } from "next/navigation";

import {
  createWidgetPublicKey,
  createWidgetSecretKey,
} from "@/lib/project-keys";
import { createSlug } from "@/lib/slug";
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

export const createProject = async ({
  workspaceId,
  name,
  description,
  domain,
}: {
  workspaceId: string;
  name: string;
  description?: string;
  domain: string;
}) => {
  const cleanName = name.trim();
  const cleanDomain = domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!cleanName || !cleanDomain) {
    return;
  }

  const slug = createSlug(cleanName);

  const project = await prisma.project.create({
    data: {
      workspaceId,
      name: cleanName,
      slug,
      description: description?.trim() || null,
      widgetPublicKey: createWidgetPublicKey(),
      widgetSecretKey: createWidgetSecretKey(),
      domains: {
        create: {
          domain: cleanDomain,
          isVerified: false,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");

  redirect(`/projects/${project.slug}`);
};
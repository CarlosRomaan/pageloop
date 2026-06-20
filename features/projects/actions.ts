"use server";

import { redirect } from "next/navigation";

import {
  createWidgetPublicKey,
  createWidgetSecretKey,
} from "@/lib/project-keys";
import { createSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

import { getProjectForCurrentWorkspaceOrThrow } from "@/lib/project-access";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";

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
  const project = await getProjectForCurrentWorkspaceOrThrow(projectId);

  if (!name.trim()) {
    return;
  }

  await prisma.project.update({
    where: {
      id: project.id,
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
  const project = await getProjectForCurrentWorkspaceOrThrow(projectId);

  const isArchived = project.status === "ARCHIVED";

  await prisma.project.update({
    where: {
      id: project.id,
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
  const project = await getProjectForCurrentWorkspaceOrThrow(projectId);

  const cleanDomain = domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!cleanDomain) {
    return;
  }

  await prisma.projectDomain.create({
    data: {
      projectId: project.id,
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
  const workspace = await getCurrentWorkspaceOrThrow();

  if (!workspace) {
    return;
  }

  const domain = await prisma.projectDomain.findFirst({
    where: {
      id: domainId,
      project: {
        workspaceId: workspace.id,
      },
    },
  });

  if (!domain) {
    return;
  }

  await prisma.projectDomain.delete({
    where: {
      id: domain.id,
    },
  });

  revalidatePath(`/projects/${projectSlug}/settings`);
  revalidatePath(`/projects/${projectSlug}/installation`);
};

export const createProject = async ({
  name,
  description,
  domain,
}: {
  name: string;
  description?: string;
  domain: string;
}) => {
  const workspace = await getCurrentWorkspaceOrThrow();

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
      workspaceId: workspace.id,
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
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProjectRole } from "@prisma/client";

import { sendProjectInviteEmail } from "@/features/emails/send-project-invite-email";
import { createActivityLog } from "@/lib/activity-log";
import { getCurrentUser } from "@/lib/current-user";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { createInviteToken } from "@/lib/invite-token";
import { getProjectForCurrentWorkspaceOrThrow } from "@/lib/project-access";
import { createWidgetPublicKey, createWidgetSecretKey } from "@/lib/project-keys";
import {
  canManageProject,
  getCurrentProjectMemberOrThrow,
} from "@/lib/project-permissions";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";

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
  const member = await getCurrentProjectMemberOrThrow(project.id);

  if (!canManageProject(member.role)) {
    return;
  }

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

  await createActivityLog({
    workspaceId: project.workspaceId,
    projectId: project.id,
    actorId: member.userId,
    type: "PROJECT_UPDATED",
    message: `Updated project ${name.trim()}.`,
    metadata: {
      projectId: project.id,
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
  const member = await getCurrentProjectMemberOrThrow(project.id);

  if (!canManageProject(member.role)) {
    return;
  }

  const isArchived = project.status === "ARCHIVED";
  const nextStatus = isArchived ? "ACTIVE" : "ARCHIVED";

  await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      status: nextStatus,
      archivedAt: isArchived ? null : new Date(),
    },
  });

  await createActivityLog({
    workspaceId: project.workspaceId,
    projectId: project.id,
    actorId: member.userId,
    type: "PROJECT_UPDATED",
    message: isArchived
      ? `Restored project ${project.name}.`
      : `Archived project ${project.name}.`,
    metadata: {
      projectId: project.id,
      fromStatus: project.status,
      toStatus: nextStatus,
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
  const member = await getCurrentProjectMemberOrThrow(project.id);

  if (!canManageProject(member.role)) {
    return;
  }

  const cleanDomain = domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!cleanDomain) {
    return;
  }

  const projectDomain = await prisma.projectDomain.create({
    data: {
      projectId: project.id,
      domain: cleanDomain,
      isVerified: false,
    },
  });

  await createActivityLog({
    workspaceId: project.workspaceId,
    projectId: project.id,
    actorId: member.userId,
    type: "DOMAIN_ADDED",
    message: `Added domain ${cleanDomain}.`,
    metadata: {
      projectId: project.id,
      domainId: projectDomain.id,
      domain: cleanDomain,
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

  const domain = await prisma.projectDomain.findFirst({
    where: {
      id: domainId,
      project: {
        workspaceId: workspace.id,
      },
    },
    include: {
      project: true,
    },
  });

  if (!domain) {
    return;
  }

  const member = await getCurrentProjectMemberOrThrow(domain.project.id);

  if (!canManageProject(member.role)) {
    return;
  }

  await prisma.projectDomain.delete({
    where: {
      id: domain.id,
    },
  });

  await createActivityLog({
    workspaceId: domain.project.workspaceId,
    projectId: domain.project.id,
    actorId: member.userId,
    type: "PROJECT_UPDATED",
    message: `Removed domain ${domain.domain}.`,
    metadata: {
      projectId: domain.project.id,
      domainId: domain.id,
      domain: domain.domain,
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
  const user = await getCurrentUser();

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

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: user?.id ?? "",
      },
    },
    create: {
      projectId: project.id,
      userId: user?.id ?? "",
      role: "ADMIN",
    },
    update: {},
  }).catch(async () => {
    // If the project member already exists or user is unavailable, continue.
  });

  await createActivityLog({
    workspaceId: workspace.id,
    projectId: project.id,
    actorId: user?.id ?? null,
    type: "PROJECT_CREATED",
    message: `Created project ${project.name}.`,
    metadata: {
      projectId: project.id,
      domain: cleanDomain,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");

  redirect(`/projects/${project.slug}`);
};

export const createProjectInvite = async (
  _previousState: {
    success: boolean;
    message: string;
  },
  formData: FormData
) => {
  const projectId = String(formData.get("projectId") ?? "");
  const projectSlug = String(formData.get("projectSlug") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "CLIENT") as ProjectRole;

  if (!email) {
    return {
      success: false,
      message: "Email is required.",
    };
  }

  try {
    const project = await getProjectForCurrentWorkspaceOrThrow(projectId);
    const member = await getCurrentProjectMemberOrThrow(project.id);

    if (!canManageProject(member.role)) {
      return {
        success: false,
        message: "You do not have permission to invite members.",
      };
    }

    const invite = await prisma.invite.create({
      data: {
        workspaceId: project.workspaceId,
        projectId: project.id,
        email,
        projectRole: role,
        token: createInviteToken(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    await sendProjectInviteEmail({
      email,
      projectName: project.name,
      inviteUrl: `${appUrl}/accept-invite/${invite.token}`,
    });

    await createActivityLog({
      workspaceId: project.workspaceId,
      projectId: project.id,
      actorId: member.userId,
      type: "INVITE_SENT",
      message: `Invited ${email} as ${role}.`,
      metadata: {
        inviteId: invite.id,
        email,
        projectRole: role,
      },
    });

    revalidatePath(`/projects/${projectSlug}/team`);

    return {
      success: true,
      message: "Invitation sent.",
    };
  } catch (error) {
    console.error("[CREATE_PROJECT_INVITE]", error);

    return {
      success: false,
      message: "Could not send invitation.",
    };
  }
};

export const acceptProjectInvite = async ({
  token,
}: {
  token: string;
}) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/accept-invite/${token}`);
  }

  const invite = await prisma.invite.findUnique({
    where: {
      token,
    },
    include: {
      project: true,
    },
  });

  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
    return;
  }

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: invite.workspaceId,
        userId: user.id,
      },
    },
    create: {
      workspaceId: invite.workspaceId,
      userId: user.id,
      role: invite.workspaceRole ?? "MEMBER",
    },
    update: {},
  });

  if (invite.projectId && invite.projectRole) {
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: invite.projectId,
          userId: user.id,
        },
      },
      create: {
        projectId: invite.projectId,
        userId: user.id,
        role: invite.projectRole,
      },
      update: {
        role: invite.projectRole,
      },
    });
  }

  await prisma.invite.update({
    where: {
      id: invite.id,
    },
    data: {
      acceptedAt: new Date(),
    },
  });

  await createActivityLog({
    workspaceId: invite.workspaceId,
    projectId: invite.projectId,
    actorId: user.id,
    type: "INVITE_ACCEPTED",
    message: `${user.name ?? user.email} accepted an invitation.`,
    metadata: {
      inviteId: invite.id,
      email: invite.email,
      projectRole: invite.projectRole,
      workspaceRole: invite.workspaceRole,
    },
  });

  if (invite.project) {
    redirect(`/projects/${invite.project.slug}`);
  }

  redirect("/dashboard");
};

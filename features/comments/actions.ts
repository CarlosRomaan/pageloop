"use server";

import { revalidatePath } from "next/cache";

import type { CommentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/current-user";

export const updateCommentStatus = async ({
  commentId,
  projectSlug,
  status,
}: {
  commentId: string;
  projectSlug: string;
  status: CommentStatus;
}) => {
  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });

  await prisma.commentStatusHistory.create({
    data: {
      commentId,
      changedById: comment.authorId,
      fromStatus: comment.status,
      toStatus: status,
    },
  });

  revalidatePath(`/projects/${projectSlug}/comments`);
  revalidatePath(`/projects/${projectSlug}/comments/${commentId}`);
};

export const assignComment = async ({
  commentId,
  projectSlug,
  assigneeId,
}: {
  commentId: string;
  projectSlug: string;
  assigneeId: string | null;
}) => {
  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      assigneeId,
    },
  });

  revalidatePath(`/projects/${projectSlug}/comments`);
  revalidatePath(`/projects/${projectSlug}/comments/${commentId}`);
};

export const createCommentReply = async ({
  commentId,
  projectSlug,
  authorId,
  message,
}: {
  commentId: string;
  projectSlug: string;
  authorId: string;
  message: string;
}) => {
  if (!message.trim()) {
    return;
  }

  await prisma.commentReply.create({
    data: {
      commentId,
      authorId,
      message,
    },
  });

  revalidatePath(`/projects/${projectSlug}/comments`);
  revalidatePath(`/projects/${projectSlug}/comments/${commentId}`);
};

export const createAuthenticatedCommentReply = async ({
  commentId,
  projectSlug,
  message,
  redirectBase = "projects",
}: {
  commentId: string;
  projectSlug: string;
  message: string;
  redirectBase?: "projects" | "client/projects";
}) => {
  const user = await getCurrentUser();

  if (!user || !message.trim()) {
    return;
  }

  await prisma.commentReply.create({
    data: {
      commentId,
      authorId: user.id,
      message: message.trim(),
    },
  });

  revalidatePath(`/${redirectBase}/${projectSlug}/comments/${commentId}`);
};

export const updateClientCommentStatus = async ({
  commentId,
  projectSlug,
  status,
}: {
  commentId: string;
  projectSlug: string;
  status: "IN_REVIEW" | "RESOLVED";
}) => {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const membership = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      role: "CLIENT",
      project: {
        slug: projectSlug,
      },
    },
    include: {
      project: true,
    },
  });

  if (!membership) {
    return;
  }

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      projectId: membership.projectId,
    },
  });

  if (!comment) {
    return;
  }

  await prisma.comment.update({
    where: {
      id: comment.id,
    },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });

  await prisma.commentStatusHistory.create({
    data: {
      commentId: comment.id,
      changedById: user.id,
      fromStatus: comment.status,
      toStatus: status,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: membership.project.workspaceId,
      projectId: membership.projectId,
      actorId: user.id,
      type: "COMMENT_STATUS_CHANGED",
      message: `Client moved comment #${comment.number} to ${status}.`,
    },
  });

  revalidatePath(`/client/projects/${projectSlug}`);
  revalidatePath(`/client/projects/${projectSlug}/comments/${commentId}`);
};
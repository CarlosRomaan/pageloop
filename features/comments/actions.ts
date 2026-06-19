"use server";

import { revalidatePath } from "next/cache";

import type { CommentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

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
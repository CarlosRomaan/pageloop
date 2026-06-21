"use server";

import { revalidatePath } from "next/cache";

import type { CommentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/current-user";

import { sendCommentAssignedEmail } from "@/features/emails/send-comment-assigned-email";
import { sendCommentReplyEmail } from "@/features/emails/send-comment-reply-email";
import { sendCommentStatusEmail } from "@/features/emails/send-comment-status-email";

export const updateCommentStatus = async ({
  commentId,
  projectSlug,
  status,
}: {
  commentId: string;
  projectSlug: string;
  status: CommentStatus;
}) => {
  const currentUser = await getCurrentUser();

  const existingComment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!existingComment) {
    return;
  }

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
    include: {
      project: true,
      author: true,
      assignee: true,
    },
  });

  await prisma.commentStatusHistory.create({
    data: {
      commentId,
      changedById: currentUser?.id ?? existingComment.authorId,
      fromStatus: existingComment.status,
      toStatus: status,
    },
  });

  if (status === "IN_REVIEW" || status === "RESOLVED") {
    const recipients = [comment.author, comment.assignee].filter(
      (
        recipient,
        index,
        array
      ): recipient is NonNullable<typeof recipient> =>
        !!recipient?.email &&
        recipient.id !== currentUser?.id &&
        array.findIndex((item) => item?.id === recipient.id) === index
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    await Promise.all(
      recipients.map((recipient) =>
        sendCommentStatusEmail({
          email: recipient.email,
          projectName: comment.project.name,
          commentNumber: comment.number,
          status,
          commentUrl: `${appUrl}/projects/${projectSlug}/comments/${commentId}`,
        })
      )
    );
  }

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
  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      assigneeId,
    },
    include: {
      project: true,
      assignee: true,
    },
  });

  if (comment.assignee?.email) {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    await sendCommentAssignedEmail({
      email: comment.assignee.email,
      projectName: comment.project.name,
      commentNumber: comment.number,
      commentMessage: comment.message,
      commentUrl: `${appUrl}/projects/${projectSlug}/comments/${comment.id}`,
    });
  }

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

  const reply = await prisma.commentReply.create({
    data: {
      commentId,
      authorId,
      message: message.trim(),
    },
    include: {
      comment: {
        include: {
          project: true,
          author: true,
          assignee: true,
        },
      },
    },
  });

  const recipients = [
    reply.comment.author,
    reply.comment.assignee,
  ].filter(
    (
      recipient,
      index,
      array
    ): recipient is NonNullable<typeof recipient> =>
      !!recipient?.email &&
      recipient.id !== authorId &&
      array.findIndex((item) => item?.id === recipient.id) === index
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await Promise.all(
    recipients.map((recipient) =>
      sendCommentReplyEmail({
        email: recipient.email,
        projectName: reply.comment.project.name,
        commentNumber: reply.comment.number,
        replyMessage: reply.message,
        commentUrl: `${appUrl}/projects/${projectSlug}/comments/${commentId}`,
      })
    )
  );

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

  const reply = await prisma.commentReply.create({
    data: {
      commentId,
      authorId: user.id,
      message: message.trim(),
    },
    include: {
      comment: {
        include: {
          project: true,
          author: true,
          assignee: true,
        },
      },
    },
  });

  const recipients = [
    reply.comment.author,
    reply.comment.assignee,
  ].filter(
    (
      recipient,
      index,
      array
    ): recipient is NonNullable<typeof recipient> =>
      !!recipient?.email &&
      recipient.id !== user.id &&
      array.findIndex((item) => item?.id === recipient.id) === index
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await Promise.all(
    recipients.map((recipient) =>
      sendCommentReplyEmail({
        email: recipient.email,
        projectName: reply.comment.project.name,
        commentNumber: reply.comment.number,
        replyMessage: reply.message,
        commentUrl: `${appUrl}/${redirectBase}/${projectSlug}/comments/${commentId}`,
      })
    )
  );

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

  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      projectId: membership.projectId,
    },
  });

  if (!existingComment) {
    return;
  }

  const comment = await prisma.comment.update({
    where: {
      id: existingComment.id,
    },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
    include: {
      project: true,
      author: true,
      assignee: true,
    },
  });

  await prisma.commentStatusHistory.create({
    data: {
      commentId: comment.id,
      changedById: user.id,
      fromStatus: existingComment.status,
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

  const recipients = [comment.author, comment.assignee].filter(
    (
      recipient,
      index,
      array
    ): recipient is NonNullable<typeof recipient> =>
      !!recipient?.email &&
      recipient.id !== user.id &&
      array.findIndex((item) => item?.id === recipient.id) === index
  );

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await Promise.all(
    recipients.map((recipient) =>
      sendCommentStatusEmail({
        email: recipient.email,
        projectName: comment.project.name,
        commentNumber: comment.number,
        status,
        commentUrl: `${appUrl}/client/projects/${projectSlug}/comments/${commentId}`,
      })
    )
  );

  revalidatePath(`/client/projects/${projectSlug}`);
  revalidatePath(`/client/projects/${projectSlug}/comments/${commentId}`);
};
import { NextResponse } from "next/server";

import type { CommentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const validStatuses: CommentStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "IN_REVIEW",
  "RESOLVED",
];

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) => {
  try {
    const { commentId } = await params;
    const body = await request.json();

    const {
      widgetPublicKey,
      status,
    }: {
      widgetPublicKey?: string;
      status?: CommentStatus;
    } = body;

    if (!widgetPublicKey || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        widgetPublicKey,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid widget key." },
        { status: 404 }
      );
    }

    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        projectId: project.id,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
      },
      include: {
        position: true,
        author: true,
        assignee: true,
        replies: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.commentStatusHistory.create({
      data: {
        commentId,
        changedById: existingComment.authorId,
        fromStatus: existingComment.status,
        toStatus: status,
      },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        projectId: project.id,
        actorId: existingComment.authorId,
        type: "COMMENT_STATUS_CHANGED",
        message: `Comment #${updatedComment.number} moved to ${status}.`,
      },
    });

    return NextResponse.json({
      comment: {
        id: updatedComment.id,
        number: updatedComment.number,
        message: updatedComment.message,
        status: updatedComment.status,
        visibility: updatedComment.visibility,
        createdAt: updatedComment.createdAt,
        author: {
          id: updatedComment.author.id,
          name: updatedComment.author.name,
          email: updatedComment.author.email,
        },
        assignee: updatedComment.assignee
          ? {
              id: updatedComment.assignee.id,
              name: updatedComment.assignee.name,
              email: updatedComment.assignee.email,
            }
          : null,
        position: updatedComment.position,
        replies: updatedComment.replies.map((reply) => ({
          id: reply.id,
          message: reply.message,
          createdAt: reply.createdAt,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            email: reply.author.email,
          },
        })),
      },
    });
  } catch (error) {
    console.error("[WIDGET_COMMENT_PATCH]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
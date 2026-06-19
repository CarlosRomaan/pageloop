import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const {
      widgetPublicKey,
      commentId,
      message,
    }: {
      widgetPublicKey?: string;
      commentId?: string;
      message?: string;
    } = body;

    if (!widgetPublicKey || !commentId || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields." },
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

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        projectId: project.id,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    const fallbackAuthor = await prisma.projectMember.findFirst({
      where: {
        projectId: project.id,
        role: {
          in: ["ADMIN", "MEMBER"],
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!fallbackAuthor) {
      return NextResponse.json(
        { error: "No project member found to create reply." },
        { status: 400 }
      );
    }

    const reply = await prisma.commentReply.create({
      data: {
        commentId,
        authorId: fallbackAuthor.userId,
        message: message.trim(),
      },
      include: {
        author: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        projectId: project.id,
        actorId: fallbackAuthor.userId,
        type: "COMMENT_REPLIED",
        message: `Replied to comment #${comment.number}.`,
      },
    });

    return NextResponse.json(
      {
        reply: {
          id: reply.id,
          message: reply.message,
          createdAt: reply.createdAt,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            email: reply.author.email,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[WIDGET_REPLIES_POST]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
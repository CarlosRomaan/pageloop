import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const isDomainAllowed = ({
  domain,
  projectDomains,
}: {
  domain: string;
  projectDomains: { domain: string }[];
}) => {
  const allowedDomain = projectDomains.find(
    (projectDomain) => projectDomain.domain === domain
  );

  const isDevelopment = process.env.NODE_ENV === "development";
  const isLocalhost = domain === "localhost";

  return {
    allowedDomain,
    isAllowed: Boolean(allowedDomain) || (isDevelopment && isLocalhost),
  };
};

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const widgetPublicKey = searchParams.get("widgetPublicKey");
    const pageUrl = searchParams.get("pageUrl");

    if (!widgetPublicKey || !pageUrl) {
      return NextResponse.json(
        { error: "Missing required query params." },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(pageUrl);
    const domain = parsedUrl.hostname;

    const project = await prisma.project.findUnique({
      where: { widgetPublicKey },
      include: { domains: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid widget key." },
        { status: 404 }
      );
    }

    const { isAllowed } = isDomainAllowed({
      domain,
      projectDomains: project.domains,
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Domain is not allowed for this project." },
        { status: 403 }
      );
    }

    const page = await prisma.page.findUnique({
      where: {
        projectId_url: {
          projectId: project.id,
          url: pageUrl,
        },
      },
      include: {
        comments: {
          where: { visibility: "PUBLIC" },
          orderBy: { number: "asc" },
          include: {
            position: true,
            author: true,
            assignee: true,
            replies: {
              include: { author: true },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({
        page: null,
        comments: [],
      });
    }

    return NextResponse.json({
      page: {
        id: page.id,
        url: page.url,
        path: page.path,
        title: page.title,
      },
      comments: page.comments.map((comment) => ({
        id: comment.id,
        number: comment.number,
        message: comment.message,
        status: comment.status,
        visibility: comment.visibility,
        createdAt: comment.createdAt,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          email: comment.author.email,
        },
        assignee: comment.assignee
          ? {
              id: comment.assignee.id,
              name: comment.assignee.name,
              email: comment.assignee.email,
            }
          : null,
        position: comment.position
          ? {
              x: comment.position.x,
              y: comment.position.y,
              viewportWidth: comment.position.viewportWidth,
              viewportHeight: comment.position.viewportHeight,
              scrollX: comment.position.scrollX,
              scrollY: comment.position.scrollY,
              domPath: comment.position.domPath,
              cssSelector: comment.position.cssSelector,
              elementText: comment.position.elementText,
              elementTag: comment.position.elementTag,
            }
          : null,
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          message: reply.message,
          createdAt: reply.createdAt,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            email: reply.author.email,
          },
        })),
      })),
    });
  } catch (error) {
    console.error("[WIDGET_COMMENTS_GET]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const {
      widgetPublicKey,
      pageUrl,
      pageTitle,
      message,
      position,
    }: {
      widgetPublicKey?: string;
      pageUrl?: string;
      pageTitle?: string;
      message?: string;
      position?: {
        x: number;
        y: number;
        viewportWidth: number;
        viewportHeight: number;
        scrollX?: number;
        scrollY?: number;
        domPath?: string;
        cssSelector?: string;
        elementText?: string;
        elementTag?: string;
      };
    } = body;

    if (!widgetPublicKey || !pageUrl || !message || !position) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(pageUrl);
    const domain = parsedUrl.hostname;
    const path = parsedUrl.pathname || "/";

    const project = await prisma.project.findUnique({
      where: { widgetPublicKey },
      include: { domains: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid widget key." },
        { status: 404 }
      );
    }

    const { isAllowed } = isDomainAllowed({
      domain,
      projectDomains: project.domains,
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Domain is not allowed for this project." },
        { status: 403 }
      );
    }

    const page = await prisma.page.upsert({
      where: {
        projectId_url: {
          projectId: project.id,
          url: pageUrl,
        },
      },
      create: {
        projectId: project.id,
        url: pageUrl,
        path,
        title: pageTitle,
        source: "WIDGET",
        lastSeenAt: new Date(),
      },
      update: {
        title: pageTitle,
        lastSeenAt: new Date(),
      },
    });

    const lastComment = await prisma.comment.findFirst({
      where: {
        projectId: project.id,
      },
      orderBy: {
        number: "desc",
      },
    });

    const nextNumber = (lastComment?.number ?? 0) + 1;

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
        { error: "No project member found to create comment." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        projectId: project.id,
        pageId: page.id,
        authorId: fallbackAuthor.userId,
        assigneeId: null,
        number: nextNumber,
        message,
        status: "OPEN",
        visibility: "PUBLIC",
        position: {
          create: {
            x: position.x,
            y: position.y,
            viewportWidth: position.viewportWidth,
            viewportHeight: position.viewportHeight,
            scrollX: position.scrollX ?? 0,
            scrollY: position.scrollY ?? 0,
            domPath: position.domPath,
            cssSelector: position.cssSelector,
            elementText: position.elementText,
            elementTag: position.elementTag,
          },
        },
      },
      include: {
        position: true,
        author: true,
        assignee: true,
        replies: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: project.workspaceId,
        projectId: project.id,
        actorId: fallbackAuthor.userId,
        type: "COMMENT_CREATED",
        message: `Created comment #${comment.number}.`,
      },
    });

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          number: comment.number,
          message: comment.message,
          status: comment.status,
          visibility: comment.visibility,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            name: comment.author.name,
            email: comment.author.email,
          },
          assignee: null,
          position: comment.position,
          replies: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[WIDGET_COMMENTS_POST]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
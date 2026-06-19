import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const {
      widgetPublicKey,
      url,
      title,
    }: {
      widgetPublicKey?: string;
      url?: string;
      title?: string;
    } = body;

    if (!widgetPublicKey || !url) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const path = parsedUrl.pathname || "/";

    const project = await prisma.project.findUnique({
      where: {
        widgetPublicKey,
      },
      include: {
        domains: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid widget key." },
        { status: 404 }
      );
    }

    const allowedDomain = project.domains.find(
      (projectDomain) => projectDomain.domain === domain
    );

    const isDevelopment = process.env.NODE_ENV === "development";
    const isLocalhost = domain === "localhost";

    if (!allowedDomain && !(isDevelopment && isLocalhost)) {
      return NextResponse.json(
        { error: "Domain is not allowed for this project." },
        { status: 403 }
      );
    }

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        lastWidgetPingAt: new Date(),
        setupCompletedAt: project.setupCompletedAt ?? new Date(),
      },
    });

    if (allowedDomain) {
      await prisma.projectDomain.update({
        where: {
          id: allowedDomain.id,
        },
        data: {
          isVerified: true,
          lastDetectedAt: new Date(),
        },
      });
    }

    const page = await prisma.page.upsert({
      where: {
        projectId_url: {
          projectId: project.id,
          url,
        },
      },
      create: {
        projectId: project.id,
        url,
        path,
        title,
        source: "WIDGET",
        lastSeenAt: new Date(),
      },
      update: {
        title,
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({
      projectId: project.id,
      pageId: page.id,
      status: "ok",
    });
  } catch (error) {
    console.error("[WIDGET_HEARTBEAT]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
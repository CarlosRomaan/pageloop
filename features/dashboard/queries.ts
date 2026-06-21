import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";
import { prisma } from "@/lib/prisma";

export const getDashboardData = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const [
    openComments,
    inProgressComments,
    needsReviewComments,
    resolvedComments,
    projects,
    recentActivity,
  ] = await Promise.all([
    prisma.comment.count({
      where: {
        status: "OPEN",
        project: {
          workspaceId: workspace.id,
        },
      },
    }),

    prisma.comment.count({
      where: {
        status: "IN_PROGRESS",
        project: {
          workspaceId: workspace.id,
        },
      },
    }),

    prisma.comment.count({
      where: {
        status: "IN_REVIEW",
        project: {
          workspaceId: workspace.id,
        },
      },
    }),

    prisma.comment.count({
      where: {
        status: "RESOLVED",
        project: {
          workspaceId: workspace.id,
        },
      },
    }),

    prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        domains: true,
        pages: true,
        comments: true,
      },
    }),

    prisma.activityLog.findMany({
      where: {
        workspaceId: workspace.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: true,
        project: true,
      },
    }),
  ]);

  const needsAttention = projects
    .map((project) => {
      const openCount = project.comments.filter(
        (comment) => comment.status === "OPEN"
      ).length;

      const needsReviewCount = project.comments.filter(
        (comment) => comment.status === "IN_REVIEW"
      ).length;

      const hasWidgetIssue = !project.lastWidgetPingAt;

      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        openCount,
        needsReviewCount,
        hasWidgetIssue,
      };
    })
    .filter(
      (project) =>
        project.openCount > 0 ||
        project.needsReviewCount > 0 ||
        project.hasWidgetIssue
    );

  return {
    workspace,

    metrics: {
      openComments,
      inProgressComments,
      needsReviewComments,
      resolvedComments,
      projects: projects.length,
    },

    projects,
    recentActivity,
    needsAttention,
  };
};
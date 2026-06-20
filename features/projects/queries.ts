import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import type { CommentStatus } from "@prisma/client";
import { getCurrentWorkspaceOrThrow } from "@/lib/current-workspace-or-throw";

export const getProjectOverview = async (projectSlug: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      domains: true,
      pages: true,
      members: true,
      comments: {
        include: {
          page: true,
          author: true,
          assignee: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          actor: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const openComments = project.comments.filter(
    (comment) => comment.status === "OPEN"
  ).length;

  const inProgressComments = project.comments.filter(
    (comment) => comment.status === "IN_PROGRESS"
  ).length;

  const needsReviewComments = project.comments.filter(
    (comment) => comment.status === "IN_REVIEW"
  ).length;

  const resolvedComments = project.comments.filter(
    (comment) => comment.status === "RESOLVED"
  ).length;

  return {
    project,
    metrics: {
      openComments,
      inProgressComments,
      needsReviewComments,
      resolvedComments,
      pages: project.pages.length,
      members: project.members.length,
    },
  };
};

type GetProjectCommentsFilters = {
  status?: CommentStatus;
  pageId?: string;
  assigneeId?: string;
};

export const getProjectComments = async (
  projectSlug: string,
  filters?: GetProjectCommentsFilters
) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      pages: true,
      members: {
        include: {
          user: true,
        },
      },
      comments: {
        where: {
          status: filters?.status,
          pageId: filters?.pageId,
          assigneeId:
            filters?.assigneeId === "unassigned"
              ? null
              : filters?.assigneeId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          page: true,
          author: true,
          assignee: true,
          replies: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return {
    project,
    comments: project.comments,
    pages: project.pages,
    members: project.members,
  };
};

export const getProjectCommentDetail = async (
  projectSlug: string,
  commentId: string
) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      projectId: project.id,
    },
    include: {
      page: true,
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
      position: true,
      statusHistory: {
        include: {
          changedBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!comment) {
    notFound();
  }

  return {
    project,
    comment,
    members: project.members.map((member) => member.user),
  };
};

export const getProjectPages = async (projectSlug: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      pages: {
        orderBy: {
          lastSeenAt: "desc",
        },
        include: {
          comments: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return {
    project,
    pages: project.pages,
  };
};

export const getProjectInstallation = async (projectSlug: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      domains: true,
    },
  });

  if (!project) {
    notFound();
  }

  return {
    project,
    domains: project.domains,
  };
};

export const getProjectTeam = async (projectSlug: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      members: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return {
    project,
    members: project.members,
  };
};

export const getProjectSettings = async (projectSlug: string) => {
  const workspace = await getCurrentWorkspaceOrThrow();

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: projectSlug,
    },
    include: {
      domains: true,
    },
  });

  if (!project) {
    notFound();
  }

  return {
    project,
    domains: project.domains,
  };
};

export const getProjects = async () => {
  const workspace = await getCurrentWorkspaceOrThrow();

  return prisma.project.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      domains: true,
      comments: true,
    },
  });
};
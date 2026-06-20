import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { notFound } from "next/navigation";

export const getClientProjects = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const memberships = await prisma.projectMember.findMany({
    where: {
      userId: user.id,
      role: "CLIENT",
    },
    include: {
      project: {
        include: {
          domains: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return memberships.map((membership) => membership.project);
};

export const getClientProject = async (projectSlug: string) => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
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
      project: {
        include: {
          domains: true,
          pages: true,
          comments: {
            include: {
              page: true,
              author: true,
              assignee: true,
              replies: {
                include: {
                  author: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!membership) {
    notFound();
  }

  return membership.project;
};

export const getClientProjectComment = async (
  projectSlug: string,
  commentId: string
) => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
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
    notFound();
  }

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      projectId: membership.projectId,
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
    },
  });

  if (!comment) {
    notFound();
  }

  return {
    project: membership.project,
    comment,
  };
};
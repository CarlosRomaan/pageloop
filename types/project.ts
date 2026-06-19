import type {
  CommentStatus,
  Page,
  ProjectMember,
  User,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";

export type ProjectCommentItem = Prisma.CommentGetPayload<{
  include: {
    page: true;
    author: true;
    assignee: true;
    replies: true;
  };
}>;

export type ProjectCommentsTableProps = {
  projectSlug: string;
  comments: ProjectCommentItem[];
};

export type ProjectCommentsPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
  searchParams: Promise<{
    status?: CommentStatus;
    pageId?: string;
    assigneeId?: string;
  }>;
};

export type ProjectCommentsFiltersProps = {
  projectSlug: string;
  pages: Page[];
  members: Array<
    ProjectMember & {
      user: User;
    }
  >;
  selectedStatus?: CommentStatus;
  selectedPageId?: string;
  selectedAssigneeId?: string;
};

export type ProjectPageItem = Prisma.PageGetPayload<{
  include: {
    comments: true;
  };
}>;

export type ProjectTeamMemberItem = Prisma.ProjectMemberGetPayload<{
  include: {
    user: true;
  };
}>;
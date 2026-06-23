import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";

import { getWorkspaceComments } from "@/features/comments/queries";
import type { CommentStatus } from "@prisma/client";

const statusLabels = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "Needs review",
  RESOLVED: "Resolved",
};

type CommentsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const validStatuses: CommentStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "IN_REVIEW",
  "RESOLVED",
];

const CommentsPage = async ({ searchParams }: CommentsPageProps) => {
  const { status } = await searchParams;

  const selectedStatus = validStatuses.includes(status as CommentStatus)
    ? (status as CommentStatus)
    : undefined;

  const comments = await getWorkspaceComments(selectedStatus);

  const openComments = comments.filter(
    (comment) => comment.status === "OPEN"
  ).length;

  const inProgressComments = comments.filter(
    (comment) => comment.status === "IN_PROGRESS"
  ).length;

  const needsReviewComments = comments.filter(
    (comment) => comment.status === "IN_REVIEW"
  ).length;

  const resolvedComments = comments.filter(
    (comment) => comment.status === "RESOLVED"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Comments
        </h1>

        <p className="mt-2 text-muted-foreground">
          Feedback across all projects.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/comments"
          className={`rounded-lg border px-3 py-2 text-sm ${!selectedStatus
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
            }`}
        >
          All
        </Link>

        {validStatuses.map((status) => (
          <Link
            key={status}
            href={`/comments?status=${status}`}
            className={`rounded-lg border px-3 py-2 text-sm ${selectedStatus === status
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
              }`}
          >
            {statusLabels[status]}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-background p-5">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {openComments}
          </p>
          <p className="text-sm text-muted-foreground">Open</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {inProgressComments}
          </p>
          <p className="text-sm text-muted-foreground">In progress</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {needsReviewComments}
          </p>
          <p className="text-sm text-muted-foreground">Needs review</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {resolvedComments}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="font-semibold">All comments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage feedback across your workspace.
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold">No comments yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comments created from the widget will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {comments.map((comment) => (
              <Link
                key={comment.id}
                href={`/projects/${comment.project.slug}/comments/${comment.id}`}
                className="block p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        #{comment.number}
                      </p>

                      <span className="text-muted-foreground">·</span>

                      <p className="line-clamp-1 font-medium">
                        {comment.message}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {comment.project.name}
                      {" • "}
                      {comment.page.title ?? comment.page.path}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Created by{" "}
                      {comment.author.name ?? comment.author.email}
                      {" • "}
                      Assigned to{" "}
                      {comment.assignee?.name ??
                        comment.assignee?.email ??
                        "Unassigned"}
                      {" • "}
                      {comment.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {statusLabels[comment.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
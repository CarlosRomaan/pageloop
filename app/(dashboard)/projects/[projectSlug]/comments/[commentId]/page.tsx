import Link from "next/link";

import CommentActions from "@/components/comments/comment-actions";
import { getProjectCommentDetail } from "@/features/projects/queries";
import CommentReplyForm from "@/components/comments/comment-reply-form";

type CommentDetailPageProps = {
  params: Promise<{
    projectSlug: string;
    commentId: string;
  }>;
};

const getStatusClassName = (status: string) => {
  const styles = {
    OPEN: "bg-amber-100 text-amber-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    IN_REVIEW: "bg-purple-100 text-purple-800",
    RESOLVED: "bg-green-100 text-green-800",
  };

  return styles[status as keyof typeof styles] ?? "bg-muted text-muted-foreground";
};

const formatStatus = (status: string) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CommentDetailPage = async ({ params }: CommentDetailPageProps) => {
  const { projectSlug, commentId } = await params;

  const { project, comment, members } = await getProjectCommentDetail(
    projectSlug,
    commentId
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href={`/projects/${project.slug}/comments`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to comments
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Comment #{comment.number}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {comment.page.title ?? comment.page.path}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClassName(
                  comment.status
                )}`}
              >
                {formatStatus(comment.status)}
              </span>

              <span className="text-sm text-muted-foreground">
                {comment.createdAt.toLocaleDateString()}
              </span>
            </div>

            <p className="text-lg font-medium">
              {comment.message}
            </p>

            <div className="mt-5 grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-2">
              <p>
                Created by{" "}
                <span className="text-foreground">
                  {comment.author.name ?? comment.author.email}
                </span>
              </p>

              <p>
                Assigned to{" "}
                <span className="text-foreground">
                  {comment.assignee?.name ?? "Unassigned"}
                </span>
              </p>

              <p>
                Page{" "}
                <span className="text-foreground">
                  {comment.page.title ?? comment.page.path}
                </span>
              </p>

              <p>
                Visibility{" "}
                <span className="text-foreground">
                  {formatStatus(comment.visibility)}
                </span>
              </p>
            </div>
          </div>

          {comment.position ? (
            <div className="rounded-xl border bg-background p-5">
              <h2 className="font-semibold">Position</h2>

              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <p>
                  Coordinates{" "}
                  <span className="text-foreground">
                    {comment.position.x}, {comment.position.y}
                  </span>
                </p>

                <p>
                  Viewport{" "}
                  <span className="text-foreground">
                    {comment.position.viewportWidth} ×{" "}
                    {comment.position.viewportHeight}
                  </span>
                </p>

                <p>
                  Element{" "}
                  <span className="text-foreground">
                    {comment.position.elementTag ?? "Unknown"}
                  </span>
                </p>

                <p>
                  Selector{" "}
                  <span className="text-foreground">
                    {comment.position.cssSelector ?? "Not available"}
                  </span>
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-semibold">Replies</h2>

            <div className="mt-4 space-y-4">
              {comment.replies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No replies yet.
                </p>
              ) : (
                comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-lg border p-4"
                  >
                    <p className="text-sm">
                      {reply.message}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      by {reply.author.name ?? reply.author.email}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t pt-6">
              // TODO: Replace with authenticated user id
              <CommentReplyForm
                commentId={comment.id}
                projectSlug={project.slug}
                authorId={comment.authorId}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CommentActions
            commentId={comment.id}
            projectSlug={project.slug}
            currentStatus={comment.status}
            currentAssigneeId={comment.assigneeId}
            members={members}
          />

          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-semibold">Status history</h2>

            <div className="mt-4 space-y-4">
              {comment.statusHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No status changes yet.
                </p>
              ) : (
                comment.statusHistory.map((history) => (
                  <div
                    key={history.id}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-sm">
                      {history.fromStatus
                        ? `${formatStatus(history.fromStatus)} → ${formatStatus(
                          history.toStatus
                        )}`
                        : formatStatus(history.toStatus)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      by {history.changedBy.name ?? history.changedBy.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDetailPage;
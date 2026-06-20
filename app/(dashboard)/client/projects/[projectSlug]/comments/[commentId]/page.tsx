import Link from "next/link";

import { getClientProjectComment } from "@/features/client/queries";
import AuthenticatedReplyForm from "@/components/comments/authenticated-reply-form";
import ClientCommentStatusActions from "@/components/client/client-comment-status-actions";

type ClientCommentPageProps = {
  params: Promise<{
    projectSlug: string;
    commentId: string;
  }>;
};

const ClientCommentPage = async ({ params }: ClientCommentPageProps) => {
  const { projectSlug, commentId } = await params;

  const { project, comment } = await getClientProjectComment(
    projectSlug,
    commentId
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/client/projects/${project.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to project
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Comment #{comment.number}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {comment.page.title ?? comment.page.path}
        </p>
      </div>

      <div className="rounded-xl border bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {comment.status.replace("_", " ")}
          </span>

          <span className="text-sm text-muted-foreground">
            {comment.createdAt.toLocaleDateString()}
          </span>
        </div>

        <p className="text-lg font-medium">{comment.message}</p>

        <p className="mt-4 text-sm text-muted-foreground">
          Created by {comment.author.name ?? comment.author.email}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Assigned to {comment.assignee?.name ?? "Unassigned"}
        </p>
      </div>

      <ClientCommentStatusActions
        commentId={comment.id}
        projectSlug={project.slug}
      />

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
                <p className="text-sm">{reply.message}</p>

                <p className="mt-2 text-xs text-muted-foreground">
                  by {reply.author.name ?? reply.author.email}
                </p>
              </div>
            ))
          )}
        </div>

        <AuthenticatedReplyForm
          commentId={comment.id}
          projectSlug={project.slug}
          redirectBase="client/projects"
        />
      </div>
    </div>
  );
};

export default ClientCommentPage;
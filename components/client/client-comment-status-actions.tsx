"use client";

import { useTransition } from "react";

import { updateClientCommentStatus } from "@/features/comments/actions";

type ClientCommentStatusActionsProps = {
  commentId: string;
  projectSlug: string;
};

const ClientCommentStatusActions = ({
  commentId,
  projectSlug,
}: ClientCommentStatusActionsProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Review actions</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Approve the update or request another review.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              updateClientCommentStatus({
                commentId,
                projectSlug,
                status: "IN_REVIEW",
              });
            });
          }}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Request review
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              updateClientCommentStatus({
                commentId,
                projectSlug,
                status: "RESOLVED",
              });
            });
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Approve / Resolve
        </button>
      </div>
    </div>
  );
};

export default ClientCommentStatusActions;
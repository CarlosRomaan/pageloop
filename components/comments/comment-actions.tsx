"use client";

import type { CommentStatus, User } from "@prisma/client";
import { useTransition } from "react";

import {
  assignComment,
  updateCommentStatus,
} from "@/features/comments/actions";

type CommentActionsProps = {
  commentId: string;
  projectSlug: string;
  currentStatus: CommentStatus;
  currentAssigneeId: string | null;
  members: User[];
};

const statuses: {
  label: string;
  value: CommentStatus;
}[] = [
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "In Review",
    value: "IN_REVIEW",
  },
  {
    label: "Resolved",
    value: "RESOLVED",
  },
];

const CommentActions = ({
  commentId,
  projectSlug,
  currentStatus,
  currentAssigneeId,
  members,
}: CommentActionsProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Actions</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Status</label>

          <select
            value={currentStatus}
            disabled={isPending}
            className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            onChange={(event) => {
              startTransition(() => {
                updateCommentStatus({
                  commentId,
                  projectSlug,
                  status: event.target.value as CommentStatus,
                });
              });
            }}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Assignee</label>

          <select
            value={currentAssigneeId ?? ""}
            disabled={isPending}
            className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            onChange={(event) => {
              startTransition(() => {
                assignComment({
                  commentId,
                  projectSlug,
                  assigneeId: event.target.value || null,
                });
              });
            }}
          >
            <option value="">Unassigned</option>

            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? member.email}
              </option>
            ))}
          </select>
        </div>

        {isPending ? (
          <p className="text-sm text-muted-foreground">Saving changes...</p>
        ) : null}
      </div>
    </div>
  );
};

export default CommentActions;
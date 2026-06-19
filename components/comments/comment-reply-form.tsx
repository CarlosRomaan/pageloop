"use client";

import { useRef, useTransition } from "react";

import { createCommentReply } from "@/features/comments/actions";

type CommentReplyFormProps = {
  commentId: string;
  projectSlug: string;
  authorId: string;
};

const CommentReplyForm = ({
  commentId,
  projectSlug,
  authorId,
}: CommentReplyFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="mt-4 space-y-3"
      action={(formData) => {
        const message = String(formData.get("message") ?? "");

        startTransition(() => {
          createCommentReply({
            commentId,
            projectSlug,
            authorId,
            message,
          });

          formRef.current?.reset();
        });
      }}
    >
      <textarea
        name="message"
        placeholder="Write a reply..."
        className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send reply"}
        </button>
      </div>
    </form>
  );
};

export default CommentReplyForm;
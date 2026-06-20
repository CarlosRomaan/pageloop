"use client";

import { useRef, useTransition } from "react";

import { createAuthenticatedCommentReply } from "@/features/comments/actions";

type AuthenticatedReplyFormProps = {
  commentId: string;
  projectSlug: string;
  redirectBase?: "projects" | "client/projects";
};

const AuthenticatedReplyForm = ({
  commentId,
  projectSlug,
  redirectBase = "projects",
}: AuthenticatedReplyFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="mt-6 border-t pt-6"
      action={(formData) => {
        const message = String(formData.get("message") ?? "");

        startTransition(() => {
          createAuthenticatedCommentReply({
            commentId,
            projectSlug,
            message,
            redirectBase,
          });

          formRef.current?.reset();
        });
      }}
    >
      <textarea
        name="message"
        placeholder="Write a reply..."
        className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm"
      />

      <div className="mt-3 flex justify-end">
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

export default AuthenticatedReplyForm;
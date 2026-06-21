"use client";

import { useActionState } from "react";

import { createProjectInvite } from "@/features/projects/actions";

type ProjectInviteFormProps = {
  projectId: string;
  projectSlug: string;
};

const initialState = {
  success: false,
  message: "",
};

const ProjectInviteForm = ({
  projectId,
  projectSlug,
}: ProjectInviteFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createProjectInvite,
    initialState
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border bg-background p-5"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="projectSlug" value={projectSlug} />

      <h2 className="font-semibold">Invite member</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Invite teammates or clients to collaborate on this project.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <input
          name="email"
          type="email"
          placeholder="client@example.com"
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        />

        <select
          name="role"
          defaultValue="CLIENT"
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        >
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
          <option value="CLIENT">Client</option>
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send invite"}
        </button>
      </div>

      {state.message ? (
        <p
          className={`mt-3 text-sm ${
            state.success ? "text-green-600" : "text-destructive"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
};

export default ProjectInviteForm;
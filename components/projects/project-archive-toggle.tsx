"use client";

import { useTransition } from "react";

import { toggleProjectArchiveStatus } from "@/features/projects/actions";

type ProjectArchiveToggleProps = {
  projectId: string;
  projectSlug: string;
  isArchived: boolean;
};

const ProjectArchiveToggle = ({
  projectId,
  projectSlug,
  isArchived,
}: ProjectArchiveToggleProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          isArchived
            ? "Restore this project?"
            : "Archive this project?"
        );

        if (!confirmed) {
          return;
        }

        startTransition(() => {
          toggleProjectArchiveStatus({
            projectId,
            projectSlug,
          });
        });
      }}
      className="mt-4 rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
    >
      {isPending
        ? isArchived
          ? "Restoring..."
          : "Archiving..."
        : isArchived
          ? "Restore project"
          : "Archive project"}
    </button>
  );
};

export default ProjectArchiveToggle;
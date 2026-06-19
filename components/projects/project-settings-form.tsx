"use client";

import { useTransition } from "react";

import { updateProjectSettings } from "@/features/projects/actions";

type ProjectSettingsFormProps = {
  projectId: string;
  projectSlug: string;
  name: string;
  description: string | null;
};

const ProjectSettingsForm = ({
  projectId,
  projectSlug,
  name,
  description,
}: ProjectSettingsFormProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-4 space-y-4"
      action={(formData) => {
        const nextName = String(formData.get("name") ?? "");
        const nextDescription = String(formData.get("description") ?? "");

        startTransition(() => {
          updateProjectSettings({
            projectId,
            projectSlug,
            name: nextName,
            description: nextDescription,
          });
        });
      }}
    >
      <div>
        <label className="text-sm font-medium">Project name</label>
        <input
          name="name"
          defaultValue={name}
          className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={description ?? ""}
          className="mt-2 min-h-28 w-full rounded-lg border bg-background p-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};

export default ProjectSettingsForm;
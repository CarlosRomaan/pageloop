"use client";

import { createProject } from "@/features/projects/actions";

type CreateProjectFormProps = {
  workspaceId: string;
};

const CreateProjectForm = ({ workspaceId }: CreateProjectFormProps) => {
  return (
    <form
      className="space-y-5"
      action={(formData) => {
        createProject({
          workspaceId,
          name: String(formData.get("name") ?? ""),
          description: String(formData.get("description") ?? ""),
          domain: String(formData.get("domain") ?? ""),
        });
      }}
    >
      <div>
        <label className="text-sm font-medium">Project name</label>
        <input
          name="name"
          placeholder="Acme Website Redesign"
          className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Primary domain</label>
        <input
          name="domain"
          placeholder="acme.com"
          className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Optional project description"
          className="mt-2 min-h-28 w-full rounded-lg border bg-background p-3 text-sm"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Create project
      </button>
    </form>
  );
};

export default CreateProjectForm;
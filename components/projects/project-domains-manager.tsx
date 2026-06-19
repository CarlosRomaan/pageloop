"use client";

import { useTransition } from "react";

import {
  addProjectDomain,
  removeProjectDomain,
} from "@/features/projects/actions";
import type { ProjectDomain } from "@prisma/client";

type ProjectDomainsManagerProps = {
  projectId: string;
  projectSlug: string;
  domains: ProjectDomain[];
};

const ProjectDomainsManager = ({
  projectId,
  projectSlug,
  domains,
}: ProjectDomainsManagerProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Domains</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Manage the domains allowed to load the PageLoop widget.
      </p>

      <form
        className="mt-4 flex gap-2"
        action={(formData) => {
          const domain = String(formData.get("domain") ?? "");

          startTransition(() => {
            addProjectDomain({
              projectId,
              projectSlug,
              domain,
            });
          });
        }}
      >
        <input
          name="domain"
          placeholder="example.com"
          className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Add domain
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="text-sm font-medium">{domain.domain}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {domain.isVerified ? "Verified" : "Pending verification"}
              </p>
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const confirmed = window.confirm(
                  `Remove ${domain.domain}?`
                );

                if (!confirmed) {
                  return;
                }

                startTransition(() => {
                  removeProjectDomain({
                    domainId: domain.id,
                    projectSlug,
                  });
                });
              }}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDomainsManager;
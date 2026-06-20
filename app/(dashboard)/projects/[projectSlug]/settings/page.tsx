import ProjectNavigation from "@/components/projects/project-navigation";
import { getProjectSettings } from "@/features/projects/queries";
import ProjectSettingsForm from "@/components/projects/project-settings-form";
import ProjectArchiveToggle from "@/components/projects/project-archive-toggle";
import ProjectDomainsManager from "@/components/projects/project-domains-manager";

import { canAccessProjectSettings, getCurrentProjectMemberOrThrow } from "@/lib/project-permissions";
import { notFound } from "next/navigation";

type ProjectSettingsPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

const ProjectSettingsPage = async ({
  params,
}: ProjectSettingsPageProps) => {
  const { projectSlug } = await params;

  const { project, domains } = await getProjectSettings(projectSlug);

  const member = await getCurrentProjectMemberOrThrow(project.id);

  if (!canAccessProjectSettings(member.role)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {project.name} / Settings
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage project details and widget configuration.
        </p>
      </div>

      <ProjectNavigation projectSlug={project.slug} />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-semibold">Project details</h2>

            <ProjectSettingsForm
              projectId={project.id}
              projectSlug={project.slug}
              name={project.name}
              description={project.description}
            />
          </div>

          <ProjectDomainsManager
            projectId={project.id}
            projectSlug={project.slug}
            domains={domains}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-semibold">Widget keys</h2>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Public key
                </p>

                <code className="mt-1 block rounded-lg border bg-muted/40 p-3 text-xs">
                  {project.widgetPublicKey}
                </code>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Secret key
                </p>

                <code className="mt-1 block rounded-lg border bg-muted/40 p-3 text-xs">
                  {project.widgetSecretKey}
                </code>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-background p-5">
            <h2 className="font-semibold text-destructive">
              Danger zone
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Archive this project when it is no longer active.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Current status: {project.status}
            </p>

            <ProjectArchiveToggle
              projectId={project.id}
              projectSlug={project.slug}
              isArchived={project.status === "ARCHIVED"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
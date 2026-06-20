import InstallationScriptCard from "@/components/projects/installation-script-card";
import InstallationStatusSummary from "@/components/projects/installation-status-summary";
import ProjectNavigation from "@/components/projects/project-navigation";
import { getProjectInstallation } from "@/features/projects/queries";
import { canAccessProjectSettings, getCurrentProjectMemberOrThrow } from "@/lib/project-permissions";
import { notFound } from "next/navigation";

type ProjectInstallationPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

const ProjectInstallationPage = async ({
  params,
}: ProjectInstallationPageProps) => {
  const { projectSlug } = await params;

  const { project, domains } = await getProjectInstallation(projectSlug);

  const member = await getCurrentProjectMemberOrThrow(project.id);

  if (!canAccessProjectSettings(member.role)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {project.name} / Installation
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Installation
        </h1>

        <p className="mt-2 text-muted-foreground">
          Add the PageLoop widget to your website to start collecting feedback.
        </p>
      </div>

      <ProjectNavigation
        projectSlug={project.slug}
        canManageProject={member.role === "ADMIN"}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <InstallationScriptCard widgetPublicKey={project.widgetPublicKey} />

        <div className="space-y-6">
          <InstallationStatusSummary
            setupCompletedAt={project.setupCompletedAt}
            lastWidgetPingAt={project.lastWidgetPingAt}
          />

          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-semibold">Allowed domains</h2>

            <div className="mt-4 space-y-3">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm">{domain.domain}</span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {domain.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInstallationPage;
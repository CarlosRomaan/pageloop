import Link from "next/link";

import ProjectsTable from "@/components/projects/projects-table";
import { getProjects } from "@/features/projects/queries";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ProjectsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Dashboard / Projects
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Projects
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your website review projects.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
};

export default ProjectsPage;
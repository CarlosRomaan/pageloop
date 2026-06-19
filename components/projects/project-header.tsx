import Link from "next/link";
import { ProjectHeaderProps } from "@/types/dashboard";

const ProjectHeader = ({ name, domain, status }: ProjectHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {name}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {name}
          </h1>

          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {status}
          </span>
        </div>

        {domain ? (
          <p className="mt-2 text-muted-foreground">
            {domain}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="#"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Open Site
        </Link>

        <Link
          href="#"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Copy Script
        </Link>
      </div>
    </div>
  );
};

export default ProjectHeader;
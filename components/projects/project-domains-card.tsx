import { CheckCircle2, Globe } from "lucide-react";
import { ProjectDomainsCardProps } from "@/types/dashboard";

const ProjectDomainsCard = ({ domains }: ProjectDomainsCardProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Domains</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Allowed domains for this project.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Globe className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="text-sm font-medium">{domain.domain}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {domain.lastDetectedAt
                  ? `Last detected ${domain.lastDetectedAt.toLocaleDateString()}`
                  : "Not detected yet"}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                domain.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {domain.isVerified ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : null}
              {domain.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDomainsCard;
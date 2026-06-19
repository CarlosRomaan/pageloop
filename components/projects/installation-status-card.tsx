import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { InstallationStatusCardProps } from "@/types/dashboard";

const InstallationStatusCard = ({
  setupCompletedAt,
  lastWidgetPingAt,
}: InstallationStatusCardProps) => {
  const isInstalled = Boolean(setupCompletedAt && lastWidgetPingAt);

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Installation status</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track whether the PageLoop widget is installed.
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isInstalled
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium">
          {isInstalled ? "Widget installed" : "Widget not detected"}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {lastWidgetPingAt
            ? `Last detected ${lastWidgetPingAt.toLocaleDateString()}`
            : "Install the widget to start collecting feedback."}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
          <Copy className="h-4 w-4" />
          Copy script
        </button>

        <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
          <ExternalLink className="h-4 w-4" />
          Open guide
        </button>
      </div>
    </div>
  );
};

export default InstallationStatusCard;
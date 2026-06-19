import { CheckCircle2, XCircle } from "lucide-react";

type InstallationStatusSummaryProps = {
  setupCompletedAt: Date | null;
  lastWidgetPingAt: Date | null;
};

const InstallationStatusSummary = ({
  setupCompletedAt,
  lastWidgetPingAt,
}: InstallationStatusSummaryProps) => {
  const isInstalled = Boolean(setupCompletedAt && lastWidgetPingAt);

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isInstalled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isInstalled ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
        </div>

        <div>
          <h2 className="font-semibold">
            {isInstalled ? "Widget installed" : "Widget not detected"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {lastWidgetPingAt
              ? `Last detected ${lastWidgetPingAt.toLocaleDateString()}`
              : "Install the widget to start collecting feedback."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallationStatusSummary;
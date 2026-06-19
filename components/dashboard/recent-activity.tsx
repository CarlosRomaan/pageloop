import type { RecentActivityProps } from "@/types/dashboard";

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent activity</h2>

        <button className="text-sm text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm">
                {activity.message ?? "Activity recorded"}
              </p>

              {activity.actor ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  by {activity.actor.name}
                </p>
              ) : null}
            </div>

            <span className="text-sm text-muted-foreground">
              {new Intl.RelativeTimeFormat("en", {
                numeric: "auto",
              }).format(
                Math.round(
                  (activity.createdAt.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                ),
                "day"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
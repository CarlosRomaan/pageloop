import { ProjectActivityCardProps } from "@/types/dashboard";

const ProjectActivityCard = ({ activities }: ProjectActivityCardProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4">
        <h2 className="font-semibold">Recent activity</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Latest updates for this project.
        </p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Activity will appear here as your team works on this project.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
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
                {activity.createdAt.toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectActivityCard;
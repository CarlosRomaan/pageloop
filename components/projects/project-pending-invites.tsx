import type { Invite } from "@prisma/client";

type ProjectPendingInvitesProps = {
  invites: Invite[];
};

const roleLabels = {
  ADMIN: "Admin",
  MEMBER: "Member",
  CLIENT: "Client",
};

const ProjectPendingInvites = ({
  invites,
}: ProjectPendingInvitesProps) => {
  if (invites.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Pending invites</h2>

      <div className="mt-4 space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="text-sm font-medium">{invite.email}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Expires {invite.expiresAt.toLocaleDateString()}
              </p>
            </div>

            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {invite.projectRole
                ? roleLabels[invite.projectRole]
                : "Member"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPendingInvites;
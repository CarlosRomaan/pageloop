import type { ProjectTeamMemberItem } from "@/types/project";

type ProjectTeamTableProps = {
  members: ProjectTeamMemberItem[];
};

const roleLabels = {
  ADMIN: "Admin",
  MEMBER: "Member",
  CLIENT: "Client",
};

const ProjectTeamTable = ({ members }: ProjectTeamTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Joined</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="border-t transition-colors hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {(member.user.name ?? member.user.email)
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <span className="font-medium">
                    {member.user.name ?? "Unnamed user"}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {member.user.email}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {roleLabels[member.role]}
                </span>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {member.createdAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTeamTable;
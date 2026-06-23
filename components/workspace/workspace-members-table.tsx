import type { Prisma } from "@prisma/client";

type WorkspaceMemberItem = Prisma.WorkspaceMemberGetPayload<{
  include: {
    user: true;
  };
}>;

type WorkspaceMembersTableProps = {
  members: WorkspaceMemberItem[];
};

const roleLabels = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

const WorkspaceMembersTable = ({
  members,
}: WorkspaceMembersTableProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Workspace members</h2>

      <div className="mt-4 overflow-hidden rounded-lg border">
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
              <tr key={member.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {member.user.name ?? "Unnamed user"}
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
    </div>
  );
};

export default WorkspaceMembersTable;
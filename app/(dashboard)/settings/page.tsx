import { getWorkspaceSettings } from "@/features/workspace/queries";
import { updateWorkspaceSettings } from "@/features/workspace/actions";
import WorkspaceMembersTable from "@/components/workspace/workspace-members-table";

const SettingsPage = async () => {
  const {
    workspace,
    members,
    membersCount,
    projectsCount,
  } = await getWorkspaceSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Workspace Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your workspace configuration.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-5">
        <h2 className="font-semibold">
          Workspace Information
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <div>
            <span className="font-medium">Name:</span>{" "}
            {workspace.name}
          </div>

          <div>
            <span className="font-medium">Slug:</span>{" "}
            {workspace.slug}
          </div>

          <div>
            <span className="font-medium">Projects:</span>{" "}
            {projectsCount}
          </div>

          <div>
            <span className="font-medium">Members:</span>{" "}
            {membersCount}
          </div>

          <div>
            <span className="font-medium">Created:</span>{" "}
            {workspace.createdAt.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 👇 AGREGAR AQUÍ */}
      <WorkspaceMembersTable members={members} />

      <div className="rounded-xl border bg-background p-5">
        <h2 className="font-semibold">
          Rename Workspace
        </h2>

        <form
          action={async (formData) => {
            "use server";

            await updateWorkspaceSettings({
              name: String(formData.get("name") ?? ""),
            });
          }}
          className="mt-4 space-y-4"
        >
          <input
            type="text"
            name="name"
            defaultValue={workspace.name}
            className="w-full rounded-lg border px-3 py-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
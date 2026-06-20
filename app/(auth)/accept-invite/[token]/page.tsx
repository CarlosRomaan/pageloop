import { acceptProjectInvite } from "@/features/projects/actions";
import { getInviteByToken } from "@/features/projects/queries";

type AcceptInvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

const AcceptInvitePage = async ({ params }: AcceptInvitePageProps) => {
  const { token } = await params;

  const invite = await getInviteByToken(token);

  const isExpired = invite.expiresAt < new Date();
  const isAccepted = Boolean(invite.acceptedAt);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Accept invitation
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          You have been invited to join{" "}
          <span className="font-medium text-foreground">
            {invite.project?.name ?? invite.workspace.name}
          </span>
          .
        </p>

        {isAccepted ? (
          <p className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm">
            This invitation has already been accepted.
          </p>
        ) : isExpired ? (
          <p className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm">
            This invitation has expired.
          </p>
        ) : (
          <form
            className="mt-6"
            action={async () => {
              "use server";

              await acceptProjectInvite({ token });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Accept invitation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;
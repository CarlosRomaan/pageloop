import { signIn } from "@/auth";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to PageLoop
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review websites, collect feedback and close the loop.
          </p>
        </div>

        <form
          className="mt-8"
          action={async () => {
            "use server";

            await signIn("google", {
              redirectTo: "/post-login",
            });
          }}
        >
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
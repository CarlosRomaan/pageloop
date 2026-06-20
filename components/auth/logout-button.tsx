"use client";

import { useTransition } from "react";

import { signOut } from "@/auth";

const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOut({
            redirectTo: "/login",
          });
        });
      }}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
};

export default LogoutButton;
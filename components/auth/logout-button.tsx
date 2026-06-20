"use client";

import { logout } from "@/features/auth/actions";

const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </form>
  );
};

export default LogoutButton;
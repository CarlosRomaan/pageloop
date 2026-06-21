import LogoutButton from "@/components/auth/logout-button";

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
};

const UserMenu = ({ user }: UserMenuProps) => {
  const name = user?.name ?? "User";
  const email = user?.email ?? "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
        {initials}
      </div>

      <LogoutButton />
    </div>
  );
};

export default UserMenu;
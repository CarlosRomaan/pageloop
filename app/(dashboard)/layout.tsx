import { auth } from "@/auth";
import DashboardHeader from "@/components/layout/header";
import DashboardSidebar from "@/components/layout/sidebar";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={session?.user ?? null} />

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="border-b">
          <DashboardHeader user={session?.user ?? null} />
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
import DashboardHeader from "@/components/layout/header";
import DashboardSidebar from "@/components/layout/sidebar";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="border-b">
          <DashboardHeader />
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
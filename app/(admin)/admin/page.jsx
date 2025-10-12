import { getDashboardData } from "@/actions/admin";
import { Dashboard } from "./_components/dashboard";

export const metadata = {
  title: "Dashboard | CochesToday Admin",
  description: "Admin dashboard for CochesToday car marketplace",
};

export default async function AdminDashboardPage() {
  // Fetch dashboard data
  const dashboardData = await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Panel de administración</h1>
        <p className="text-foreground/70 mt-2">
          Revisa el rendimiento de tus coches y gestiona las operaciones del concesionario.
        </p>
      </div>
      <Dashboard initialData={dashboardData} />
    </div>
  );
}

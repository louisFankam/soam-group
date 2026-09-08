import { redirect } from "next/navigation";
import SuperAdminSidebar from "@/components/superadmin/SuperAdminSidebar";
import { sessionActive } from "@/lib/auth";

export default async function SuperAdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await sessionActive();
  if (!session) redirect("/admin/login");
  if (session.role !== "superadmin") redirect("/admin");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-section-alt">
      <SuperAdminSidebar />
      <div className="flex-1 min-w-0 px-5 lg:px-8 py-6">{children}</div>
    </div>
  );
}

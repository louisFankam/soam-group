import { redirect } from "next/navigation";
import { and, eq, count } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { sessionActive } from "@/lib/auth";

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await sessionActive();
  if (!email) redirect("/admin/login");

  const [{ value: nonLus }] = await db
    .select({ value: count() })
    .from(messages)
    .where(and(eq(messages.lu, false), eq(messages.archive, false)));

  return (
    <div className="flex min-h-screen bg-section-alt">
      <AdminSidebar nonLus={nonLus} />
      <div className="flex-1 min-w-0 px-5 lg:px-8 py-6">{children}</div>
    </div>
  );
}

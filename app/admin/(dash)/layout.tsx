import { redirect } from "next/navigation";
import { and, eq, count } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { db } from "@/lib/db";
import { messages, devis } from "@/lib/schema";
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
  const [{ value: devisNouveaux }] = await db
    .select({ value: count() })
    .from(devis)
    .where(eq(devis.statut, "nouveau"));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-section-alt">
      <AdminSidebar nonLus={nonLus} devisNouveaux={devisNouveaux} />
      <div className="flex-1 min-w-0 px-5 lg:px-8 py-6">{children}</div>
    </div>
  );
}

import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tags } from "@/lib/schema";
import { AdminChampSuperadmin } from "@/components/superadmin/AdminChampSuperadmin";
import { ENTITES_SUPERADMIN } from "@/lib/superadmin-entites";

export default async function FormulaireTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id: brutId } = await params;
  const { erreur } = await searchParams;
  const spec = ENTITES_SUPERADMIN["blog/tags"];
  const nouveau = brutId === "nouveau";
  let ligne: Record<string, unknown> = {};
  if (!nouveau) {
    const num = Number(brutId);
    if (!Number.isFinite(num)) notFound();
    const trouve = await db.select().from(tags).where(eq(tags.id, num)).get();
    if (!trouve) notFound();
    ligne = trouve as Record<string, unknown>;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Link href="/superadmin/blog/tags" className="text-sm text-primary hover:underline">← Tags</Link>
        <h1 className="font-headings font-bold text-xl text-foreground mt-1">
          {nouveau ? "Nouveau tag" : `Modifier — ${String(ligne.name ?? "")}`}
        </h1>
      </div>

      {erreur === "slug" && (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          Ce slug existe déjà.
        </p>
      )}

      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-5">
        <input type="hidden" name="__action" value="entite-enregistrer" />
        <input type="hidden" name="__module" value="blog/tags" />
        <input type="hidden" name="__id" value={brutId} />
        {spec.champs.map((champ) => (
          <AdminChampSuperadmin key={champ.nom} champ={champ} valeur={ligne[champ.nom]} />
        ))}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-primary hover:bg-primary-deep transition-all text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">Enregistrer</button>
          <Link href="/superadmin/blog/tags" className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-6 py-3 rounded-xl">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

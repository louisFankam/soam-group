import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ENTITES_SUPERADMIN } from "@/lib/superadmin-entites";
import { AdminChampSuperadmin } from "@/components/superadmin/AdminChampSuperadmin";

export default async function FormulaireModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string; id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { module: nomModule, id: brutId } = await params;
  const { erreur } = await searchParams;
  const spec = ENTITES_SUPERADMIN[nomModule];
  if (!spec) notFound();

  const nouveau = brutId === "nouveau";
  let ligne: Record<string, unknown> = {};
  if (!nouveau) {
    const num = Number(brutId);
    if (!Number.isFinite(num)) notFound();
    const trouve = await db.select().from(spec.table).where(eq(spec.table.id, num)).get();
    if (!trouve) notFound();
    ligne = trouve as Record<string, unknown>;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Link href={`/superadmin/${nomModule}`} className="text-sm text-primary hover:underline">
          ← {spec.titre}
        </Link>
        <h1 className="font-headings font-bold text-xl text-foreground mt-1">
          {nouveau ? `Nouveau — ${spec.titre}` : `Modifier — ${String(ligne[spec.colonneTitre] ?? "")}`}
        </h1>
      </div>

      {erreur === "slug" && (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          Ce slug existe déjà, choisissez-en un autre.
        </p>
      )}

      <form action="/api/superadmin" method="post" encType="multipart/form-data" className="bg-card border border-card-border rounded-2xl p-6 space-y-5">
        <input type="hidden" name="__action" value="entite-enregistrer" />
        <input type="hidden" name="__module" value={nomModule} />
        <input type="hidden" name="__id" value={brutId} />
        {spec.champs.map((champ) => (
          <AdminChampSuperadmin key={champ.nom} champ={champ} valeur={ligne[champ.nom]} />
        ))}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-deep active:scale-[0.99] transition-all text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl"
          >
            Enregistrer
          </button>
          <Link
            href={`/superadmin/${nomModule}`}
            className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-6 py-3 rounded-xl"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

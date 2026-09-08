import Link from "next/link";
import { GROUPES_SETTINGS, trousGroupe } from "@/lib/settings";
import { getSettings } from "@/lib/cms-data";
import { AdminChampParametre } from "@/components/superadmin/AdminChampParametre";

export default async function ParametresSuperadminPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string; ok?: string; erreur?: string }>;
}) {
  const { onglet, ok, erreur } = await searchParams;
  const actif = GROUPES_SETTINGS.find((g) => g.id === onglet) ?? GROUPES_SETTINGS[0];
  const settings = await getSettings();
  const valeurs = trousGroupe(settings, actif.id);

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">Paramètres</h1>
      </div>

      {(ok || erreur) && (
        <p className={`rounded-xl border text-sm px-4 py-3 ${erreur ? "bg-red-50 border-red-200 text-red-700" : "bg-accent-green/10 border-accent-green/30 text-foreground"}`}>
          {erreur === "image" ? "Image invalide." : "Enregistré ✓"}
        </p>
      )}

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {GROUPES_SETTINGS.map((g) => (
          <Link
            key={g.id}
            href={`/superadmin/parametres?onglet=${g.id}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              g.id === actif.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6">
        <h2 className="font-headings font-semibold text-base text-foreground">{actif.label}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">{actif.description}</p>

        <form action="/api/superadmin" method="post" encType="multipart/form-data" className="space-y-5">
          <input type="hidden" name="__action" value="parametres-groupe" />
          <input type="hidden" name="__groupe" value={actif.id} />
          {actif.champs.map((champ) => (
            <AdminChampParametre key={champ.cle} champ={champ} valeur={valeurs[champ.cle]} />
          ))}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-deep active:scale-[0.99] transition-all text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl"
          >
            Enregistrer le groupe « {actif.label} »
          </button>
        </form>
      </div>
    </div>
  );
}

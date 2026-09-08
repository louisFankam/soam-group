import Link from "next/link";
import { GROUPES_SETTINGS, trousGroupe } from "@/lib/settings";
import { getSettings } from "@/lib/cms-data";
import { AdminChampParametre } from "@/components/superadmin/AdminChampParametre";

export default async function PiedDePagePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const settings = await getSettings();
  const groupeFooter = GROUPES_SETTINGS.find((g) => g.id === "footer")!;
  const groupeSocial = GROUPES_SETTINGS.find((g) => g.id === "social")!;
  const valeursFooter = trousGroupe(settings, "footer");
  const valeursSocial = trousGroupe(settings, "social");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-headings font-bold text-xl text-foreground">Pied de page</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Contenu du pied de page et liens sociaux. Voir aussi <Link href="/superadmin/menu" className="text-primary hover:underline">les menus</Link>.
        </p>
      </div>

      {ok && <p className="rounded-xl bg-accent-green/10 border border-accent-green/30 text-foreground text-sm px-4 py-3">Enregistré ✓</p>}

      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
        <input type="hidden" name="__action" value="parametres-groupe" />
        <input type="hidden" name="__groupe" value="footer" />
        <input type="hidden" name="__retour" value="pied-de-page" />
        <h2 className="font-headings font-semibold text-base text-foreground">Contenu du pied de page</h2>
        {groupeFooter.champs.map((c) => (
          <AdminChampParametre key={c.cle} champ={c} valeur={valeursFooter[c.cle]} />
        ))}
        <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">Enregistrer</button>
      </form>

      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
        <input type="hidden" name="__action" value="parametres-groupe" />
        <input type="hidden" name="__groupe" value="social" />
        <input type="hidden" name="__retour" value="pied-de-page" />
        <h2 className="font-headings font-semibold text-base text-foreground">Réseaux sociaux</h2>
        {groupeSocial.champs.map((c) => (
          <AdminChampParametre key={c.cle} champ={c} valeur={valeursSocial[c.cle]} />
        ))}
        <button type="submit" className="border border-primary text-primary hover:bg-secondary transition-colors text-sm font-medium px-6 py-3 rounded-xl">Enregistrer les liens sociaux</button>
      </form>
    </div>
  );
}

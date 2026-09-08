import Link from "next/link";
import { db } from "@/lib/db";
import { devis, soumissionsFormulaires } from "@/lib/schema";

function formatDate(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString("fr-FR");
}

const STATUTS: Record<string, string> = {
  nouveau: "Nouveau", en_cours: "En cours", traite: "Traité", refuse: "Refusé",
};

const COULEURS: Record<string, string> = {
  nouveau: "bg-amber-100 text-amber-700",
  en_cours: "bg-blue-100 text-blue-700",
  traite: "bg-accent-green/15 text-accent-green",
  refuse: "bg-red-100 text-red-700",
};

export default async function FormulairesPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string; ok?: string }>;
}) {
  const { onglet, ok } = await searchParams;
  const actif = onglet === "soumissions" ? "soumissions" : "devis";
  const [listeDevis, listeSoumissions] = await Promise.all([
    db.select().from(devis).orderBy(devis.creeLe),
    db.select().from(soumissionsFormulaires).orderBy(soumissionsFormulaires.id),
  ]);

  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="font-headings font-bold text-xl text-foreground">Formulaires & soumissions</h1>

      {ok && <p className="rounded-xl bg-accent-green/10 border border-accent-green/30 text-foreground text-sm px-4 py-3">Mis à jour ✓</p>}

      <div className="flex gap-2 border-b border-border pb-3">
        <Link href="/superadmin/formulaires?onglet=devis" className={`px-4 py-2 rounded-xl text-sm font-medium ${actif === "devis" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          Demandes de devis ({listeDevis.length})
        </Link>
        <Link href="/superadmin/formulaires?onglet=soumissions" className={`px-4 py-2 rounded-xl text-sm font-medium ${actif === "soumissions" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          Soumissions de sections ({listeSoumissions.length})
        </Link>
      </div>

      {actif === "devis" && (
        <div className="space-y-3">
          {listeDevis.map((d) => (
            <div key={d.id} className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {d.nom} <span className="text-muted-foreground font-normal">— {d.organisation || "Inconnu"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.email} • {d.telephone} • {d.secteur} • {d.service}
                    {d.budget && ` • Budget : ${d.budget}`}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{formatDate(d.creeLe)}</div>
              </div>
              <p className="text-sm text-foreground mt-3 whitespace-pre-wrap">{d.description}</p>
              <div className="mt-4 inline-flex items-center gap-2">
                <form action="/api/superadmin" method="post" className="inline-flex items-center gap-2">
                  <input type="hidden" name="__action" value="devis-marquer" />
                  <input type="hidden" name="__id" value={String(d.id)} />
                  <select name="statut" defaultValue={d.statut} className="bg-input border border-border rounded-lg px-3 py-1.5 text-sm">
                    {Object.entries(STATUTS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <button type="submit" className="text-sm text-primary hover:underline">Appliquer</button>
                </form>
                <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full ${COULEURS[d.statut]}`}>{STATUTS[d.statut]}</span>
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value="devis-supprimer" />
                  <input type="hidden" name="__id" value={String(d.id)} />
                  <button type="submit" className="text-sm text-red-600 hover:underline ml-2">Supprimer</button>
                </form>
              </div>
            </div>
          ))}
          {listeDevis.length === 0 && <p className="text-sm text-muted-foreground">Aucune demande de devis.</p>}
        </div>
      )}

      {actif === "soumissions" && (
        <div className="space-y-3">
          {listeSoumissions.map((s) => (
            <div key={s.id} className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">
                  Soumission #{s.id}
                  {s.sectionId && <span className="text-muted-foreground font-normal"> — section #{s.sectionId}</span>}
                </p>
                <div className="text-xs text-muted-foreground shrink-0">{formatDate(s.creeLe)}</div>
              </div>
              <pre className="mt-3 text-xs text-foreground bg-muted rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(s.data, null, 2)}
              </pre>
              <div className="mt-3">
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value="soumission-supprimer" />
                  <input type="hidden" name="__id" value={String(s.id)} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
                </form>
              </div>
            </div>
          ))}
          {listeSoumissions.length === 0 && <p className="text-sm text-muted-foreground">Aucune soumission.</p>}
        </div>
      )}
    </div>
  );
}

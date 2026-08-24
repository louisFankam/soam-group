import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Icon from "@/components/ui";
import { db } from "@/lib/db";
import { devis } from "@/lib/schema";

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  nouveau: { libelle: "Nouveau", classe: "bg-primary text-white" },
  en_cours: { libelle: "En cours", classe: "bg-accent-orange text-white" },
  traite: { libelle: "Traité", classe: "bg-accent-green text-white" },
  refuse: { libelle: "Refusé", classe: "bg-muted-foreground text-white" },
};

const FILTRES = [
  { valeur: "nouveau", label: "Nouveaux" },
  { valeur: "en_cours", label: "En cours" },
  { valeur: "traite", label: "Traités" },
  { valeur: "refuse", label: "Refusés" },
  { valeur: "", label: "Tous" },
];

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;
  const statutActif = statut && statut in STATUTS ? statut : "";

  const liste = await (statutActif
    ? db.select().from(devis).where(eq(devis.statut, statutActif))
    : db.select().from(devis)
  ).orderBy(desc(devis.creeLe));

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">
          Demandes de devis
        </h1>
        <div className="flex gap-1.5 flex-wrap">
          {FILTRES.map((f) => (
            <Link
              key={f.valeur}
              href={f.valeur ? `/admin/devis?statut=${f.valeur}` : "/admin/devis"}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-colors ${
                statutActif === f.valeur
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {liste.map((d) => {
          const st = STATUTS[d.statut] ?? STATUTS.nouveau;
          return (
            <article
              key={d.id}
              className={`bg-card border rounded-2xl p-5 ${
                d.statut === "nouveau" ? "border-primary/40 shadow-sm" : "border-card-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className={`text-sm ${d.statut === "nouveau" ? "font-bold" : ""} text-foreground`}>
                    {d.nom}
                    {d.organisation && ` — ${d.organisation}`}
                    <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full align-middle ${st.classe}`}>
                      {st.libelle.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {d.email} · {d.telephone} ·{" "}
                    {new Date(d.creeLe * 1000).toLocaleString("fr-FR")}
                  </p>
                </div>
                <form action="/api/admin" method="post" className="flex items-center gap-1.5">
                  <input type="hidden" name="__action" value="devis-statut" />
                  <input type="hidden" name="id" value={d.id} />
                  <select
                    name="statut"
                    defaultValue={d.statut}
                    className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white"
                  >
                    {Object.entries(STATUTS).map(([valeur, s]) => (
                      <option key={valeur} value={valeur}>
                        {s.libelle}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="text-xs border border-border hover:bg-secondary rounded-lg px-3 py-1.5 transition-colors">
                    Mettre à jour
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-secondary rounded-full px-3 py-1 text-foreground">{d.service}</span>
                <span className="text-xs bg-secondary rounded-full px-3 py-1 text-foreground">{d.secteur}</span>
                <span className="text-xs font-semibold text-accent-green rounded-full px-3 py-1 bg-accent-green-light">
                  {d.budget}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-line">
                {d.description}
              </p>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <a href={`mailto:${d.email}?subject=${encodeURIComponent("Votre demande de devis — SOAM GROUP")}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  Répondre <Icon i="arrow-right" size={13} />
                </a>
                {d.fichierUrl && (
                  <a href={d.fichierUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <Icon i="folder-check" size={13} /> Pièce jointe
                  </a>
                )}
              </div>
            </article>
          );
        })}
        {liste.length === 0 && (
          <p className="text-sm text-muted-foreground bg-card border border-card-border rounded-2xl p-8 text-center">
            Aucune demande{statutActif ? ` « ${STATUTS[statutActif].libelle.toLowerCase()} »` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}

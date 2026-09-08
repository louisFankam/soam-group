import { db } from "@/lib/db";
import {
  temoignages, membresEquipe, services, projets, faqs, documents,
  offresEmploi, clientsPartenaires, produits, posts, pages,
} from "@/lib/schema";
import Icon from "@/components/ui";

type Ligne = { module: string; label: string; id: number; titre: string; spec: string };

const MODULES: { module: string; label: string; table: unknown; colonneTitre: string; colonneFlag: string }[] = [
  { module: "temoignages", label: "Témoignage", table: temoignages, colonneTitre: "name", colonneFlag: "isActive" },
  { module: "equipe", label: "Membre équipe", table: membresEquipe, colonneTitre: "nom", colonneFlag: "isActive" },
  { module: "services", label: "Service", table: services, colonneTitre: "title", colonneFlag: "isActive" },
  { module: "projets", label: "Projet", table: projets, colonneTitre: "title", colonneFlag: "isPublished" },
  { module: "faq", label: "FAQ", table: faqs, colonneTitre: "question", colonneFlag: "isActive" },
  { module: "documents", label: "Document", table: documents, colonneTitre: "title", colonneFlag: "isActive" },
  { module: "emplois", label: "Offre d'emploi", table: offresEmploi, colonneTitre: "title", colonneFlag: "isActive" },
  { module: "clients-partenaires", label: "Client / Partenaire", table: clientsPartenaires, colonneTitre: "name", colonneFlag: "isActive" },
  { module: "produits", label: "Produit", table: produits, colonneTitre: "name", colonneFlag: "isActive" },
];

export default async function CorbeillePage() {
  const lignes: Ligne[] = [];
  for (const m of MODULES) {
    const tbl = m.table as { [k: string]: unknown };
    const lignesTab = (await db.select().from(tbl as never)) as unknown as Record<string, unknown>[];
    for (const l of lignesTab) {
      const flag = l[m.colonneFlag as unknown as string] as boolean;
      const inactif = flag !== undefined && flag === false;
      if (inactif) {
        lignes.push({ module: m.module, label: m.label, id: Number(l.id), titre: String(l[m.colonneTitre] ?? "(sans titre)"), spec: m.colonneFlag });
      }
    }
  }
  // posts + pages non publiées
  for (const p of (await db.select().from(posts)) as unknown as Record<string, unknown>[]) {
    if (p.isPublished === false) lignes.push({ module: "post", label: "Article", id: Number(p.id), titre: String(p.title ?? ""), spec: "isPublished" });
  }
  for (const p of (await db.select().from(pages)) as unknown as Record<string, unknown>[]) {
    if (p.isPublished === false) lignes.push({ module: "page", label: "Page", id: Number(p.id), titre: String(p.title ?? ""), spec: "isPublished" });
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="font-headings font-bold text-xl text-foreground">Corbeille</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Éléments désactivés ou dépubliés ({lignes.length}). Depuis leur page, passez-les à « actif » pour les restaurer.
        </p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {lignes.map((l) => (
            <li key={`${l.module}-${l.id}`} className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{l.titre}</p>
                <p className="text-xs text-muted-foreground">{l.label}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value="entite-restaurer" />
                  <input type="hidden" name="__module" value={l.module} />
                  <input type="hidden" name="__id" value={String(l.id)} />
                  <button type="submit" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                    <Icon i="rotate-ccw" size={14} /> Restaurer
                  </button>
                </form>
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value={{ post: "post-supprimer", page: "page-supprimer" }[l.module] ?? "entite-supprimer"} />
                  <input type="hidden" name="__module" value={l.module} />
                  <input type="hidden" name="__id" value={String(l.id)} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer définitivement</button>
                </form>
              </div>
            </li>
          ))}
          {lignes.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">La corbeille est vide.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

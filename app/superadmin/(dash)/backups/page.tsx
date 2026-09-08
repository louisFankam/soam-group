import { db } from "@/lib/db";
import { sauvegardes } from "@/lib/schema";
import Icon from "@/components/ui";

function formatDate(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString("fr-FR");
}

export default async function BackupsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const liste = await db.select().from(sauvegardes).orderBy(sauvegardes.id);

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headings font-bold text-xl text-foreground">Sauvegardes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Historique des sauvegardes de la base.</p>
        </div>
        <form action="/api/superadmin" method="post">
          <input type="hidden" name="__action" value="backup-creer" />
          <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2">
            <Icon i="download" size={16} /> Créer une sauvegarde
          </button>
        </form>
      </div>

      {ok && <p className="rounded-xl bg-accent-green/10 border border-accent-green/30 text-foreground text-sm px-4 py-3">Sauvegarde créée ✓</p>}

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {liste.map((s) => (
            <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{s.filename}</p>
                <p className="text-xs text-muted-foreground">{formatDate(s.creeLe)}</p>
              </div>
              <form action="/api/superadmin" method="post">
                <input type="hidden" name="__action" value="backup-supprimer" />
                <input type="hidden" name="__id" value={String(s.id)} />
                <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
              </form>
            </li>
          ))}
          {liste.length === 0 && <li className="px-5 py-8 text-sm text-muted-foreground">Aucune sauvegarde.</li>}
        </ul>
      </div>
    </div>
  );
}

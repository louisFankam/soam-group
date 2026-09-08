import { db } from "@/lib/db";
import { journauxActivite } from "@/lib/schema";

function formatDate(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString("fr-FR");
}

const ACTIONS: Record<string, { label: string; cls: string }> = {
  creation: { label: "Création", cls: "bg-accent-green/15 text-accent-green" },
  modification: { label: "Modification", cls: "bg-blue-100 text-blue-700" },
  suppression: { label: "Suppression", cls: "bg-red-100 text-red-700" },
  parametres: { label: "Paramètres", cls: "bg-purple-100 text-purple-700" },
  connexion: { label: "Connexion", cls: "bg-amber-100 text-amber-700" },
};

export default async function JournalPage() {
  const liste = await db.select().from(journauxActivite).orderBy(journauxActivite.id).limit(200);

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="font-headings font-bold text-xl text-foreground">Journal d&apos;activité</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Les 200 dernières actions ({liste.length}).</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {liste.map((j) => {
            const act = ACTIONS[j.action] ?? { label: j.action, cls: "bg-muted text-muted-foreground" };
            return (
              <li key={j.id} className="px-5 py-3 flex items-start gap-4">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0 mt-0.5 ${act.cls}`}>{act.label}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{j.description || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {j.subjectType && <span className="font-medium">{j.subjectType}</span>}
                    {j.subjectId && ` #${j.subjectId}`}
                    {j.ip && ` • IP ${j.ip}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{formatDate(j.creeLe)}</span>
              </li>
            );
          })}
          {liste.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">
              Aucune activité enregistrée.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

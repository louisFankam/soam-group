import { desc, eq, gte, sql } from "drizzle-orm";
import Icon from "@/components/ui";
import { db } from "@/lib/db";
import { visites } from "@/lib/schema";

export const dynamic = "force-dynamic";

const JOUR_MS = 86400000;
// ponytail : dates en UTC (le Burkina Faso est en UTC+0, pas de décalage à gérer)
const jourStr = (offsetJours = 0) =>
  new Date(Date.now() - offsetJours * JOUR_MS).toISOString().slice(0, 10);

const totalVues = sql<number>`COALESCE(SUM(${visites.vues}), 0)`;

export default async function StatistiquesPage() {
  const [aujourdhui, septJours, trenteJours, total, serieBrute, top] =
    await Promise.all([
      db.select({ v: totalVues }).from(visites).where(eq(visites.jour, jourStr(0))),
      db.select({ v: totalVues }).from(visites).where(gte(visites.jour, jourStr(6))),
      db.select({ v: totalVues }).from(visites).where(gte(visites.jour, jourStr(29))),
      db.select({ v: totalVues }).from(visites),
      db
        .select({ jour: visites.jour, vues: sql<number>`SUM(${visites.vues})` })
        .from(visites)
        .where(gte(visites.jour, jourStr(29)))
        .groupBy(visites.jour),
      db
        .select({ chemin: visites.chemin, vues: sql<number>`SUM(${visites.vues})` })
        .from(visites)
        .where(gte(visites.jour, jourStr(6)))
        .groupBy(visites.chemin)
        .orderBy(desc(sql`SUM(${visites.vues})`))
        .limit(10),
    ]);

  // Série continue sur 30 jours (jours sans visite = 0).
  const parJour = new Map(serieBrute.map((r) => [r.jour, Number(r.vues)]));
  const serie = Array.from({ length: 30 }, (_, i) => ({
    jour: jourStr(29 - i),
    vues: parJour.get(jourStr(29 - i)) ?? 0,
  }));
  const max = Math.max(...serie.map((s) => s.vues), 1);

  const cartes = [
    { label: "Aujourd'hui", valeur: Number(aujourdhui[0].v), note: "vues" },
    { label: "7 derniers jours", valeur: Number(septJours[0].v), note: "vues" },
    { label: "30 derniers jours", valeur: Number(trenteJours[0].v), note: "vues" },
    { label: "Total", valeur: Number(total[0].v), note: "depuis le lancement" },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <h1 className="font-headings font-bold text-xl text-foreground">Statistiques</h1>

      {/* Cartes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cartes.map((c) => (
          <div key={c.label} className="bg-card border border-card-border rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center mb-3">
              <Icon i="chart-bar" size={18} />
            </div>
            <div className="font-headings font-bold text-2xl text-foreground">{c.valeur}</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{c.label}</div>
            <div className="text-xs text-muted-foreground">{c.note}</div>
          </div>
        ))}
      </div>

      {/* Graphique : barres CSS, zéro dépendance */}
      <section className="bg-card border border-card-border rounded-2xl p-6">
        <h2 className="font-headings font-semibold text-base text-foreground mb-1">
          Vues des 30 derniers jours
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          du {serie[0].jour.split("-").reverse().join("/")} au{" "}
          {serie[serie.length - 1].jour.split("-").reverse().join("/")}
        </p>
        <div className="flex items-end gap-[3px] h-32">
          {serie.map((s) => (
            <div
              key={s.jour}
              title={`${s.jour.split("-").reverse().join("/")} — ${s.vues} vue(s)`}
              className="flex-1 rounded-t bg-primary/80 hover:bg-primary transition-colors min-h-[3px]"
              style={{ height: `${Math.max(3, (s.vues / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{serie[0].jour.split("-").reverse().join("/")}</span>
          <span>{serie[serie.length - 1].jour.split("-").reverse().join("/")}</span>
        </div>
      </section>

      {/* Pages les plus visitées (7 jours) */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border">
          <h2 className="font-headings font-semibold text-base text-foreground">
            Pages les plus visitées
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">7 derniers jours</p>
        </div>
        {top.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">
            Aucune visite enregistrée pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-card-border">
            {top.map((t) => (
              <li key={t.chemin} className="px-6 py-3 flex items-center justify-between gap-4">
                <a
                  href={t.chemin}
                  target="_blank"
                  className="text-sm text-foreground hover:text-primary truncate font-mono"
                >
                  {t.chemin}
                </a>
                <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                  {Number(t.vues)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

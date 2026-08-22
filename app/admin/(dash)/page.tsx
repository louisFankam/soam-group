import Link from "next/link";
import { count, desc, gte, sql } from "drizzle-orm";
import Icon from "@/components/ui";
import { db } from "@/lib/db";
import { articles, messages, realisations, visites } from "@/lib/schema";
import { sessionActive } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const email = (await sessionActive()) ?? "admin";
  const debutMois = new Date().toISOString().slice(0, 8) + "01";

  const [[nbArticles], [nbRealisations], [nbMessages], derniers, [vuesMois]] = await Promise.all([
    db.select({ value: count() }).from(articles),
    db.select({ value: count() }).from(realisations),
    db.select({ value: count() }).from(messages),
    db.select().from(messages).orderBy(desc(messages.creeLe)).limit(5),
    db
      .select({ v: sql<number>`COALESCE(SUM(${visites.vues}), 0)` })
      .from(visites)
      .where(gte(visites.jour, debutMois)),
  ]);

  const cartes = [
    {
      icone: "users",
      label: "Visiteurs ce mois",
      valeur: Number(vuesMois.v).toLocaleString("fr-FR"),
      note: "vues depuis le 1er",
    },
    { icone: "award", label: "Articles publiés", valeur: String(nbArticles.value), note: "au total" },
    { icone: "folder-check", label: "Réalisations", valeur: String(nbRealisations.value), note: "au total" },
    {
      icone: "mail",
      label: "Messages reçus",
      valeur: String(nbMessages.value),
      note: `${derniers.filter((m) => !m.lu).length} non lu(s)`,
    },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Bannière de bienvenue */}
      <div
        className="rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #060d1f 0%, #1a4fbd 100%)" }}
      >
        <div>
          <h1 className="text-white font-headings font-bold text-xl mb-1">
            Bienvenue, Administrateur
          </h1>
          <p className="text-sm" style={{ color: "#9fb8d8" }}>
            Connecté en tant que {email}
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-primary hover:bg-secondary transition-colors"
        >
          <Icon i="arrow-right" size={15} /> Voir le site
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cartes.map((c) => (
          <div key={c.label} className="bg-card border border-card-border rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center mb-3">
              <Icon i={c.icone} size={18} />
            </div>
            <div className="font-headings font-bold text-2xl text-foreground">{c.valeur}</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{c.label}</div>
            <div className="text-xs text-muted-foreground">{c.note}</div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <section className="bg-card border border-card-border rounded-2xl p-6">
        <h2 className="font-headings font-semibold text-base text-foreground mb-4">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/actualites/nouveau", label: "Écrire un article", icone: "pen-tool" },
            { href: "/admin/statistiques", label: "Voir les statistiques", icone: "chart-bar" },
            { href: "/admin/realisations/nouveau", label: "Ajouter une réalisation", icone: "folder-check" },
            { href: "/admin/logiciels", label: "Gérer les logiciels", icone: "code-2" },
            { href: "/admin/parametres", label: "Modifier les coordonnées", icone: "server" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Icon i={a.icone} size={15} /> {a.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Derniers messages */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-card-border">
          <h2 className="font-headings font-semibold text-base text-foreground">
            Derniers messages
          </h2>
          <Link href="/admin/messages" className="text-sm text-primary hover:underline">
            Tout voir
          </Link>
        </div>
        {derniers.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">Aucun message pour le moment.</p>
        ) : (
          <ul className="divide-y divide-card-border">
            {derniers.map((m) => (
              <li key={m.id} className="px-6 py-3.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className={`text-sm ${m.lu ? "text-muted-foreground" : "font-semibold text-foreground"}`}>
                    {m.nom} — <span className="font-normal">{m.sujet || "(sans sujet)"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(m.creeLe * 1000).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

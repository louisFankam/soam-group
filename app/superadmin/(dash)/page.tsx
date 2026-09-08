import Link from "next/link";
import { count } from "drizzle-orm";
import Icon from "@/components/ui";
import { db } from "@/lib/db";
import { articles, messages, realisations, utilisateurs } from "@/lib/schema";
import { sessionActive } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  const session = await sessionActive();
  const email = session?.email ?? "admin";

  const [[nbArticles], [nbRealisations], [nbMessages], [nbUtilisateurs]] = await Promise.all([
    db.select({ value: count() }).from(articles),
    db.select({ value: count() }).from(realisations),
    db.select({ value: count() }).from(messages),
    db.select({ value: count() }).from(utilisateurs),
  ]);

  const cartes = [
    { icone: "file-text", label: "Articles publiés", valeur: String(nbArticles.value), note: "au total" },
    { icone: "folder-check", label: "Réalisations", valeur: String(nbRealisations.value), note: "au total" },
    { icone: "mail", label: "Messages reçus", valeur: String(nbMessages.value), note: "au total" },
    { icone: "user-check", label: "Utilisateurs", valeur: String(nbUtilisateurs.value), note: "enregistrés" },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <div
        className="rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #060d1f 0%, #0d7c3d 100%)" }}
      >
        <div>
          <h1 className="text-white font-headings font-bold text-xl mb-1">
            SuperAdmin — Tableau de bord
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

      <section className="bg-card border border-card-border rounded-2xl p-6">
        <h2 className="font-headings font-semibold text-base text-foreground mb-4">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/superadmin/pages", label: "Gérer les pages", icone: "file-text" },
            { href: "/superadmin/utilisateurs/nouveau", label: "Créer un utilisateur", icone: "user-check" },
            { href: "/superadmin/parametres", label: "Paramètres du site", icone: "server" },
            { href: "/superadmin/blog/articles/nouveau", label: "Écrire un article", icone: "pen-tool" },
            { href: "/superadmin/equipe", label: "Équipe", icone: "users" },
            { href: "/superadmin/menu", label: "Menu du site", icone: "menu" },
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
    </div>
  );
}

/**
 * Seed : réinitialise la DB avec le contenu de référence (lib/content.ts)
 * et crée le compte admin. Idempotent — relançable à volonté.
 *
 * Usage : npx tsx scripts/seed.ts
 * Env   : ADMIN_EMAIL, ADMIN_PASSWORD (défaut: admin@soamgroup.net / admin123)
 */
import { randomBytes, scryptSync } from "node:crypto";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../lib/schema";
// ponytail: content.ts reste la source de vérité du seed ; l'admin écrira dans la DB.
import {
  site, navLinks, hero, stats, expertises, featuredSolution, solutions,
  whyItems, portfolioFilters, portfolio, softwareProducts, partners,
  testimonials, news, faqItems, contactSubjects, titres,
} from "../lib/content";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./soam.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

function hashMotDePasse(mdp: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(mdp, salt, 64).toString("hex")}`;
}

async function main() {
  // Contenu de référence
  await db.delete(schema.expertises);
  await db.insert(schema.expertises).values(
    expertises.map((e, i) => ({ ...e, ordre: i })),
  );
  console.log(`✓ ${expertises.length} expertises`);

  await db.delete(schema.logiciels);
  await db.insert(schema.logiciels).values(softwareProducts);
  console.log(`✓ ${softwareProducts.length} logiciels`);

  await db.delete(schema.solutions);
  await db.insert(schema.solutions).values(solutions);
  console.log(`✓ ${solutions.length} solutions`);

  await db.delete(schema.realisations);
  await db.insert(schema.realisations).values(portfolio);
  console.log(`✓ ${portfolio.length} réalisations`);

  await db.delete(schema.articles);
  await db.insert(schema.articles).values(news);
  console.log(`✓ ${news.length} articles`);

  const membres = [
    { nom: "Issa OUEDRAOGO", role: "Directeur Général", imageSeed: "ceo-portrait-burkina", ordre: 0 },
    { nom: "Aminata ZONGO", role: "Directrice Technique", imageSeed: "cto-portrait-woman", ordre: 1 },
    { nom: "Karim SAWADOGO", role: "Responsable Cybersécurité", imageSeed: "ciso-portrait-man", ordre: 2 },
    { nom: "Fatou KABORE", role: "Responsable Formation", imageSeed: "training-manager-portrait", ordre: 3 },
  ];
  await db.delete(schema.equipe);
  await db.insert(schema.equipe).values(membres);
  console.log(`✓ ${membres.length} membres équipe`);

  // Paramètres globaux (blobs JSON)
  const params: Record<string, unknown> = {
    site, navLinks, hero, stats, whyItems, partners, testimonials,
    faqItems, portfolioFilters, contactSubjects, featuredSolution, titres,
  };
  for (const [cle, valeur] of Object.entries(params)) {
    await db.insert(schema.parametres).values({ cle, valeur }).onConflictDoUpdate({
      target: schema.parametres.cle,
      set: { valeur: valeur as object },
    });
  }
  console.log(`✓ ${Object.keys(params).length} paramètres`);

  // Utilisateurs
  await db.delete(schema.utilisateurs);

  const saEmail = process.env.SUPERADMIN_EMAIL ?? "admin@soamgroup.net";
  const saMdp = process.env.SUPERADMIN_PASSWORD ?? "admin123";
  if (!process.env.SUPERADMIN_PASSWORD) {
    console.warn("⚠ SUPERADMIN_PASSWORD non défini — mot de passe par défaut 'admin123' (dev uniquement !)");
  }
  await db.insert(schema.utilisateurs).values({
    email: saEmail,
    nom: "Directeur Général",
    motDePasseHash: hashMotDePasse(saMdp),
    role: "superadmin",
  });
  console.log(`✓ superadmin : ${saEmail} / ${saMdp}`);

  const edEmail = process.env.EDITEUR_EMAIL ?? "editeur@soamgroup.net";
  const edMdp = process.env.EDITEUR_PASSWORD ?? "editeur123";
  if (!process.env.EDITEUR_PASSWORD) {
    console.warn("⚠ EDITEUR_PASSWORD non défini — mot de passe par défaut 'editeur123' (dev uniquement !)");
  }
  await db.insert(schema.utilisateurs).values({
    email: edEmail,
    nom: "Éditeur",
    motDePasseHash: hashMotDePasse(edMdp),
    role: "editor",
  });
  console.log(`✓ éditeur  : ${edEmail} / ${edMdp}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

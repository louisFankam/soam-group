import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// ponytail: les listes (features, points, body...) sont du JSON texte typé ;
// suffisant tant qu'on ne filtre pas dedans en SQL.

export const expertises = sqliteTable("expertises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  prestations: text("prestations", { mode: "json" }).$type<string[]>().notNull(),
  color: text("color").notNull().default("primary"),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
  ordre: integer("ordre").notNull().default(0),
});

export const logiciels = sqliteTable("logiciels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  features: text("features", { mode: "json" }).$type<string[]>().notNull(),
  benefits: text("benefits", { mode: "json" }).$type<string[]>().notNull(),
  color: text("color").notNull().default("primary"),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
});

export const solutions = sqliteTable("solutions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull().default("primary"),
  longDescription: text("long_description").notNull(),
  points: text("points", { mode: "json" }).$type<string[]>().notNull(),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
});

export const realisations = sqliteTable("realisations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
  color: text("color").notNull().default("primary"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  contexte: text("contexte").notNull().default(""),
  mission: text("mission").notNull().default(""),
  resultats: text("resultats", { mode: "json" }).$type<string[]>().notNull().default([]),
  span: integer("span").notNull().default(1),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
  body: text("body", { mode: "json" }).$type<string[]>().notNull(),
});

export const equipe = sqliteTable("equipe", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  imageSeed: text("image_seed").notNull(),
  imageUrl: text("image_url"),
  ordre: integer("ordre").notNull().default(0),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone").notNull().default(""),
  sujet: text("sujet").notNull().default(""),
  message: text("message").notNull(),
  lu: integer("lu", { mode: "boolean" }).notNull().default(false),
  archive: integer("archive", { mode: "boolean" }).notNull().default(false),
  creeLe: integer("cree_le").notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
});

export const utilisateurs = sqliteTable("utilisateurs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  motDePasseHash: text("mot_de_passe_hash").notNull(),
  creeLe: integer("cree_le").notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
});

export const parametres = sqliteTable("parametres", {
  cle: text("cle").primaryKey(),
  valeur: text("valeur", { mode: "json" }).notNull(),
});

// Statistiques de visites : agrégat par jour et chemin (pas de ligne par vue,
// la table reste bornée : jours x pages). Alimentée par /api/visite.
export const visites = sqliteTable("visites", {
  jour: text("jour").notNull(), // YYYY-MM-DD (UTC)
  chemin: text("chemin").notNull(),
  vues: integer("vues").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.jour, t.chemin] })]);

// Anti brute-force sur /admin/login : 5 échecs -> 15 min de blocage par email.
export const tentativesConnexion = sqliteTable("tentatives_connexion", {
  email: text("email").primaryKey(),
  echecs: integer("echecs").notNull().default(0),
  bloqueJusqua: integer("bloque_jusqua"), // epoch secondes, null = non bloqué
});

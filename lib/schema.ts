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
  nom: text("nom").notNull().default(""),
  motDePasseHash: text("mot_de_passe_hash").notNull(),
  role: text("role").notNull().default("editor"), // superadmin | editor | viewer
  actif: integer("actif", { mode: "boolean" }).notNull().default(true),
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

// Demandes de devis du formulaire public /devis, traitées dans /admin/devis.
export const devis = sqliteTable("devis", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  organisation: text("organisation").notNull().default(""),
  telephone: text("telephone").notNull(),
  email: text("email").notNull(),
  secteur: text("secteur").notNull(),
  service: text("service").notNull(),
  budget: text("budget").notNull().default(""),
  description: text("description").notNull(),
  fichierUrl: text("fichier_url"),
  // nouveau | en_cours | traite | refuse
  statut: text("statut").notNull().default("nouveau"),
  creeLe: integer("cree_le").notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
});

// ============================================================================
// PHASE 2 — Tables de contenu CMS (superadmin)
// ============================================================================

// Cox: timestamp partagé en secondes (epoch) comme le reste du schéma.
const ts = () => integer("cree_le").notNull().$defaultFn(() => Math.floor(Date.now() / 1000));
const tsUpd = () => integer("modifie_le").notNull().$defaultFn(() => Math.floor(Date.now() / 1000));

// ---- Pages dynamiques + sections -------------------------------------------
export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id"),
  isHomepage: integer("is_homepage", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  showInMenu: integer("show_in_menu", { mode: "boolean" }).notNull().default(true),
  menuOrder: integer("menu_order").notNull().default(0),
  template: text("template").notNull().default("standard"),
  cssClasses: text("css_classes").notNull().default(""),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  metaKeywords: text("meta_keywords").notNull().default(""),
  publishedAt: integer("published_at"),
  creeLe: ts(),
  modifieLe: tsUpd(),
});

export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
  sectionType: text("section_type").notNull(),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  content: text("content", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  settings: text("settings", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  cssClasses: text("css_classes").notNull().default(""),
  animation: text("animation").notNull().default(""),
  orderColumn: integer("order_column").notNull().default(0),
  creeLe: ts(),
  modifieLe: tsUpd(),
});

// ---- Blog ------------------------------------------------------------------
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  group: text("group").notNull().default("blog"), // blog | service | project
  description: text("description").notNull().default(""),
  ordre: integer("ordre").notNull().default(0),
});

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const postTag = sqliteTable(
  "post_tag",
  {
    postId: integer("post_id").notNull(), // FK posts résolue plus bas
    tagId: integer("tag_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id"),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body", { mode: "json" }).$type<unknown[]>().notNull().default([]),
  imageUrl: text("image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  publishedAt: integer("published_at"),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  authorId: integer("author_id"),
  creeLe: ts(),
  modifieLe: tsUpd(),
});

// ---- Modules ---------------------------------------------------------------
export const temoignages = sqliteTable("temoignages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  company: text("company").notNull().default(""),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  imageUrl: text("image_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ordre: integer("ordre").notNull().default(0),
});

export const membresEquipe = sqliteTable("membres_equipe", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  imageUrl: text("image_url"),
  social: text("social", { mode: "json" }).$type<Record<string, string>>().notNull().default({}),
  ordre: integer("ordre").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull().default(""),
  description: text("description").notNull().default(""),
  longDescription: text("long_description").notNull().default(""),
  imageUrl: text("image_url"),
  color: text("color").notNull().default("primary"),
  ordre: integer("ordre").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const projets = sqliteTable("projets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id"),
  description: text("description").notNull().default(""),
  contexte: text("contexte").notNull().default(""),
  mission: text("mission").notNull().default(""),
  resultats: text("resultats", { mode: "json" }).$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  color: text("color").notNull().default("primary"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  ordre: integer("ordre").notNull().default(0),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default(""),
  ordre: integer("ordre").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  fileUrl: text("file_url").notNull(),
  category: text("category").notNull().default(""),
  downloads: integer("downloads").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ordre: integer("ordre").notNull().default(0),
});

export const offresEmploi = sqliteTable("offres_emploi", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  department: text("department").notNull().default(""),
  location: text("location").notNull().default(""),
  type: text("type").notNull().default("CDI"),
  description: text("description").notNull().default(""),
  requirements: text("requirements", { mode: "json" }).$type<string[]>().notNull().default([]),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  publishedAt: integer("published_at"),
});

export const clientsPartenaires = sqliteTable("clients_partenaires", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull().default("client"), // client | partner
  logoUrl: text("logo_url"),
  url: text("url").notNull().default(""),
  ordre: integer("ordre").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// ---- Formulaires / boutique -------------------------------------------------
export const soumissionsFormulaires = sqliteTable("soumissions_formulaires", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionId: integer("section_id"),
  data: text("data", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  ip: text("ip").notNull().default(""),
  creeLe: ts(),
});

export const produits = sqliteTable("produits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  category: text("category").notNull().default(""),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ordre: integer("ordre").notNull().default(0),
});

export const commandes = sqliteTable("commandes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone").notNull().default(""),
  items: text("items", { mode: "json" }).$type<unknown[]>().notNull().default([]),
  statut: text("statut").notNull().default("nouveau"), // nouveau | paye | expedie | annule
  total: integer("total").notNull().default(0),
  notes: text("notes").notNull().default(""),
  creeLe: ts(),
});

// ---- Menus / médias ---------------------------------------------------------
export const menus = sqliteTable("menus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  location: text("location").notNull().default("header"), // header | footer
  items: text("items", { mode: "json" }).$type<unknown[]>().notNull().default([]),
});

export const medias = sqliteTable("medias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull().default(""),
  size: integer("size").notNull().default(0),
  path: text("path").notNull().default(""),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  creeLe: ts(),
});

// ---- Système ----------------------------------------------------------------
export const journauxActivite = sqliteTable("journaux_activite", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  action: text("action").notNull(),
  subjectType: text("subject_type").notNull().default(""),
  subjectId: integer("subject_id"),
  description: text("description").notNull().default(""),
  properties: text("properties", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
  ip: text("ip").notNull().default(""),
  creeLe: ts(),
});

export const sauvegardes = sqliteTable("sauvegardes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  size: integer("size").notNull().default(0),
  creeLe: ts(),
});

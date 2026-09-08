// boala: Lectures de données CMS pour le rendu public (Phase 6) et pour le
// back-office superadmin. Toutes les lectures publiques passent par
// unstable_cache taggée (voir AGENTS.md) — les mutations superadmin
// appellent revalidatePath/revalidateTag sur ces tags.
import { eq, asc, desc, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import {
  parametres, pages, sections, menus, posts, categories, tags,
  temoignages, membresEquipe, services, projets, faqs, documents,
  offresEmploi, clientsPartenaires, produits, commandes, medias,
  soumissionsFormulaires, journauxActivite, sauvegardes, messages,
  devis,
} from "./schema";
import { settingsDefauts, type SettingsData } from "./settings";

export const TAGS_CMS = {
  parametres: "parametres",   // réutilise le tag existant
  pages: "superadmin-pages",
  sections: "superadmin-sections",
  menus: "superadmin-menus",
  posts: "superadmin-posts",
  categories: "superadmin-categories",
  tags: "superadmin-tags",
  temoignages: "superadmin-temoignages",
  equipe: "superadmin-equipe",
  services: "superadmin-services",
  projets: "superadmin-projets",
  faq: "superadmin-faq",
  documents: "superadmin-documents",
  emplois: "superadmin-emplois",
  clients: "superadmin-clients",
  produits: "superadmin-produits",
  commandes: "superadmin-commandes",
  medias: "superadmin-medias",
} as const;

export async function getSettings(): Promise<SettingsData> {
  return unstable_cache(
    async () => {
      const p = await db.select().from(parametres).where(eq(parametres.cle, "settings")).get();
      const se = (p?.valeur as SettingsData | undefined) ?? {};
      const defauts = settingsDefauts();
      // fusion défauts + valeurs, groupe par groupe
      const out: SettingsData = {};
      for (const g of Object.keys(defauts)) out[g] = { ...defauts[g], ...(se[g] ?? {}) };
      return out;
    },
    ["cms-settings"],
    { tags: [TAGS_CMS.parametres] },
  )();
}

export async function getPages(): Promise<(typeof pages.$inferSelect)[]> {
  return unstable_cache(
    async () => db.select().from(pages).orderBy(asc(pages.menuOrder)),
    ["cms-pages"],
    { tags: [TAGS_CMS.pages] },
  )();
}

export async function getPagePublished(slug: string) {
  return unstable_cache(
    async () => db.select().from(pages).where(and(eq(pages.slug, slug), eq(pages.isPublished, true))).get(),
    ["cms-page", slug],
    { tags: [TAGS_CMS.pages, TAGS_CMS.sections] },
  )();
}

export async function getSectionsPage(pageId: number) {
  return unstable_cache(
    async () => db.select().from(sections).where(and(eq(sections.pageId, pageId), eq(sections.isVisible, true))).orderBy(asc(sections.orderColumn)),
    ["cms-sections", String(pageId)],
    { tags: [TAGS_CMS.sections] },
  )();
}

export async function getMenus(): Promise<(typeof menus.$inferSelect)[]> {
  return unstable_cache(
    async () => db.select().from(menus),
    ["cms-menus"],
    { tags: [TAGS_CMS.menus] },
  )();
}

export async function getPostsPublici(): Promise<(typeof posts.$inferSelect)[]> {
  return unstable_cache(
    async () => db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.publishedAt)),
    ["cms-posts"],
    { tags: [TAGS_CMS.posts] },
  )();
}

export async function getPostPublic(slug: string) {
  return unstable_cache(
    async () => db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.isPublished, true))).get(),
    ["cms-post", slug],
    { tags: [TAGS_CMS.posts] },
  )();
}

export async function getCategoriesPublic() {
  return unstable_cache(
    async () => db.select().from(categories).orderBy(asc(categories.ordre)),
    ["cms-categories"],
    { tags: [TAGS_CMS.categories] },
  )();
}

export async function getTagsPublic() {
  return unstable_cache(async () => db.select().from(tags), ["cms-tags"], { tags: [TAGS_CMS.tags] })();
}

export async function getTemoignagesPublic() {
  return unstable_cache(
    async () => db.select().from(temoignages).where(eq(temoignages.isActive, true)).orderBy(asc(temoignages.ordre)),
    ["cms-temoignages"],
    { tags: [TAGS_CMS.temoignages] },
  )();
}

export async function getEquipePublic() {
  return unstable_cache(
    async () => db.select().from(membresEquipe).where(eq(membresEquipe.isActive, true)).orderBy(asc(membresEquipe.ordre)),
    ["cms-equipe"],
    { tags: [TAGS_CMS.equipe] },
  )();
}

export async function getServicesPublic() {
  return unstable_cache(
    async () => db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.ordre)),
    ["cms-services"],
    { tags: [TAGS_CMS.services] },
  )();
}

export async function getProjetsPublic() {
  return unstable_cache(
    async () => db.select().from(projets).where(eq(projets.isPublished, true)).orderBy(asc(projets.ordre)),
    ["cms-projets"],
    { tags: [TAGS_CMS.projets] },
  )();
}

export async function getFaqPublic() {
  return unstable_cache(
    async () => db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(asc(faqs.ordre)),
    ["cms-faq"],
    { tags: [TAGS_CMS.faq] },
  )();
}

export async function getDocumentsPublic() {
  return unstable_cache(
    async () => db.select().from(documents).where(eq(documents.isActive, true)).orderBy(asc(documents.ordre)),
    ["cms-documents"],
    { tags: [TAGS_CMS.documents] },
  )();
}

export async function getEmploisPublic() {
  return unstable_cache(
    async () => db.select().from(offresEmploi).where(eq(offresEmploi.isActive, true)),
    ["cms-emplois"],
    { tags: [TAGS_CMS.emplois] },
  )();
}

export async function getClientsPublic() {
  return unstable_cache(
    async () => db.select().from(clientsPartenaires).where(eq(clientsPartenaires.isActive, true)).orderBy(asc(clientsPartenaires.ordre)),
    ["cms-clients"],
    { tags: [TAGS_CMS.clients] },
  )();
}

export async function getProduitsPublic() {
  return unstable_cache(
    async () => db.select().from(produits).where(eq(produits.isActive, true)).orderBy(asc(produits.ordre)),
    ["cms-produits"],
    { tags: [TAGS_CMS.produits] },
  )();
}

export async function getCommandesPublic() {
  return unstable_cache(async () => db.select().from(commandes).orderBy(desc(commandes.id)), ["cms-commandes"], { tags: [TAGS_CMS.commandes] })();
}

export async function getMediasPublic() {
  return unstable_cache(async () => db.select().from(medias).orderBy(desc(medias.id)), ["cms-medias"], { tags: [TAGS_CMS.medias] })();
}

export async function getSoumissionsFormulairesPublic() {
  return db.select().from(soumissionsFormulaires).orderBy(desc(soumissionsFormulaires.id));
}

export async function getMessagesPublic() {
  return db.select().from(messages).orderBy(desc(messages.creeLe));
}

export async function getDevisPublic() {
  return db.select().from(devis).orderBy(desc(devis.creeLe));
}

export async function getJournalPublic() {
  return db.select().from(journauxActivite).orderBy(desc(journauxActivite.id));
}

export async function getSauvegardesPublic() {
  return db.select().from(sauvegardes).orderBy(desc(sauvegardes.id));
}

export type TypePageRow = typeof pages.$inferSelect;
export type TypeSectionRow = typeof sections.$inferSelect;
export type TypeMenuRow = typeof menus.$inferSelect;
export type TypePostRow = typeof posts.$inferSelect;

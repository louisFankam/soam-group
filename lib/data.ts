import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import { titres as titresDefaut } from "./content";
import {
  articles, expertises, equipe, logiciels, parametres,
  realisations, solutions,
} from "./schema";

// ponytail: cache manuel par tag ; l'admin appelle revalidateTag(tag) à chaque mutation.

export type Expertise = typeof expertises.$inferSelect;
export type Logiciel = typeof logiciels.$inferSelect;
export type Solution = typeof solutions.$inferSelect;
export type Realisation = typeof realisations.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type MembreEquipe = typeof equipe.$inferSelect;

export const TAGS = {
  expertises: "expertises",
  logiciels: "logiciels",
  solutions: "solutions",
  realisations: "realisations",
  articles: "articles",
  equipe: "equipe",
  parametres: "parametres",
} as const;

export async function getExpertises(): Promise<Expertise[]> {
  return unstable_cache(
    async () => db.select().from(expertises).orderBy(expertises.ordre),
    ["expertises-list"],
    { tags: [TAGS.expertises] },
  )();
}

export async function getExpertise(slug: string): Promise<Expertise | undefined> {
  return unstable_cache(
    async () => db.select().from(expertises).where(eq(expertises.slug, slug)).get(),
    ["expertise", slug],
    { tags: [TAGS.expertises] },
  )();
}

export async function getLogiciels(): Promise<Logiciel[]> {
  return unstable_cache(
    async () => db.select().from(logiciels),
    ["logiciels-list"],
    { tags: [TAGS.logiciels] },
  )();
}

export async function getLogiciel(slug: string): Promise<Logiciel | undefined> {
  return unstable_cache(
    async () => db.select().from(logiciels).where(eq(logiciels.slug, slug)).get(),
    ["logiciel", slug],
    { tags: [TAGS.logiciels] },
  )();
}

export async function getSolutions(): Promise<Solution[]> {
  return unstable_cache(
    async () => db.select().from(solutions),
    ["solutions-list"],
    { tags: [TAGS.solutions] },
  )();
}

export async function getSolution(slug: string): Promise<Solution | undefined> {
  return unstable_cache(
    async () => db.select().from(solutions).where(eq(solutions.slug, slug)).get(),
    ["solution", slug],
    { tags: [TAGS.solutions] },
  )();
}

export async function getRealisations(): Promise<Realisation[]> {
  return unstable_cache(
    async () => db.select().from(realisations),
    ["realisations-list"],
    { tags: [TAGS.realisations] },
  )();
}

export async function getRealisation(slug: string): Promise<Realisation | undefined> {
  return unstable_cache(
    async () => db.select().from(realisations).where(eq(realisations.slug, slug)).get(),
    ["realisation", slug],
    { tags: [TAGS.realisations] },
  )();
}

export async function getArticles(): Promise<Article[]> {
  return unstable_cache(
    async () => db.select().from(articles),
    ["articles-list"],
    { tags: [TAGS.articles] },
  )();
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return unstable_cache(
    async () => db.select().from(articles).where(eq(articles.slug, slug)).get(),
    ["article", slug],
    { tags: [TAGS.articles] },
  )();
}

export async function getEquipe(): Promise<MembreEquipe[]> {
  return unstable_cache(
    async () => db.select().from(equipe).orderBy(equipe.ordre),
    ["equipe-list"],
    { tags: [TAGS.equipe] },
  )();
}

export async function getParametres(): Promise<Record<string, unknown>> {
  return unstable_cache(
    async () => Object.fromEntries(
      (await db.select().from(parametres)).map((p) => [p.cle, p.valeur]),
    ),
    ["parametres-all"],
    { tags: [TAGS.parametres] },
  )();
}

// Titres de bannières/sections : blob "titres" édité en admin,
// avec repli sur les valeurs statiques si la clé n'est pas encore seedée.
export type TitreSection = { badge?: string; title: string; subtitle?: string; texte?: string };
export type TitresData = typeof titresDefaut;

export async function getTitres(): Promise<TitresData> {
  return ((await getParametres()).titres as TitresData | undefined) ?? titresDefaut;
}

// Types des blobs de paramètres (seedés depuis lib/content.ts)
export type SiteInfo = {
  name: string; tagline: string; phone: string; whatsapp: string;
  email: string; address: string; hours: string;
};
export type HeroData = {
  badge: string; title: string; subtitle: string; videoSrc: string; imageSeed: string;
  imageUrl?: string | null;
};
export type NavLink = { label: string; href: string };
export type StatItem = { n: string; label: string; icon: string; color: string };
export type WhyItem = { icon: string; title: string; text: string; color: string };
export type Testimonial = { quote: string; name: string; role: string; company: string };
export type FaqItem = { q: string; a: string };
export type FeaturedSolution = {
  badge: string; title: string; slug: string; description: string; imageSeed: string;
  imageUrl?: string | null;
};

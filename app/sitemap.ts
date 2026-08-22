import type { MetadataRoute } from "next";
import {
  getArticles,
  getExpertises,
  getLogiciels,
  getRealisations,
  getSolutions,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.soamgroup.net";
  const [expertises, logiciels, realisations, solutions, news] = await Promise.all([
    getExpertises(),
    getLogiciels(),
    getRealisations(),
    getSolutions(),
    getArticles(),
  ]);
  const statics = [
    "",
    "/expertises",
    "/solutions",
    "/realisations",
    "/logiciels",
    "/actualites",
    "/a-propos",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite",
  ].map((p) => ({ url: `${base}${p}` }));
  return [
    ...statics,
    ...expertises.map((e) => ({ url: `${base}/expertises/${e.slug}` })),
    ...logiciels.map((l) => ({ url: `${base}/logiciels/${l.slug}` })),
    ...realisations.map((r) => ({ url: `${base}/realisations/${r.slug}` })),
    ...solutions.map((s) => ({ url: `${base}/solutions/${s.slug}` })),
    ...news.map((n) => ({ url: `${base}/actualites/${n.slug}` })),
  ];
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { NewsCard } from "@/components/cards";
import { Stagger, Item } from "@/components/motion";
import { getArticles, getTitres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Actualités — SOAM GROUP",
  description:
    "Actualités, partenariats et innovations de SOAM GROUP : suivez la vie de l'entreprise et nos lancements produits.",
};

export default async function ActualitesPage() {
  const [news, t] = await Promise.all([getArticles(), getTitres()]);
  return (
    <>
      <main>
        <PageHero
          {...t.pages.actualites}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-section-alt">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {news.map((n) => (
              <Item key={n.slug}>
                <Link
                  href={`/actualites/${n.slug}`}
                  className="group block bg-card border border-card-border rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <NewsCard {...n} />
                </Link>
              </Item>
            ))}
          </Stagger>
        </section>
      </main>
    </>
  );
}

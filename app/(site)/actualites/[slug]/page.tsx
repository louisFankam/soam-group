import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getArticle, getArticles } from "@/lib/data";

export async function generateStaticParams() {
  return (await getArticles()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Actualités SOAM GROUP`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [`/api/og?titre=${encodeURIComponent(article.title)}`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const autres = (await getArticles()).filter((n) => n.slug !== slug).slice(0, 2);

  return (
    <>
      <main>
        <PageHero
          badge={article.category}
          title={article.title}
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Actualités", href: "/actualites" },
            { label: article.date },
          ]}
        />

        <article className="px-6 lg:px-16 py-16 bg-background">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="rounded-2xl overflow-hidden border border-card-border mb-8">
                <Img
                  seed={article.imageSeed}
                  imageUrl={article.imageUrl}
                  w={1000}
                  h={500}
                  alt={article.title}
                  className="w-full object-cover"
                />
              </div>
              <p className="text-muted-foreground text-sm mb-6">{article.excerpt}</p>
              <div className="space-y-5">
                {article.body.map((paragraphe, i) => (
                  <p key={i} className="text-foreground leading-relaxed">
                    {paragraphe}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                <Link
                  href="/actualites"
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                >
                  <Icon i="arrow-right" size={14} className="rotate-180" />
                  Toutes les actualités
                </Link>
                <Link
                  href="/contact"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Nous contacter
                </Link>
              </div>
            </Reveal>
          </div>
        </article>

        {autres.length > 0 && (
          <section className="px-6 lg:px-16 py-14 bg-section-alt">
            <h2 className="font-headings font-bold text-xl text-foreground mb-6 text-center">
              À lire aussi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {autres.map((n) => (
                <Link
                  key={n.slug}
                  href={`/actualites/${n.slug}`}
                  className="group bg-card border border-card-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-xl mb-3">
                    {n.category}
                  </span>
                  <h3 className="font-headings font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {n.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1.5">{n.date}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

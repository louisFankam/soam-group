import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero, { DetailCta } from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal } from "@/components/motion";
import { getLogiciels, getLogiciel } from "@/lib/data";

export async function generateStaticParams() {
  return (await getLogiciels()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getLogiciel(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.tagline} | SOAM GROUP`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [`/api/og?titre=${encodeURIComponent(product.name)}`],
    },
  };
}

export default async function LogicielPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getLogiciel(slug);
  if (!product) notFound();
  const otherProducts = (await getLogiciels())
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <main>
        <PageHero
          badge={product.tagline}
          title={product.name}
          subtitle={product.description}
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Logiciels", href: "/logiciels" },
            { label: product.name },
          ]}
        />

        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <Reveal>
              <h2 className="font-headings font-bold text-2xl text-foreground mb-4">
                Présentation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.longDescription}
              </p>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${chipBg(product.color)}`}
                    >
                      <Icon i="check" size={14} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-card-border shadow-xl">
                <Img
                  seed={product.imageSeed}
                  imageUrl={product.imageUrl}
                  w={800}
                  h={600}
                  alt={`${product.name} — interface`}
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-6 lg:px-16 py-16 bg-section-alt">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <h2 className="font-headings font-bold text-2xl text-foreground mb-8 text-center">
                Pourquoi choisir {product.name} ?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.benefits.map((b, i) => (
                <Reveal key={b} delay={i * 0.1}>
                  <div className="bg-card border border-card-border rounded-xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-headings font-bold ${chipBg(product.color)}`}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <DetailCta label={`Demander une démo de ${product.name}`} />

        {/* Autres produits */}
        <section className="px-6 lg:px-16 py-16 bg-background">
          <h2 className="font-headings font-bold text-xl text-foreground mb-6 text-center">
            Découvrez aussi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {otherProducts.map((s) => (
              <Link
                key={s.slug}
                href={`/logiciels/${s.slug}`}
                className="group bg-card border border-card-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-xl mb-3 ${chipBg(s.color)}`}>
                  {s.tagline}
                </span>
                <h3 className="font-headings font-semibold text-foreground group-hover:text-primary transition-colors">
                  {s.name}
                </h3>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

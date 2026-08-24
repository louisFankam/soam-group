import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero, { DetailCta } from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal } from "@/components/motion";
import { getRealisation, getRealisations } from "@/lib/data";

export async function generateStaticParams() {
  return (await getRealisations()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projet = await getRealisation(slug);
  if (!projet) return {};
  return {
    title: `${projet.title} — Réalisation SOAM GROUP`,
    description: projet.description,
    openGraph: {
      title: projet.title,
      description: projet.description,
      images: [`/api/og?titre=${encodeURIComponent(projet.title)}`],
    },
  };
}

export default async function RealisationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projet = await getRealisation(slug);
  if (!projet) notFound();
  const autres = (await getRealisations()).filter((p) => p.slug !== slug).slice(0, 3);

  const blocs = [
    { titre: "Le contexte", texte: projet.contexte },
    { titre: "Notre mission", texte: projet.mission },
  ];

  return (
    <>
      <main>
        <PageHero
          badge={projet.category}
          title={projet.title}
          subtitle={projet.description}
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Réalisations", href: "/realisations" },
            { label: projet.title },
          ]}
        />

        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="max-w-4xl mx-auto space-y-12">
            {blocs.map((b, i) => (
              <Reveal key={b.titre} delay={i * 0.1}>
                <h2 className="font-headings font-bold text-2xl text-foreground mb-4">
                  {b.titre}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{b.texte}</p>
              </Reveal>
            ))}
            <Reveal>
              <h2 className="font-headings font-bold text-2xl text-foreground mb-6">
                Résultats
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {projet.resultats.map((r) => (
                  <div
                    key={r}
                    className="rounded-xl p-5 bg-card border border-card-border"
                  >
                    <Icon
                      i="check"
                      size={20}
                      className={`${chipBg(projet.color)} block mb-2`}
                    />
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {r}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-card-border">
                <Img
                  seed={projet.imageSeed}
                  imageUrl={projet.imageUrl}
                  w={1200}
                  h={500}
                  alt={projet.title}
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <DetailCta label="Un projet similaire ?" />

        <section className="px-6 lg:px-16 py-16 bg-background">
          <h2 className="font-headings font-bold text-xl text-foreground mb-6 text-center">
            Autres réalisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {autres.map((p) => (
              <Link
                key={p.slug}
                href={`/realisations/${p.slug}`}
                className="group bg-card border border-card-border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-xl mb-3 ${chipBg(p.color)}`}>
                  {p.category}
                </span>
                <h3 className="font-headings font-semibold text-foreground group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

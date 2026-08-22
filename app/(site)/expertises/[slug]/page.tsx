import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero, { DetailCta } from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal } from "@/components/motion";
import { getExpertise, getExpertises, getRealisations } from "@/lib/data";

export async function generateStaticParams() {
  return (await getExpertises()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExpertise(slug);
  if (!exp) return {};
  return {
    title: `${exp.title} — Expertise SOAM GROUP`,
    description: exp.description,
    openGraph: {
      title: exp.title,
      description: exp.description,
      images: [`/api/og?titre=${encodeURIComponent(exp.title)}`],
    },
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [exp, expertises, portfolio] = await Promise.all([
    getExpertise(slug),
    getExpertises(),
    getRealisations(),
  ]);
  if (!exp) notFound();

  const connexes = expertises.filter((e) => e.slug !== slug).slice(0, 3);
  const projetsLies = portfolio
    .filter((p) => p.category.toLowerCase().includes(slug.split("-")[0].toLowerCase()))
    .slice(0, 2);

  return (
    <>
      <main>
        <PageHero
          badge="Expertise"
          title={exp.title}
          subtitle={exp.description}
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Expertises", href: "/expertises" },
            { label: exp.title },
          ]}
        />

        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <Reveal>
              <h2 className="font-headings font-bold text-2xl text-foreground mb-4">
                Notre approche
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {exp.longDescription}
              </p>
              <h3 className="font-headings font-semibold text-lg text-foreground mb-4">
                Nos prestations
              </h3>
              <ul className="space-y-3">
                {exp.prestations.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${chipBg(exp.color)}`}
                    >
                      <Icon i="check" size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-card-border shadow-xl">
                <Img
                  seed={exp.imageSeed}
                  imageUrl={exp.imageUrl}
                  w={800}
                  h={640}
                  alt={exp.title}
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {projetsLies.length > 0 && (
          <section className="px-6 lg:px-16 py-14 bg-section-alt">
            <Reveal>
              <h2 className="font-headings font-bold text-xl text-foreground mb-6">
                Réalisations liées
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {projetsLies.map((p) => (
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
        )}

        <DetailCta />

        <section className="px-6 lg:px-16 py-14 bg-background">
          <h2 className="font-headings font-bold text-xl text-foreground mb-6 text-center">
            Autres expertises
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {connexes.map((e) => (
              <Link
                key={e.slug}
                href={`/expertises/${e.slug}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border bg-card text-sm hover:-translate-y-0.5 transition-all`}
              >
                <Icon i={e.icon} size={15} /> {e.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

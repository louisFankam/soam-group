import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero, { DetailCta } from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal } from "@/components/motion";
import { getSolution, getSolutions } from "@/lib/data";

export async function generateStaticParams() {
  return (await getSolutions()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sol = await getSolution(slug);
  if (!sol) return {};
  return {
    title: `${sol.title} — SOAM GROUP`,
    description: sol.desc,
    openGraph: {
      title: sol.title,
      description: sol.desc,
      images: [`/api/og?titre=${encodeURIComponent(sol.title)}`],
    },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sol = await getSolution(slug);
  if (!sol) notFound();
  const autres = (await getSolutions()).filter((s) => s.slug !== slug);

  return (
    <>
      <main>
        <PageHero
          badge="Solution sectorielle"
          title={sol.title}
          subtitle={sol.desc}
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Solutions", href: "/solutions" },
            { label: sol.title },
          ]}
        />

        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <Reveal>
              <h2 className="font-headings font-bold text-2xl text-foreground mb-4">
                Ce que comprend l&apos;offre
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {sol.longDescription}
              </p>
              <ul className="space-y-3">
                {sol.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${chipBg(sol.color)}`}
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
                  seed={sol.imageSeed}
                  imageUrl={sol.imageUrl}
                  w={800}
                  h={640}
                  alt={sol.title}
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <DetailCta label={`Activer la ${sol.title}`} />

        <section className="px-6 lg:px-16 py-14 bg-background">
          <h2 className="font-headings font-bold text-xl text-foreground mb-6 text-center">
            Autres solutions
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {autres.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border bg-card text-sm hover:-translate-y-0.5 hover:text-primary transition-all"
              >
                <Icon i={s.icon} size={15} /> {s.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

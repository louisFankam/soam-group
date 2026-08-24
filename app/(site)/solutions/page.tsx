import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal, Stagger, Item } from "@/components/motion";
import { getParametres, getSolutions, getTitres } from "@/lib/data";
import type { FeaturedSolution } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos solutions sectorielles — SOAM GROUP",
  description:
    "Solutions packagées par secteur : entreprise, santé, éducation, sécurité et énergie. Conçues pour les réalités africaines.",
};

export default async function SolutionsPage() {
  const [solutions, p, t] = await Promise.all([getSolutions(), getParametres(), getTitres()]);
  const featuredSolution = p.featuredSolution as FeaturedSolution;
  return (
    <>
      <main>
        <PageHero
          {...t.pages.solutions}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Solutions" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Solution phare */}
            <Reveal>
              <Link
                href={`/solutions/${featuredSolution.slug}`}
                className="group relative block rounded-2xl overflow-hidden min-h-[300px]"
              >
                <Img
                  seed={featuredSolution.imageSeed}
                  imageUrl={featuredSolution.imageUrl}
                  w={1200}
                  h={600}
                  alt={featuredSolution.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,79,189,0.92) 0%, rgba(26,79,189,0.45) 55%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-xl mb-3 inline-block">
                    {featuredSolution.badge}
                  </span>
                  <h2 className="text-white font-headings font-bold text-2xl mb-2">
                    {featuredSolution.title}
                  </h2>
                  <p className="text-white/75 text-sm mb-4 max-w-xl">
                    {featuredSolution.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white font-medium text-sm bg-white/20 group-hover:bg-white/30 transition-colors px-4 py-2 rounded-xl">
                    Découvrir <Icon i="arrow-right" size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
            {/* Autres solutions */}
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solutions.map((s) => (
                <Item key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="group bg-card border border-card-border rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <Img
                      seed={s.imageSeed}
                  imageUrl={s.imageUrl}
                      w={600}
                      h={280}
                      alt={s.title}
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <Icon i={s.icon} size={24} className={`block mb-3 ${chipBg(s.color)}`} />
                      <h2 className="font-headings font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {s.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        En savoir plus{" "}
                        <Icon
                          i="arrow-right"
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </Item>
              ))}
            </Stagger>
          </div>
        </section>
      </main>
    </>
  );
}

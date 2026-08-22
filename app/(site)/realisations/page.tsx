import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import { Reveal } from "@/components/motion";
import { getRealisations, getParametres, getTitres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos réalisations — SOAM GROUP",
  description:
    "Études de cas SOAM GROUP : réseaux, logiciels métiers, cybersécurité, énergie solaire et transformation numérique au Burkina Faso et en Afrique de l'Ouest.",
};

export default async function RealisationsPage() {
  const [portfolio, p, t] = await Promise.all([getRealisations(), getParametres(), getTitres()]);
  return (
    <>
      <main>
        <PageHero
          {...t.pages.realisations}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Réalisations" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-section-alt">
          <Reveal>
            <PortfolioGrid projets={portfolio} filters={p.portfolioFilters as string[]} />
          </Reveal>
        </section>
      </main>
    </>
  );
}

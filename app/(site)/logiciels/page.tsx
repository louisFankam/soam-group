import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SectionHeader, SoftwareCard } from "@/components/cards";
import { Reveal, Stagger, Item } from "@/components/motion";
import { getLogiciels, getTitres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos logiciels — SOAM GROUP",
  description:
    "Six produits SaaS SOAM : comptabilité & paie, RH, gestion scolaire, hospitalière, pharmacie et sécurité. Testez la démo.",
};

export default async function LogicielsPage() {
  const [logiciels, t] = await Promise.all([getLogiciels(), getTitres()]);
  return (
    <>
      <main>
        <PageHero
          {...t.pages.logiciels}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Logiciels" }]}
        />
        <section className="px-6 lg:px-16 py-20 bg-background">
          <Reveal>
            <SectionHeader
              badge="Suite SOAM"
              title="Choisissez le logiciel adapté à votre activité"
              subtitle="Chaque produit se déploie seul ou s'intègre aux autres modules de la suite."
            />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logiciels.map((s) => (
              <Item key={s.slug}>
                <SoftwareCard {...s} />
              </Item>
            ))}
          </Stagger>
        </section>
      </main>
    </>
  );
}

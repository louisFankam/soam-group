import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion";
import { getParametres, type SiteInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mentions légales — SOAM GROUP",
};

export default async function MentionsLegalesPage() {
  const p = await getParametres();
  const site = p.site as SiteInfo;

  const sections = [
    {
      titre: "Éditeur du site",
      texte: `Le présent site est édité par ${site.name}, société de droit burkinabè dont le siège social est situé ${site.address}. Téléphone : ${site.phone} — Email : ${site.email}.`,
    },
    {
      titre: "Directeur de la publication",
      texte: "La direction générale de SOAM GROUP assure la direction de la publication du site.",
    },
    {
      titre: "Hébergement",
      texte: "Le site est hébergé par un prestataire professionnel garantissant une disponibilité maximale. Les coordonnées complètes de l'hébergeur sont disponibles sur simple demande à " + site.email + ".",
    },
    {
      titre: "Propriété intellectuelle",
      texte: "L'ensemble des contenus du site (textes, images, logos, vidéos, marques SOAM CG et PV, SOAM RH, SOAM SCHOOL, SOAM CLINIC, SOAM PHARMA, SOAM SECURITY) est la propriété exclusive de SOAM GROUP. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
    },
    {
      titre: "Responsabilité",
      texte: "SOAM GROUP s'efforce d'assurer l'exactitude des informations publiées sur ce site mais ne saurait être tenue responsable des omissions ou inexactitudes. Les informations présentées n'ont pas de valeur contractuelle.",
    },
  ];

  return (
    <>
      <main>
        <PageHero
          badge="Informations légales"
          title="Mentions légales"
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((s, i) => (
              <Reveal key={s.titre} delay={i * 0.05}>
                <h2 className="font-headings font-bold text-xl text-foreground mb-3">
                  {s.titre}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{s.texte}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

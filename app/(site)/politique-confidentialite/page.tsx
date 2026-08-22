import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion";
import { getParametres, type SiteInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politique de confidentialité — SOAM GROUP",
};

export default async function ConfidentialitePage() {
  const p = await getParametres();
  const site = p.site as SiteInfo;

  const sections = [
    {
      titre: "Données collectées",
      texte: "Via le formulaire de contact, nous collectons uniquement : votre nom, votre adresse email, votre numéro de téléphone (facultatif) et le contenu de votre message. Aucune donnée de navigation n'est vendue à des tiers.",
    },
    {
      titre: "Finalité du traitement",
      texte: "Ces données servent exclusivement à répondre à vos demandes de contact, devis et informations sur nos services. Elles ne sont utilisées à aucune autre fin commerciale sans votre accord explicite.",
    },
    {
      titre: "Durée de conservation",
      texte: "Les demandes de contact sont conservées au maximum 24 mois, le temps de traiter votre demande et assurer son suivi commercial.",
    },
    {
      titre: "Vos droits",
      texte: `Conformément à la loi burkinabè n°001-2021/AN portant protection des personnes à l'égard du traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, écrivez à ${site.email}.`,
    },
    {
      titre: "Cookies",
      texte: "Ce site n'utilise pas de cookies publicitaires ni de traceurs tiers. Seuls des cookies techniques strictement nécessaires au fonctionnement peuvent être déposés.",
    },
  ];

  return (
    <>
      <main>
        <PageHero
          badge="Confidentialité"
          title="Politique de confidentialité"
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Confidentialité" }]}
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

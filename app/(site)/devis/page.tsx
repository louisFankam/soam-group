import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Icon from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getExpertises, getParametres, type SiteInfo } from "@/lib/data";
import FormulaireDevis from "./FormulaireDevis";

export const metadata: Metadata = {
  title: "Demander un devis — SOAM GROUP",
  description:
    "Décrivez votre projet en 3 étapes : coordonnées, besoin et budget indicatif. L'équipe SOAM GROUP vous répond sous 24h ouvrées avec une proposition adaptée.",
};

const ATOUTS = [
  {
    icone: "clock",
    titre: "Réponse sous 24h ouvrées",
    texte: "Un chef de projet analyse votre demande et vous rappelle rapidement.",
  },
  {
    icone: "user-check",
    titre: "Proposition sur mesure",
    texte: "Chaque devis est construit pour votre contexte, sans solution toute faite.",
  },
  {
    icone: "shield-check",
    titre: "Engagement clair",
    texte: "Périmètre, délais et coûts détaillés — pas de mauvaise surprise.",
  },
];

export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string; erreur?: string }>;
}) {
  const { envoye, erreur } = await searchParams;
  const [expertisesListe, p] = await Promise.all([getExpertises(), getParametres()]);
  const site = p.site as SiteInfo;
  const services = expertisesListe.map((e) => e.title);

  return (
    <>
      <main>
        <PageHero
          badge="Devis gratuit"
          title="Demander un devis"
          subtitle="Décrivez votre projet en 3 étapes, nous vous répondrons sous 24h ouvrées avec une proposition adaptée."
          breadcrumb={[
            { label: "Accueil", href: "/" },
            { label: "Demander un devis" },
          ]}
        />

        <section className="py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[1fr_340px] gap-10 items-start">
            <Reveal>
              <div className="bg-card border border-card-border rounded-3xl p-6 sm:p-10 shadow-sm">
                {envoye ? (
                  <div className="text-center py-10 space-y-4">
                    <span className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-accent-green-light text-accent-green">
                      <Icon i="check" size={32} />
                    </span>
                    <h2 className="font-headings font-bold text-2xl text-foreground">
                      Demande bien reçue !
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Merci pour votre confiance. Un chef de projet SOAM GROUP analyse votre demande
                      et revient vers vous sous 24h ouvrées.
                    </p>
                  </div>
                ) : (
                  <>
                    {erreur && (
                      <p className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                        <Icon i="alert-circle" size={16} />
                        Une erreur est survenue — vérifiez les champs obligatoires puis réessayez.
                      </p>
                    )}
                    <h2 className="font-headings font-bold text-xl text-foreground mb-1">
                      Votre demande de devis
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                      Les champs marqués * sont obligatoires.
                    </p>
                    <FormulaireDevis services={services} />
                  </>
                )}
              </div>
            </Reveal>

            <div className="space-y-4 lg:sticky lg:top-24">
              <Reveal delay={0.08}>
                <div className="rounded-3xl bg-hero-dark p-7 text-white/90 space-y-6">
                  <h3 className="font-headings font-bold text-lg text-white">
                    Pourquoi passer par ce formulaire ?
                  </h3>
                  {ATOUTS.map((a) => (
                    <div key={a.titre} className="flex gap-3.5">
                      <Icon i={a.icone} size={20} className="shrink-0 mt-0.5 text-accent-green" />
                      <div>
                        <div className="font-semibold text-sm text-white">{a.titre}</div>
                        <p className="text-sm text-white/60 mt-0.5">{a.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="rounded-3xl border border-card-border bg-card p-7 space-y-3 text-sm">
                  <h3 className="font-headings font-bold text-base text-foreground mb-1">
                    Vous préférez nous parler ?
                  </h3>
                  <a href={`tel:${site.phone}`} className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Icon i="phone" size={15} className="text-primary" /> {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
                    <Icon i="mail" size={15} className="text-primary" /> {site.email}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

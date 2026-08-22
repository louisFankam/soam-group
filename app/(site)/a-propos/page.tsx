import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Icon from "@/components/ui";
import { chipBg } from "@/components/colors";
import { CountUp, Reveal, Stagger, Item } from "@/components/motion";
import { getEquipe, getParametres, getTitres } from "@/lib/data";
import type { SiteInfo, StatItem, Testimonial, WhyItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "À propos — SOAM GROUP",
  description:
    "SOAM GROUP, intégrateur technologique panafricain basé à Ouagadougou : mission, valeurs et chiffres clés depuis plus de 10 ans.",
};

export default async function AProposPage() {
  const [membres, p, t] = await Promise.all([getEquipe(), getParametres(), getTitres()]);
  const stats = p.stats as StatItem[];
  const whyItems = p.whyItems as WhyItem[];
  const partners = p.partners as string[];
  void (p.site as SiteInfo); // ponytail: coordonnées affichées ici plus tard
  void (p.testimonials as Testimonial[]); // ponytail: témoignages édités ici plus tard
  const equipe = membres.map((m) => ({ role: m.role, seed: m.imageSeed, nom: m.nom, bio: m.bio }));
  return (
    <>
      <main>
        <PageHero
          {...t.pages.apropos}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
        />

        {/* Mission / Vision */}
        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal>
              <div className="bg-card border border-card-border rounded-2xl p-7 h-full">
                <span className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4 ${chipBg("primary")}`}>
                  <Icon i="lightbulb" size={22} />
                </span>
                <h2 className="font-headings font-bold text-xl text-foreground mb-3">
                  Notre mission
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Rendre les technologies de pointe accessibles aux organisations africaines :
                  concevoir, déployer et maintenir des solutions fiables qui transforment
                  réellement leur fonctionnement quotidien.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-card border border-card-border rounded-2xl p-7 h-full">
                <span className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4 ${chipBg("green")}`}>
                  <Icon i="award" size={22} />
                </span>
                <h2 className="font-headings font-bold text-xl text-foreground mb-3">
                  Notre vision
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Devenir l&apos;intégrateur de référence en Afrique de l&apos;Ouest, reconnu pour la
                  qualité de ses ingénieurs, la fiabilité de ses déploiements et son
                  accompagnement de long terme.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Valeurs */}
        <section className="px-6 lg:px-16 py-16 bg-section-alt">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headings font-bold text-3xl text-foreground">Nos valeurs</h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whyItems.map((w) => (
              <Item key={w.title}>
                <div className="flex gap-4 p-5 rounded-xl border border-border bg-card h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${chipBg(w.color)} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon i={w.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-headings font-semibold text-base text-foreground mb-1">
                      {w.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{w.text}</p>
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </section>

        {/* Chiffres */}
        <section className="bg-primary px-6 lg:px-16 py-12">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((s) => (
              <Item key={s.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Icon i={s.icon} size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-headings font-bold text-2xl">
                    <CountUp value={s.n} />
                  </div>
                  <div className="text-white/70 text-sm">{s.label}</div>
                </div>
              </Item>
            ))}
          </Stagger>
        </section>

        {/* Équipe */}
        <section className="px-6 lg:px-16 py-16 bg-background">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headings font-bold text-3xl text-foreground mb-3">
              Notre direction
            </h2>
            {/* ponytail: photos placeholder — remplacer par les vraies photos via l'admin. */}
          </Reveal>
          <Stagger className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {equipe.map((m) => (
              <Item key={m.role}>
                <div className="bg-card border border-card-border rounded-xl overflow-hidden w-52 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/400/400`}
                    alt={m.role}
                    loading="lazy"
                    className="w-full aspect-square object-cover grayscale-[30%]"
                  />
                  <p className="font-headings font-medium text-sm text-foreground py-3">
                    {m.role}
                  </p>
                </div>
              </Item>
            ))}
          </Stagger>
          <Reveal className="mt-14">
            <p className="text-center text-muted-foreground text-sm">
              Ils nous font confiance : {partners.slice(0, 5).join(", ")}…
            </p>
          </Reveal>
        </section>
      </main>
    </>
  );
}

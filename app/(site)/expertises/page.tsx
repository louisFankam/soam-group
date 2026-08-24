import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal, Stagger, Item } from "@/components/motion";
import { getExpertises, getTitres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos expertises — SOAM GROUP",
  description:
    "10 domaines d'expertise : infrastructure, cybersécurité, développement logiciel, réseaux, sécurité électronique, énergie solaire, formation et design.",
};

export default async function ExpertisesPage() {
  const [expertises, t] = await Promise.all([getExpertises(), getTitres()]);
  return (
    <>
      <main>
        <PageHero
          {...t.pages.expertises}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Expertises" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-background">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {expertises.map((e) => (
              <Item key={e.slug}>
                <Link
                  href={`/expertises/${e.slug}`}
                  className="group block bg-card border border-card-border rounded-xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
                >
                  <Img
                    seed={e.imageSeed}
                  imageUrl={e.imageUrl}
                    w={600}
                    h={340}
                    alt={e.title}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <Icon i={e.icon} size={26} className={`block mb-4 ${chipBg(e.color)}`} />
                    <h2 className="font-headings font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {e.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {e.description}
                    </p>
                  </div>
                </Link>
              </Item>
            ))}
          </Stagger>
        </section>
        <Reveal className="pb-16 text-center">
          <p className="text-muted-foreground">
            Un besoin qui ne figure pas dans la liste ?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Parlons-en
            </Link>
          </p>
        </Reveal>
      </main>
    </>
  );
}

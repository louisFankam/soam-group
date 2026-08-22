import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FaqAccordion from "@/components/FaqAccordion";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";
import {
  SectionHeader,
  ExpertiseCard,
  SoftwareCard,
  TestimonialCard,
  NewsCard,
} from "@/components/cards";
import PortfolioGrid from "@/components/PortfolioGrid";
import {
  CountUp,
  Item,
  Reveal,
  Stagger,
} from "@/components/motion";
import {
  getArticles,
  getExpertises,
  getLogiciels,
  getParametres,
  getRealisations,
  getSolutions,
  getTitres,
  type FaqItem,
  type FeaturedSolution,
  type HeroData,
  type SiteInfo,
  type StatItem,
  type Testimonial,
  type WhyItem,
} from "@/lib/data";

export default async function Home() {
  const [expertises, logiciels, solutions, portfolio, news, p] = await Promise.all([
    getExpertises(),
    getLogiciels(),
    getSolutions(),
    getRealisations(),
    getArticles(),
    getParametres(),
  ]);
  const site = p.site as SiteInfo;
  const stats = p.stats as StatItem[];
  const whyItems = p.whyItems as WhyItem[];
  const portfolioFilters = p.portfolioFilters as string[];
  const partners = p.partners as string[];
  const testimonials = p.testimonials as Testimonial[];
  const featuredSolution = p.featuredSolution as FeaturedSolution;
  const contactSubjects = p.contactSubjects as string[];
  const hero = p.hero as HeroData;
  const faqItems = p.faqItems as FaqItem[];
  const t = await getTitres();
  return (
    <>
      <main>
        <HeroSection hero={hero} />

        {/* STATS */}
        <div className="bg-primary px-6 lg:px-16 py-10">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Item
                key={s.label}
                className={`flex items-center gap-3 lg:gap-5 ${i < 3 ? "lg:border-r lg:border-white/20 lg:pr-5" : ""}`}
              >
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Icon i={s.icon} size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-headings font-bold text-xl sm:text-2xl lg:text-3xl leading-none">
                    <CountUp value={s.n} />
                  </div>
                  <div className="text-white/70 font-body text-xs sm:text-sm mt-1">
                    {s.label}
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>

        {/* EXPERTISES */}
        <section id="expertises" className="px-6 lg:px-16 py-20 bg-background">
          <Reveal>
            <SectionHeader {...t.accueil.expertises} />
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {expertises.map((e) => (
              <Item key={e.title}>
                <ExpertiseCard {...e} />
              </Item>
            ))}
          </Stagger>
        </section>

        {/* SOLUTIONS */}
        <section id="solutions" className="px-6 lg:px-16 py-20 bg-section-alt">
          <Reveal>
            <SectionHeader {...t.accueil.solutions} />
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Reveal delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden min-h-[380px] group">
                <Img
                  seed={featuredSolution.imageSeed}
                  imageUrl={featuredSolution.imageUrl}
                  w={600}
                  h={800}
                  alt={featuredSolution.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,79,189,0.9) 0%, rgba(26,79,189,0.5) 50%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-xl mb-3 inline-block">
                    {featuredSolution.badge}
                  </span>
                  <h3 className="text-white font-headings font-bold text-2xl mb-2">
                    {featuredSolution.title}
                  </h3>
                  <p className="text-white/75 text-sm mb-4">
                    {featuredSolution.description}
                  </p>
                <Link
                  href={`/solutions/${featuredSolution.slug}`}
                  className="inline-flex items-center gap-2 text-white font-medium text-sm bg-white/20 hover:bg-white/30 active:scale-[0.98] transition-all px-4 py-2 rounded-xl"
                >
                  Découvrir <Icon i="arrow-right" size={14} />
                </Link>
                </div>
              </div>
            </Reveal>
            <Stagger className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 content-start">
              {solutions.map((s) => (
                <Item key={s.title}>
                  <div className="bg-card rounded-xl border border-card-border p-6 flex flex-col justify-between h-full shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group">
                    <div>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${chipBg(s.color)} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon i={s.icon} size={20} />
                      </div>
                      <h3 className="font-headings font-semibold text-base text-foreground mb-2">
                        {s.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className={`mt-4 text-sm font-medium flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1 ${
                      s.color === "primary"
                        ? "text-primary"
                        : s.color === "green"
                          ? "text-accent-green"
                          : "text-accent-orange"
                    }`}
                  >
                    En savoir plus <Icon i="arrow-right" size={14} />
                  </Link>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </section>

        {/* WHY SOAM */}
        <section className="px-6 lg:px-16 py-20 bg-background">
          <Reveal>
            <SectionHeader {...t.accueil.why} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map((w) => (
              <Item key={w.title}>
                <div className="flex gap-4 p-5 rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg h-full group">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${chipBg(w.color)} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon i={w.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-headings font-semibold text-base text-foreground mb-1">
                      {w.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {w.text}
                    </p>
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </section>

        {/* RÉALISATIONS */}
        <section id="realisations" className="px-6 lg:px-16 py-20 bg-section-alt">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <Reveal>
              <SectionHeader {...t.accueil.realisations} align="left" />
            </Reveal>
          </div>
          <PortfolioGrid projets={portfolio} filters={portfolioFilters} avecSpan />
          <Reveal className="text-center mt-10">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-secondary active:scale-[0.98] transition-all font-body font-medium px-8 py-3 rounded-xl"
            >
              Voir toutes nos réalisations <Icon i="arrow-right" size={18} />
            </Link>
          </Reveal>
        </section>

        {/* LOGICIELS */}
        <section id="logiciels" className="px-6 lg:px-16 py-20 bg-background">
          <Reveal>
            <SectionHeader {...t.accueil.logiciels} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logiciels.map((s) => (
              <Item key={s.name}>
                <SoftwareCard {...s} />
              </Item>
            ))}
          </Stagger>
        </section>

        {/* PARTENAIRES — marquee défilant, pause au survol */}
        <section className="py-16 bg-section-alt overflow-hidden">
          <Reveal>
            <SectionHeader {...t.accueil.partenaires} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="marquee-hover relative">
              <div className="flex w-max animate-marquee gap-6 pr-6">
                {[...partners, ...partners].map((p, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl px-8 py-4 flex items-center justify-center min-w-[140px] shrink-0 hover:border-primary/40 transition-colors"
                  >
                    <span className="font-headings font-bold text-muted-foreground text-lg whitespace-nowrap">
                      {p}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-section-alt to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-section-alt to-transparent" />
            </div>
          </Reveal>
          <p className="text-muted-foreground text-sm text-center mt-8">
            et bien d&apos;autres...
          </p>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="px-6 lg:px-16 py-20 bg-background">
          <Reveal>
            <SectionHeader {...t.accueil.temoignages} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Item key={t.name}>
                <TestimonialCard {...t} />
              </Item>
            ))}
          </Stagger>
        </section>

        {/* ACTUALITÉS */}
        <section id="actualites" className="px-6 lg:px-16 py-20 bg-section-alt">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <Reveal>
              <SectionHeader {...t.accueil.actualites} align="left" />
            </Reveal>
            <Reveal delay={0.15} className="lg:mb-12">
              <Link
                href="/actualites"
                className="group text-primary text-sm font-medium flex items-center gap-1"
              >
                Voir toutes les actualités{" "}
                <Icon
                  i="arrow-right"
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((n) => (
              <Item key={n.slug}>
                <Link href={`/actualites/${n.slug}`} className="block h-full">
                  <NewsCard {...n} />
                </Link>
              </Item>
            ))}
          </Stagger>
        </section>

        {/* FAQ */}
        <section className="px-6 lg:px-16 py-20 bg-background">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionHeader {...t.accueil.faq} />
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-16 pt-4 pb-0 bg-background">
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden min-h-[280px] cta-gradient">
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 px-6">
                <h2 className="text-white font-headings font-bold text-3xl lg:text-[38px] mb-4">
                  {t.accueil.cta.title}
                </h2>
                <p className="text-white/75 font-body text-lg mb-8 max-w-xl">
                  {t.accueil.cta.texte}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="bg-white text-primary hover:bg-secondary hover:-translate-y-0.5 active:scale-[0.97] transition-all font-body font-semibold text-base px-8 py-3.5 rounded-xl"
                  >
                    Demander un devis
                  </Link>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:-translate-y-0.5 active:scale-[0.97] transition-all font-body font-medium text-base px-8 py-3.5 rounded-xl"
                  >
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-6 lg:px-16 py-20 bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Reveal>
              <form action="/api/contact" method="POST" className="space-y-4">
                <SectionHeader
                  badge="Contact"
                  title="Parlons de votre projet"
                  align="left"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Nom complet
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      required
                      placeholder="Votre nom"
                      className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tel" className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Téléphone
                    </label>
                    <input
                      id="tel"
                      name="telephone"
                      type="tel"
                      placeholder="+226 XX XX XX XX"
                      className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="sujet" className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Sujet
                    </label>
                    <select
                      id="sujet"
                      name="sujet"
                      defaultValue=""
                      className="w-full bg-input border border-border focus:border-primary outline-none rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors"
                    >
                      <option value="" disabled>
                        Sélectionner un sujet
                      </option>
                      {contactSubjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-body font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Décrivez votre projet ou votre besoin..."
                    className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-4 text-sm placeholder:text-muted-foreground resize-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-deep active:scale-[0.99] transition-all text-primary-foreground font-body font-semibold text-base py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  Envoyer le message <Icon i="send" size={18} />
                </button>
              </form>
            </Reveal>
            <Reveal delay={0.15}>
              <SectionHeader
                badge="Informations"
                title="Retrouvez-nous"
                align="left"
              />
              <Stagger className="space-y-4 mb-8">
                {[
                  { icon: "map-pin", label: "Adresse", value: site.address, color: "primary" as const },
                  { icon: "phone", label: "Téléphone", value: site.phone, color: "green" as const },
                  { icon: "mail", label: "Email", value: site.email, color: "primary" as const },
                  { icon: "clock", label: "Horaires", value: site.hours, color: "orange" as const },
                  { icon: "message-circle", label: "WhatsApp", value: site.whatsapp, color: "green" as const },
                ].map((c) => (
                  <Item key={c.label}>
                    <div className="flex gap-4 items-start p-4 rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${chipBg(c.color)} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon i={c.icon} size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-body font-medium text-muted-foreground mb-0.5">
                          {c.label}
                        </div>
                        <div className="text-sm font-body text-foreground">{c.value}</div>
                      </div>
                    </div>
                  </Item>
                ))}
              </Stagger>
              <div className="rounded-xl overflow-hidden border border-border h-40">
                <iframe
                  title="Localisation SOAM GROUP — Ouagadougou"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-1.55%2C12.30%2C-1.45%2C12.38&layer=mapnik&marker=12.34%2C-1.50"
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}

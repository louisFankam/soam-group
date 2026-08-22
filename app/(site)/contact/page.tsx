import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Icon from "@/components/ui";
import { chipBg } from "@/components/colors";
import { Reveal } from "@/components/motion";
import { getParametres, getTitres, type SiteInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — SOAM GROUP",
  description:
    "Contactez SOAM GROUP à Ouagadougou : devis gratuit, téléphone, email et WhatsApp. Réponse sous 24h ouvrées.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sujet?: string; envoye?: string }>;
}) {
  const { sujet, envoye } = await searchParams;
  const [p, t] = await Promise.all([getParametres(), getTitres()]);
  const site = p.site as SiteInfo;
  const contactSubjects = p.contactSubjects as string[];
  const sujetInitial =
    sujet && contactSubjects.includes(sujet) ? sujet : "";

  return (
    <>
      <main>
        <PageHero
          {...t.pages.contact}
          breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        />
        <section className="px-6 lg:px-16 py-16 bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Reveal>
              {envoye && (
                <div className="mb-6 rounded-xl border border-accent-green/30 bg-accent-green/10 px-4 py-3.5 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-accent-green/15 text-accent-green flex items-center justify-center shrink-0 mt-0.5">
                    <Icon i="check" size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Message envoyé !</p>
                    <p className="text-sm text-muted-foreground">
                      Merci, notre équipe vous répond sous 24h ouvrées.
                    </p>
                  </div>
                </div>
              )}
              <form action="/api/contact" method="POST" className="space-y-4">
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
                      defaultValue={sujetInitial}
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
                    rows={5}
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
              <div className="space-y-4 mb-8">
                {[
                  { icon: "map-pin", label: "Adresse", value: site.address, color: "primary" as const },
                  { icon: "phone", label: "Téléphone", value: site.phone, color: "green" as const },
                  { icon: "mail", label: "Email", value: site.email, color: "primary" as const },
                  { icon: "clock", label: "Horaires", value: site.hours, color: "orange" as const },
                  { icon: "message-circle", label: "WhatsApp", value: site.whatsapp, color: "green" as const },
                ].map((c) => (
                  <div key={c.label} className="flex gap-4 items-start p-4 rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${chipBg(c.color)} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon i={c.icon} size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-body font-medium text-muted-foreground mb-0.5">{c.label}</div>
                      <div className="text-sm font-body text-foreground">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Carte OpenStreetMap réelle */}
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Localisation SOAM GROUP — Ouagadougou"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-1.55%2C12.30%2C-1.45%2C12.38&layer=mapnik&marker=12.34%2C-1.50"
                  loading="lazy"
                  className="w-full h-64 border-0"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}

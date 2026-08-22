import Icon from "@/components/ui";
import Link from "next/link";
import { Reveal } from "@/components/motion";

// Bannière d'en-tête des pages intérieures.
export default function PageHero({
  badge,
  title,
  subtitle,
  breadcrumb,
}: {
  badge: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative bg-hero-dark overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(6,13,31,0.95) 0%, rgba(15,52,144,0.55) 60%, rgba(39,174,96,0.25) 100%)",
        }}
      />
      <div className="relative z-10 px-6 lg:px-16 pt-14 pb-12 lg:pt-16 lg:pb-14 max-w-5xl mx-auto">
        <Reveal y={16}>
          {breadcrumb && (
          <nav aria-label="Fil d'ariane" className="text-sm text-white/50 mb-4">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2">/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-white transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <span className="inline-block bg-white/10 border border-white/20 text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-xl mb-5">
          {badge}
        </span>
        <h1 className="font-headings font-bold text-3xl lg:text-4xl leading-tight text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 font-body text-lg leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
        </Reveal>
      </div>
    </section>
  );
}

// Bloc CTA de fin de page détail.
export function DetailCta({ label = "Discutons de votre projet" }: { label?: string }) {
  return (
    <section className="px-6 lg:px-16 py-16 bg-section-alt">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-headings font-bold text-2xl lg:text-3xl text-foreground mb-3">
          Un projet dans ce domaine ?
        </h2>
        <p className="text-muted-foreground mb-7">
          Nos experts vous conseillent gratuitement et vous proposent une solution adaptée à vos besoins et votre budget.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-deep active:scale-[0.98] transition-all text-primary-foreground font-body font-semibold text-base px-8 py-3.5 rounded-xl"
        >
          {label} <Icon i="arrow-right" size={18} />
        </Link>
      </div>
    </section>
  );
}

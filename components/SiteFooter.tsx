import Image from "next/image";
import Icon from "@/components/ui";
import type { Expertise } from "@/lib/data";

export default function SiteFooter({ navLinks, site, expertises }: { navLinks: { label: string; href: string }[]; site: Record<string, string>; expertises: Expertise[] }) {
  return (
    <footer className="bg-hero-dark text-white">
      <div className="px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.jpeg"
              alt={site.name}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
            <span className="font-headings font-bold text-lg">
              SOAM <span className="text-accent-green">GROUP</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Intégrateur technologique panafricain. Nous concevons, déployons et
            maintenons des solutions numériques complètes pour les entreprises
            et institutions.
          </p>
        </div>
        <div>
          <h3 className="font-headings font-semibold text-base mb-4">
            Navigation
          </h3>
          <ul className="space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-headings font-semibold text-base mb-4">
            Expertises
          </h3>
          <ul className="space-y-2.5">
            {expertises.slice(0, 6).map((e) => (
              <li key={e.title}>
                <a
                  href="#expertises"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {e.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-headings font-semibold text-base mb-4">
            Contact
          </h3>
          <ul className="space-y-3.5">
            <li className="flex gap-3 text-sm text-white/60">
              <Icon i="map-pin" size={18} className="text-accent-green shrink-0" />
              {site.address}
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <Icon i="phone" size={18} className="text-accent-green shrink-0" />
              {site.phone}
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <Icon i="mail" size={18} className="text-accent-green shrink-0" />
              {site.email}
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <Icon i="clock" size={18} className="text-accent-green shrink-0" />
              {site.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} SOAM GROUP. Tous droits réservés.
        </p>
        <p className="text-sm text-white/50">{site.tagline}</p>
      </div>
    </footer>
  );
}

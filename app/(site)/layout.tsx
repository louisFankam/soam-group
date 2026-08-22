import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SuiviVues from "@/components/SuiviVues";
import { MotionConfigUser, ScrollProgress } from "@/components/motion";
import { getExpertises, getParametres } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [parametres, expertises] = await Promise.all([
    getParametres(),
    getExpertises(),
  ]);
  const site = parametres.site as Record<string, string>;

  // Données structurées pour Google (connaît l'entreprise, SEO local).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: "https://www.soamgroup.net",
    logo: "https://www.soamgroup.net/logo.jpeg",
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Ouagadougou",
      addressCountry: "BF",
    },
    geo: { "@type": "GeoCoordinates", latitude: 12.34, longitude: -1.5 },
    openingHours: site.hours,
  };

  return (
    <MotionConfigUser>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SuiviVues />
      <ScrollProgress />
      <SiteHeader navLinks={parametres.navLinks as { label: string; href: string }[]} site={parametres.site as Record<string, string>} />
      {children}
      <SiteFooter navLinks={parametres.navLinks as { label: string; href: string }[]} site={parametres.site as Record<string, string>} expertises={expertises} />
    </MotionConfigUser>
  );
}

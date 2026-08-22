import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soamgroup.net"),
  title: "SOAM GROUP — Intégrateur technologique",
  description:
    "Informatique, cybersécurité, logiciels métiers, réseaux, énergie solaire et formation numérique. SOAM GROUP, votre partenaire technologique à Ouagadougou.",
  openGraph: {
    type: "website",
    siteName: "SOAM GROUP",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : neutralise le bruit des extensions navigateur (Grammarly etc.) à l'hydratation.
    <html lang="fr" suppressHydrationWarning className={`${dmSans.variable} antialiased`}>
      <body suppressHydrationWarning className="bg-background font-body text-foreground">{children}</body>
    </html>
  );
}

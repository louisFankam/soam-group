"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "@/components/ui";
import { deconnexion } from "@/app/admin/actions-auth";

const liens = [
  { href: "/admin", label: "Tableau de bord", icone: "layout-dashboard" },
  { href: "/admin/expertises", label: "Expertises", icone: "layers" },
  { href: "/admin/logiciels", label: "Logiciels", icone: "code-2" },
  { href: "/admin/solutions", label: "Solutions", icone: "lightbulb" },
  { href: "/admin/realisations", label: "Réalisations", icone: "folder-check" },
  { href: "/admin/actualites", label: "Actualités", icone: "award" },
  { href: "/admin/equipe", label: "Équipe", icone: "users" },
];

export default function AdminSidebar({
  nonLus,
  devisNouveaux,
}: {
  nonLus: number;
  devisNouveaux: number;
}) {
  const pathname = usePathname();

  const lien = (l: { href: string; label: string; icone: string }) => {
    const actif = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
    return (
      <Link
        key={l.href}
        href={l.href}
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          actif
            ? "bg-primary text-white"
            : "text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        <Icon i={l.icone} size={17} />
        <span className="flex-1">{l.label}</span>
        {l.label === "Messages" && nonLus > 0 && (
          <span className="bg-accent-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {nonLus}
          </span>
        )}
        {l.label === "Devis" && devisNouveaux > 0 && (
          <span className="bg-accent-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {devisNouveaux}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-hero-dark min-h-screen p-4 gap-1 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <Image src="/logo.jpeg" alt="" width={40} height={40} className="rounded-lg" />
          <div>
            <div className="font-headings font-bold text-sm text-white leading-none">
              SOAM <span className="text-accent-green">GROUP</span>
            </div>
            <div className="text-[11px] text-white/50 mt-1">Administration</div>
          </div>
        </div>
        {liens.map(lien)}
        {lien({ href: "/admin/devis", label: "Devis", icone: "folder-check" })}
        {lien({ href: "/admin/messages", label: "Messages", icone: "mail" })}
        {lien({ href: "/admin/statistiques", label: "Statistiques", icone: "chart-bar" })}
        {lien({ href: "/admin/parametres", label: "Paramètres", icone: "server" })}

        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon i="arrow-right" size={17} /> Voir le site
          </a>
          <form action={deconnexion}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <Icon i="refresh-cw" size={17} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile : barre horizontale scrollable */}
      <nav className="lg:hidden sticky top-0 z-40 bg-hero-dark overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
          {[...liens, { href: "/admin/devis", label: "Devis", icone: "folder-check" }, { href: "/admin/messages", label: "Messages", icone: "mail" }, { href: "/admin/statistiques", label: "Statistiques", icone: "chart-bar" }, { href: "/admin/parametres", label: "Paramètres", icone: "server" }].map(
            (l) => {
              const actif = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    actif ? "bg-primary text-white" : "text-white/70"
                  }`}
                >
                  {l.label}
                </Link>
              );
            },
          )}
          <form action={deconnexion}>
            <button type="submit" className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/70">
              Quitter
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}

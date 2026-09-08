"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "@/components/ui";
import { deconnexion } from "@/app/admin/actions-auth";

type Lien = { href: string; label: string; icone: string };

const sections: { titre: string; liens: Lien[] }[] = [
  {
    titre: "Contenu",
    liens: [
      { href: "/superadmin/pages", label: "Pages", icone: "file-text" },
      { href: "/superadmin/menu", label: "Menu", icone: "menu" },
    ],
  },
  {
    titre: "Blog",
    liens: [
      { href: "/superadmin/blog/articles", label: "Articles", icone: "pen-tool" },
      { href: "/superadmin/blog/categories", label: "Catégories", icone: "tag" },
    ],
  },
  {
    titre: "Modules",
    liens: [
      { href: "/superadmin/equipe", label: "Équipe", icone: "users" },
      { href: "/superadmin/services", label: "Services", icone: "layers" },
      { href: "/superadmin/projets", label: "Projets", icone: "folder-check" },
      { href: "/superadmin/temoignages", label: "Témoignages", icone: "message-circle" },
      { href: "/superadmin/faq", label: "FAQ", icone: "help-circle" },
      { href: "/superadmin/documents", label: "Documents", icone: "file" },
      { href: "/superadmin/emplois", label: "Emplois", icone: "briefcase" },
      { href: "/superadmin/clients-partenaires", label: "Clients & Partenaires", icone: "building" },
    ],
  },
  {
    titre: "Formulaires",
    liens: [
      { href: "/superadmin/contacts", label: "Messages", icone: "mail" },
      { href: "/superadmin/formulaires", label: "Soumissions", icone: "inbox" },
    ],
  },
  {
    titre: "Boutique",
    liens: [
      { href: "/superadmin/produits", label: "Produits", icone: "shopping-cart" },
      { href: "/superadmin/commandes", label: "Commandes", icone: "receipt" },
    ],
  },
  {
    titre: "Médias",
    liens: [
      { href: "/superadmin/medias", label: "Bibliothèque", icone: "image" },
    ],
  },
  {
    titre: "Administration",
    liens: [
      { href: "/superadmin/utilisateurs", label: "Utilisateurs", icone: "user-check" },
    ],
  },
  {
    titre: "Configuration",
    liens: [
      { href: "/superadmin/parametres", label: "Paramètres", icone: "server" },
      { href: "/superadmin/pied-de-page", label: "Pied de page", icone: "layout" },
    ],
  },
  {
    titre: "Système",
    liens: [
      { href: "/superadmin/backups", label: "Sauvegardes", icone: "hard-drive" },
      { href: "/superadmin/journal", label: "Journal d'activité", icone: "clock" },
      { href: "/superadmin/corbeille", label: "Corbeille", icone: "trash-2" },
    ],
  },
];

function LiensSection({ liens }: { liens: Lien[] }) {
  const pathname = usePathname();
  return (
    <>
      {liens.map((l) => {
        const actif = l.href === "/superadmin"
          ? pathname === "/superadmin"
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              actif
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon i={l.icone} size={16} />
            <span className="flex-1">{l.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export default function SuperAdminSidebar() {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-hero-dark min-h-screen p-4 gap-1 sticky top-0 h-screen overflow-y-auto">
        <Link href="/superadmin" className="flex items-center gap-3 px-2 py-4 mb-4">
          <Image src="/logo.jpeg" alt="" width={40} height={40} className="rounded-lg" />
          <div>
            <div className="font-headings font-bold text-sm text-white leading-none">
              SOAM <span className="text-accent-green">GROUP</span>
            </div>
            <div className="text-[11px] text-accent-green/80 mt-1 font-medium">SuperAdmin</div>
          </div>
        </Link>

        {sections.map((s) => (
          <div key={s.titre} className="mb-3">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
              {s.titre}
            </div>
            <LiensSection liens={s.liens} />
          </div>
        ))}

        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon i="arrow-right" size={16} /> Voir le site
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon i="layout-dashboard" size={16} /> Admin simple
          </Link>
          <form action={deconnexion}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <Icon i="refresh-cw" size={16} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile */}
      <nav className="lg:hidden sticky top-0 z-40 bg-hero-dark overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
          <Link
            href="/superadmin"
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-accent-green"
          >
            SA
          </Link>
          {sections.flatMap((s) => s.liens).slice(0, 6).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/70"
            >
              {l.label}
            </Link>
          ))}
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

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PortfolioCard from "@/components/PortfolioCard";


type Projet = {
  slug: string;
  category: string;
  title: string;
  description: string;
  imageSeed: string;
  imageUrl?: string | null;
  color: string;
  featured: boolean;
  span?: number;
};

export default function PortfolioGrid({
  projets,
  filters,
  avecSpan = false,
}: {
  projets: Projet[];
  filters: string[];
  /** Grille large de l'accueil : 3 colonnes, projets « span 2 » élargis. */
  avecSpan?: boolean;
}) {
  const [active, setActive] = useState("Tous");
  const visibles =
    active === "Tous" ? projets : projets.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-body font-medium transition-all duration-200 active:scale-[0.96] ${
              active === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <motion.div
        layout
        className={`grid gap-5 ${avecSpan ? "grid-cols-1 md:grid-cols-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
      >
        {visibles.map((p) => (
          <motion.a
            key={p.slug}
            href={`/realisations/${p.slug}`}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className={`block h-full group/outer${avecSpan && p.span === 2 ? " md:col-span-2" : ""}`}
          >
            <PortfolioCard {...p} />
          </motion.a>
        ))}
      </motion.div>
      {visibles.length === 0 && (
        <p className="text-muted-foreground text-center py-10">
          Aucun projet dans cette catégorie pour le moment.
        </p>
      )}
    </>
  );
}

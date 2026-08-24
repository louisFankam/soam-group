"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Icon from "@/components/ui";
import { TestimonialCard } from "@/components/cards";

type Temoignage = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

// Carrousel : 3 cartes visibles desktop / 1 mobile, autoplay 5 s
// (pause au survol + prefers-reduced-motion), flèches, points, glisser.
export default function CarrouselTemoignages({
  temoignages,
}: {
  temoignages: Temoignage[];
}) {
  const [parVue, setParVue] = useState(3);
  const [page, setPage] = useState(0);
  const [survol, setSurvol] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mouvementReduit = useReducedMotion();

  useEffect(() => {
    const maj = () => setParVue(window.innerWidth >= 768 ? 3 : 1);
    maj();
    window.addEventListener("resize", maj);
    return () => window.removeEventListener("resize", maj);
  }, []);

  const nbPages = Math.ceil(temoignages.length / parVue);
  const va = (sens: number) => setPage((p) => (p + sens + nbPages) % nbPages);

  useEffect(() => {
    if (mouvementReduit || survol || nbPages <= 1) return;
    const t = setInterval(() => va(1), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouvementReduit, survol, nbPages]);

  // garde-fou si le redimensionnement change le nombre de pages
  useEffect(() => {
    if (page >= nbPages) setPage(0);
  }, [nbPages, page]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
    >
      <div ref={ref} className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${page * 100}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          drag={nbPages > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) va(1);
            else if (info.offset.x > 50) va(-1);
          }}
        >
          {Array.from({ length: nbPages }, (_, i) => (
            <div key={i} className="flex w-full shrink-0 gap-6 px-1">
              {temoignages
                .slice(i * parVue, i * parVue + parVue)
                .map((t) => (
                  <div key={t.name} className="flex-1 min-w-0 [&>div]:h-full">
                    <TestimonialCard {...t} />
                  </div>
                ))}
            </div>
          ))}
        </motion.div>
      </div>

      {nbPages > 1 && (
        <>
          {/* flèches */}
          <button
            aria-label="Témoignage précédent"
            onClick={() => va(-1)}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-card border border-card-border shadow-lg hover:border-primary/40 hover:text-primary transition-all"
          >
            <Icon i="chevron-left" size={20} />
          </button>
          <button
            aria-label="Témoignage suivant"
            onClick={() => va(1)}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-card border border-card-border shadow-lg hover:border-primary/40 hover:text-primary transition-all"
          >
            <Icon i="chevron-right" size={20} />
          </button>

          {/* points */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: nbPages }, (_, i) => (
              <button
                key={i}
                aria-label={`Aller aux témoignages ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === page ? "w-7 bg-primary" : "w-2.5 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

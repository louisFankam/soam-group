"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Icon, { Img } from "@/components/ui";

type Hero = {
  badge: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  imageSeed: string;
  imageUrl?: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function HeroSection({ hero }: { hero: Hero }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  return (
    <section className="relative bg-hero-dark overflow-hidden">
      <div className="absolute inset-0 opacity-45">
        {reducedMotion ? (
          <Img
            seed={hero.imageSeed}
            imageUrl={hero.imageUrl}
            w={1600}
            h={900}
            alt=""
            className="hero-zoom w-full h-full object-cover"
          />
        ) : (
          <video
            className="hero-zoom w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={hero.imageUrl || `https://picsum.photos/seed/${hero.imageSeed}/1600/900`}
          >
            <source src={hero.videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(6,13,31,0.80) 0%, rgba(6,13,31,0.50) 55%, rgba(26,79,189,0.15) 100%)",
        }}
      />
      <div className="relative z-10 px-6 lg:px-16 pt-16 pb-20 lg:pt-20 lg:pb-24 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="font-headings font-bold text-3xl min-[400px]:text-4xl lg:text-5xl leading-tight text-white mb-6"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          className="text-white/75 font-body text-lg leading-relaxed mb-9 max-w-2xl"
        >
          {hero.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="flex flex-wrap items-center gap-4"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-deep active:scale-[0.98] transition-all text-primary-foreground font-body font-semibold text-base px-8 py-3.5 rounded-xl"
          >
            Demander un devis <Icon i="arrow-right" size={18} />
          </a>
          <Link
            href="/expertises"
            className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 active:scale-[0.98] transition-all text-white font-body font-medium text-base px-8 py-3.5 rounded-xl"
          >
            Découvrir nos expertises
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/ui";

export default function SiteHeader({
  navLinks,
  site,
}: {
  navLinks: { label: string; href: string }[];
  site: Record<string, string>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-primary/5 border-b border-border" : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-16 py-3">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt={site.name}
            width={44}
            height={44}
            className="rounded-lg object-cover"
          />
          <div>
            <div className="font-headings font-bold text-lg leading-none text-primary">
              SOAM <span className="text-accent-green">GROUP</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Technologies & Solutions
            </div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm font-body font-medium text-foreground hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-primary after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="/contact"
          className="hidden lg:inline-flex bg-primary hover:bg-primary-deep active:scale-[0.98] transition-all text-primary-foreground font-body font-semibold text-sm px-5 py-2.5 rounded-xl"
        >
          Demander un devis
        </a>
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="lg:hidden text-foreground"
        >
          <Icon i="menu" size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-border bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-body font-medium text-foreground hover:text-primary hover:bg-secondary/60 rounded-lg px-3 py-2.5 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-3 rounded-xl text-center"
              >
                Demander un devis
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/ui";

export default function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
            open === i ? "border-primary" : "border-border"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
              open === i ? "bg-secondary" : "bg-card"
            }`}
          >
            <h3
              className={`font-headings font-semibold text-sm transition-colors ${
                open === i ? "text-primary" : "text-foreground"
              }`}
            >
              {item.q}
            </h3>
            <Icon
              i="chevron-down"
              size={18}
              className={`text-muted-foreground shrink-0 transition-transform duration-300 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 bg-card border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

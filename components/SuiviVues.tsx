"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Compteur de vues : un POST par vue réelle (montage ou navigation).
// Ignoré côté serveur si le visiteur est l'admin (cookie de session).
export default function SuiviVues() {
  const chemin = usePathname();

  useEffect(() => {
    fetch("/api/visite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chemin }),
      keepalive: true,
    }).catch(() => {});
  }, [chemin]);

  return null;
}

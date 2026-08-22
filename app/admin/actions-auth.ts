"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tentativesConnexion, utilisateurs } from "@/lib/schema";
import { creerSession, detruireSession, verifierMotDePasse } from "@/lib/auth";

// ponytail : compteur en DB (pas en mémoire) pour survivre aux redémarrages
// et multi-instances ; une ligne par email testé, volume négligeable.
const MAX_ECHECS = 5;
const BLOCAGE_S = 15 * 60;

export async function connexion(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");
  if (!email || !motDePasse) redirect(`/admin/login?erreur=1&email=${encodeURIComponent(email)}`);

  const [tentative] = await db
    .select()
    .from(tentativesConnexion)
    .where(eq(tentativesConnexion.email, email));
  const maintenant = Math.floor(Date.now() / 1000);
  if (tentative?.bloqueJusqua && tentative.bloqueJusqua > maintenant) {
    redirect(`/admin/login?erreur=2&email=${encodeURIComponent(email)}`);
  }

  const admin = await db
    .select()
    .from(utilisateurs)
    .where(eq(utilisateurs.email, email))
    .get();
  if (!admin || !verifierMotDePasse(motDePasse, admin.motDePasseHash)) {
    // après un déblocage expiré, on repart de zéro
    const echecs = (tentative?.bloqueJusqua ? 0 : (tentative?.echecs ?? 0)) + 1;
    const bloqueJusqua = echecs >= MAX_ECHECS ? maintenant + BLOCAGE_S : null;
    await db
      .insert(tentativesConnexion)
      .values({ email, echecs, bloqueJusqua })
      .onConflictDoUpdate({
        target: tentativesConnexion.email,
        set: { echecs, bloqueJusqua },
      });
    redirect(`/admin/login?erreur=1&email=${encodeURIComponent(email)}`);
  }

  await db.delete(tentativesConnexion).where(eq(tentativesConnexion.email, email));
  await creerSession(admin.email);
  redirect("/admin");
}

export async function deconnexion() {
  await detruireSession();
  redirect("/admin/login");
}

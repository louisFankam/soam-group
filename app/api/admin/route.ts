import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { devis, messages, parametres } from "@/lib/schema";
import { TAGS } from "@/lib/data";
import { ENTITES } from "@/lib/admin-entites";
import { sessionActive } from "@/lib/auth";

// ponytail: mutations admin via routes HTTP classiques (debuggables, progressive
// enhancement) plutôt que server actions. updateTag est réservé aux server
// actions => revalidateTag(tag, "max") ici.

function slugify(valeur: string): string {
  return valeur
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function televerserImage(fichier: File): Promise<string | null> {
  if (!fichier || fichier.size === 0) return null;
  // ponytail: sans BLOB_READ_WRITE_TOKEN (dev), l'upload est ignoré — le seed picsum prend le relais.
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const blob = await put(`soam/${Date.now()}-${fichier.name}`, fichier, {
    access: "public",
  });
  return blob.url;
}

export async function POST(req: Request) {
  if (!(await sessionActive())) {
    return NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });
  }

  const formData = await req.formData();
  const action = String(formData.get("__action") ?? "");

  // ---- Messages : bascule lu / archive -----------------------------------
  if (action === "message-lu" || action === "message-archive") {
    const id = Number(formData.get("id"));
    if (!Number.isFinite(id)) return NextResponse.redirect(new URL("/admin/messages", req.url), { status: 303 });
    if (action === "message-lu") {
      await db.update(messages).set({ lu: formData.get("lu") !== "1" }).where(eq(messages.id, id));
    } else {
      await db.update(messages).set({ archive: formData.get("archive") !== "1" }).where(eq(messages.id, id));
    }
    revalidatePath("/admin/messages");
    return NextResponse.redirect(new URL("/admin/messages", req.url), { status: 303 });
  }

  // ---- Devis : changement de statut ---------------------------------------
  if (action === "devis-statut") {
    const id = Number(formData.get("id"));
    const statut = String(formData.get("statut") ?? "");
    const valides = ["nouveau", "en_cours", "traite", "refuse"];
    if (!Number.isFinite(id) || !valides.includes(statut)) {
      return NextResponse.redirect(new URL("/admin/devis", req.url), { status: 303 });
    }
    await db.update(devis).set({ statut }).where(eq(devis.id, id));
    revalidatePath("/admin/devis");
    return NextResponse.redirect(new URL("/admin/devis", req.url), { status: 303 });
  }

  // ---- Paramètres : coordonnées + blocs JSON ------------------------------
  if (action === "parametres-site") {
    const site = {
      name: String(formData.get("name") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      hours: String(formData.get("hours") ?? "").trim(),
    };
    await db.update(parametres).set({ valeur: site }).where(eq(parametres.cle, "site"));
    revalidateTag(TAGS.parametres, "max");
    revalidatePath("/", "layout");
    return NextResponse.redirect(new URL("/admin/parametres?ok=1", req.url), { status: 303 });
  }

  if (action === "parametres-json") {
    const cle = String(formData.get("cle") ?? "");
    const clesValides = [
      "hero", "stats", "whyItems", "partners", "testimonials",
      "faqItems", "navLinks", "portfolioFilters", "contactSubjects", "featuredSolution",
      "titres",
    ];
    if (!clesValides.includes(cle)) {
      return NextResponse.redirect(new URL("/admin/parametres", req.url), { status: 303 });
    }
    let valeur: unknown;
    try {
      valeur = JSON.parse(String(formData.get("json") ?? ""));
    } catch {
      return NextResponse.redirect(
        new URL(`/admin/parametres?erreur=json&cle=${cle}`, req.url),
        { status: 303 },
      );
    }
    await db.update(parametres).set({ valeur: valeur as object }).where(eq(parametres.cle, cle));
    revalidateTag(TAGS.parametres, "max");
    revalidatePath("/", "layout");
    return NextResponse.redirect(new URL("/admin/parametres?ok=bloc", req.url), { status: 303 });
  }

  // ---- Paramètres : image du héros ----------------------------------------
  if (action === "parametres-hero-image") {
    const [heroLigne] = await db.select().from(parametres).where(eq(parametres.cle, "hero"));
    const hero = (heroLigne?.valeur ?? {}) as Record<string, unknown>;
    const fichier = formData.get("imageUrl_fichier");
    const urlTeleversee = fichier instanceof File ? await televerserImage(fichier) : null;
    const urlManuelle = String(formData.get("imageUrl_url") ?? "").trim();
    hero.imageUrl = urlTeleversee ?? (urlManuelle || null);
    await db.update(parametres).set({ valeur: hero }).where(eq(parametres.cle, "hero"));
    revalidateTag(TAGS.parametres, "max");
    revalidatePath("/", "layout");
    return NextResponse.redirect(new URL("/admin/parametres?ok=1", req.url), { status: 303 });
  }

  // ---- Entités : enregistrer / supprimer ---------------------------------
  const entiteNom = String(formData.get("__entite") ?? "");
  const spec = ENTITES[entiteNom];
  if (!spec) return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });

  if (action === "supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      const [supprimee] = await db
        .select()
        .from(spec.table)
        .where(eq(spec.table.id, id));
      await db.delete(spec.table).where(eq(spec.table.id, id));
      revalidateTag(spec.tag, "max");
      revalidatePath(`/admin/${entiteNom}`);
      if (spec.routePublic && (supprimee as { slug?: string } | null)?.slug) {
        const slug = (supprimee as { slug?: string }).slug as string;
        revalidatePath(`${spec.routePublic}/${slug}`);
        revalidatePath(spec.routePublic);
      }
    }
    return NextResponse.redirect(new URL(`/admin/${entiteNom}?ok=supprime`, req.url), { status: 303 });
  }

  // action === "enregistrer"
  const brut = String(formData.get("__id") ?? "nouveau");
  const id = brut === "nouveau" ? null : Number(brut);
  if (id !== null && !Number.isFinite(id)) {
    return NextResponse.redirect(new URL(`/admin/${entiteNom}`, req.url), { status: 303 });
  }

  const fichier = formData.get("imageUrl_fichier");
  const urlTeleversee =
    fichier instanceof File ? await televerserImage(fichier) : null;

  const ligne: Record<string, unknown> = {};
  for (const champ of spec.champs) {
    switch (champ.type) {
      case "liste":
        ligne[champ.nom] = String(formData.get(champ.nom) ?? "")
          .split("\n").map((l) => l.trim()).filter(Boolean);
        break;
      case "nombre": {
        const n = Number(formData.get(champ.nom));
        ligne[champ.nom] = Number.isFinite(n) ? n : 1;
        break;
      }
      case "booleen":
        ligne[champ.nom] = formData.get(champ.nom) === "on" || formData.get(champ.nom) === "1";
        break;
      case "slug":
        ligne[champ.nom] = slugify(String(formData.get(champ.nom) ?? ""));
        break;
      case "image":
        ligne[champ.nom] =
          urlTeleversee ??
          (String(formData.get(`${champ.nom}_url`) ?? "").trim() || null);
        break;
      default:
        ligne[champ.nom] = String(formData.get(champ.nom) ?? "").trim();
    }
  }

  try {
    if (id === null) {
      await db.insert(spec.table).values(ligne as never);
    } else {
      await db.update(spec.table).set(ligne as never).where(eq(spec.table.id, id));
    }
  } catch (e) {
    const code = (e as { cause?: { code?: string }; message?: string }).cause?.code
      ?? ((e as { message?: string }).message?.includes("UNIQUE") ? "SQLITE_CONSTRAINT" : undefined);
    if (code === "SQLITE_CONSTRAINT") {
      return NextResponse.redirect(
        new URL(`/admin/${entiteNom}/${brut}?erreur=slug`, req.url),
        { status: 303 },
      );
    }
    throw e;
  }

  revalidateTag(spec.tag, "max");
  revalidatePath(`/admin/${entiteNom}`);
  // le tag peut ne pas suffire sur les pages statiques : invalider les routes publiques aussi
  if (spec.routePublic) {
    const slug = typeof ligne.slug === "string" ? ligne.slug : null;
    if (slug) {
      revalidatePath(`${spec.routePublic}/${slug}`);
    }
    revalidatePath(spec.routePublic);
  }
  return NextResponse.redirect(new URL(`/admin/${entiteNom}?ok=1`, req.url), { status: 303 });
}

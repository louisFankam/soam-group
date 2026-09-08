import { eq, asc } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import {
  utilisateurs, posts, postTag, pages, sections, menus, medias,
  messages, devis, soumissionsFormulaires, journauxActivite, sauvegardes,
  parametres, temoignages, membresEquipe, services, projets, faqs,
  documents, offresEmploi, clientsPartenaires, produits,
} from "@/lib/schema";
import { sessionActive, hasherMotDePasse } from "@/lib/auth";
import { ENTITES_SUPERADMIN } from "@/lib/superadmin-entites";
import { GROUPES_SETTINGS, settingsDefauts } from "@/lib/settings";
import { getTypeSection, type FieldDef } from "@/lib/section-types";

const revalidateCMS = {
  pages: ["/superadmin/pages", "/"],
  sections: ["/superadmin/pages", "/"],
  menus: ["/superadmin/menu", "/"],
  posts: ["/superadmin/blog/articles", "/blog"],
  medias: ["/superadmin/medias"],
  parametres: ["/superadmin/parametres", "/"],
  messages: ["/superadmin/contacts"],
  devis: ["/superadmin/formulaires"],
  soumissions: ["/superadmin/formulaires"],
  sauvegardes: ["/superadmin/backups"],
  journal: ["/superadmin/journal"],
  commandes: ["/superadmin/commandes"],
} as const;

function publier(paths: readonly string[]) {
  for (const p of paths) revalidatePath(p);
}

async function journal(
  userId: number | undefined,
  action: string,
  subjectType: string,
  subjectId: number | null,
  description: string,
  ip: string,
) {
  try {
    await db.insert(journauxActivite).values({ userId, action, subjectType, subjectId, description, ip, properties: {} });
  } catch {
    // ne jamais faire échouer une mutation à cause du journal
  }
}

// Registre des tags CMS pour revalidation (déclarés dans lib/cms-data.ts).
const TAGS_PUBLICS: Record<string, string> = {
  temoignages: "superadmin-temoignages",
  equipe: "superadmin-equipe",
  services: "superadmin-services",
  projets: "superadmin-projets",
  faq: "superadmin-faq",
  documents: "superadmin-documents",
  emplois: "superadmin-emplois",
  clients: "superadmin-clients",
  produits: "superadmin-produits",
  commandes: "superadmin-commandes",
  categories: "superadmin-categories",
  tags: "superadmin-tags",
  pages: "superadmin-pages",
  sections: "superadmin-sections",
  menus: "superadmin-menus",
  posts: "superadmin-posts",
  medias: "superadmin-medias",
};

function revaliderEntite(moduleNom: string) {
  revalidatePath(`/superadmin/${moduleNom}`);
  const tag = TAGS_PUBLICS[moduleNom];
  if (tag) revalidateTag(tag, "max");
}

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
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const blob = await put(`soam/${Date.now()}-${fichier.name}`, fichier, {
    access: "public",
  });
  return blob.url;
}

export async function POST(req: Request) {
  const session = await sessionActive();
  if (!session || session.role !== "superadmin") {
    return NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });
  }

  const formData = await req.formData();
  const action = String(formData.get("__action") ?? "");
  const uid = await idUtilisateur(session.email);

  // ---- Utilisateurs : enregistrer / supprimer --------------------------------
  if (action === "utilisateur-enregistrer") {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    if (id !== null && !Number.isFinite(id)) {
      return NextResponse.redirect(new URL("/superadmin/utilisateurs", req.url), { status: 303 });
    }

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const nom = String(formData.get("nom") ?? "").trim();
    const role = String(formData.get("role") ?? "editor");
    const motDePasse = String(formData.get("motDePasse") ?? "");
    // Nouveau : actif par défaut ; édition : le checkbox détermine la valeur
    const actif = id === null ? true : (formData.get("actif") === "on" || formData.get("actif") === "1");

    if (!email) {
      return NextResponse.redirect(new URL("/superadmin/utilisateurs", req.url), { status: 303 });
    }

    const donnees: Record<string, unknown> = { email, nom, role, actif };

    if (id === null && !motDePasse) {
      return NextResponse.redirect(
        new URL("/superadmin/utilisateurs/nouveau?erreur=mdp", req.url),
        { status: 303 },
      );
    }
    if (motDePasse) {
      donnees.motDePasseHash = hasherMotDePasse(motDePasse);
    }

    try {
      if (id === null) {
        await db.insert(utilisateurs).values(donnees as never);
      } else {
        await db.update(utilisateurs).set(donnees as never).where(eq(utilisateurs.id, id));
      }
    } catch (e) {
      const code = (e as { cause?: { code?: string }; message?: string }).cause?.code
        ?? ((e as { message?: string }).message?.includes("UNIQUE") ? "SQLITE_CONSTRAINT" : undefined);
      if (code === "SQLITE_CONSTRAINT") {
        return NextResponse.redirect(
          new URL(`/superadmin/utilisateurs/${brut}?erreur=email`, req.url),
          { status: 303 },
        );
      }
      throw e;
    }

    revalidatePath("/superadmin/utilisateurs");
    return NextResponse.redirect(new URL("/superadmin/utilisateurs?ok=1", req.url), { status: 303 });
  }

  if (action === "utilisateur-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(utilisateurs).where(eq(utilisateurs.id, id));
    }
    revalidatePath("/superadmin/utilisateurs");
    return NextResponse.redirect(new URL("/superadmin/utilisateurs?ok=supprime", req.url), { status: 303 });
  }

  // ---- Articles de blog ------------------------------------------------------
  if (action === "post-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(postTag).where(eq(postTag.postId, id));
      await db.delete(posts).where(eq(posts.id, id));
    }
    revalidatePath("/superadmin/blog/articles");
    return NextResponse.redirect(new URL("/superadmin/blog/articles?ok=supprime", req.url), { status: 303 });
  }

  if (action === "post-enregistrer") {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    if (id !== null && !Number.isFinite(id)) {
      return NextResponse.redirect(new URL("/superadmin/blog/articles", req.url), { status: 303 });
    }

    const fichierImage = formData.get("imageUrl_fichier");
    let urlImage: string | null = null;
    if (fichierImage instanceof File && fichierImage.size > 0) {
      urlImage = await televerserImage(fichierImage);
    }
    const urlManuelle = String(formData.get("imageUrl_url") ?? "").trim();

    const body = String(formData.get("body") ?? "")
      .split(/\n{2,}/)
      .map((l) => l.trim())
      .filter(Boolean);
    const categoryIdBrut = String(formData.get("categoryId") ?? "");
    const categoryId = categoryIdBrut ? Number(categoryIdBrut) : null;
    const tagIds = formData.getAll("tags").map((t) => Number(t));

    const valeurs = {
      title: String(formData.get("title") ?? "").trim(),
      slug: slugify(String(formData.get("slug") ?? "")),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      body,
      imageUrl: urlImage ?? (urlManuelle || null),
      categoryId,
      isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "1",
    };

    let postId: number;
    try {
      if (id === null) {
        const insere = await db.insert(posts).values(valeurs).returning({ id: posts.id });
        postId = insere[0].id;
      } else {
        await db.update(posts).set(valeurs).where(eq(posts.id, id));
        postId = id;
        await db.delete(postTag).where(eq(postTag.postId, postId));
      }
    } catch (e) {
      const code = (e as { cause?: { code?: string }; message?: string }).cause?.code
        ?? ((e as { message?: string }).message?.includes("UNIQUE") ? "SQLITE_CONSTRAINT" : undefined);
      if (code === "SQLITE_CONSTRAINT") {
        return NextResponse.redirect(
          new URL(`/superadmin/blog/articles/${brut}?erreur=slug`, req.url),
          { status: 303 },
        );
      }
      throw e;
    }

    if (tagIds.length > 0) {
      await db.insert(postTag).values(tagIds.map((tagId) => ({ postId, tagId })));
    }

    revalidatePath("/superadmin/blog/articles");
    return NextResponse.redirect(new URL("/superadmin/blog/articles?ok=1", req.url), { status: 303 });
  }

  // ---- Entités de contenu : enregistrer / supprimer -------------------------
  const moduleNom = String(formData.get("__module") ?? "");
  const entiteSpec = ENTITES_SUPERADMIN[moduleNom];

  if (action === "entite-supprimer" && entiteSpec) {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(entiteSpec.table).where(eq(entiteSpec.table.id, id));
    }
    revaliderEntite(moduleNom);
    return NextResponse.redirect(new URL(`/superadmin/${moduleNom}?ok=supprime`, req.url), { status: 303 });
  }

  if (action === "entite-enregistrer" && entiteSpec) {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    if (id !== null && !Number.isFinite(id)) {
      return NextResponse.redirect(new URL(`/superadmin/${moduleNom}`, req.url), { status: 303 });
    }

    // Une seule image téléversée par formulaire (champs type "image")
    const fichierImage = formData.get("imageUrl_fichier");
    let urlImage: string | null = null;
    if (fichierImage instanceof File && fichierImage.size > 0) {
      urlImage = await televerserImage(fichierImage);
    }
    const urlImageManuelle = String(formData.get("imageUrl_url") ?? "").trim();

    const ligne: Record<string, unknown> = {};
    for (const champ of entiteSpec.champs) {
      switch (champ.type) {
        case "liste":
          ligne[champ.nom] = String(formData.get(champ.nom) ?? "")
            .split("\n").map((l) => l.trim()).filter(Boolean);
          break;
        case "nombre": {
          const n = Number(formData.get(champ.nom));
          ligne[champ.nom] = Number.isFinite(n) ? n : 0;
          break;
        }
        case "booleen":
          ligne[champ.nom] = formData.get(champ.nom) === "on" || formData.get(champ.nom) === "1";
          break;
        case "slug":
          ligne[champ.nom] = slugify(String(formData.get(champ.nom) ?? ""));
          break;
        case "select":
          ligne[champ.nom] = String(formData.get(champ.nom) ?? champ.options?.[0]?.valeur ?? "");
          break;
        case "image":
          ligne[champ.nom] =
            urlImage ?? (urlImageManuelle || null);
          break;
        default:
          ligne[champ.nom] = String(formData.get(champ.nom) ?? "").trim();
      }
    }

    try {
      if (id === null) {
        await db.insert(entiteSpec.table).values(ligne as never);
      } else {
        await db.update(entiteSpec.table).set(ligne as never).where(eq(entiteSpec.table.id, id));
      }
    } catch (e) {
      const code = (e as { cause?: { code?: string }; message?: string }).cause?.code
        ?? ((e as { message?: string }).message?.includes("UNIQUE") ? "SQLITE_CONSTRAINT" : undefined);
      if (code === "SQLITE_CONSTRAINT") {
        return NextResponse.redirect(
          new URL(`/superadmin/${moduleNom}/${brut}?erreur=slug`, req.url),
          { status: 303 },
        );
      }
      throw e;
    }

    revaliderEntite(moduleNom);
    return NextResponse.redirect(new URL(`/superadmin/${moduleNom}?ok=1`, req.url), { status: 303 });
  }

  // ---- Paramètres structurés (groupe) ----------------------------------------
  if (action === "parametres-groupe") {
    const groupeId = String(formData.get("__groupe") ?? "");
    const groupe = GROUPES_SETTINGS.find((g) => g.id === groupeId);
    if (groupe) {
      const existant = await db.select().from(parametres).where(eq(parametres.cle, "settings")).get();
      const se = (existant?.valeur as Record<string, Record<string, unknown>> | undefined) ?? settingsDefauts();
      const valeurs: Record<string, unknown> = {};
      for (const champ of groupe.champs) {
        const fichier = formData.get(`${champ.cle}_fichier`);
        let url: string | null = null;
        if (fichier instanceof File && fichier.size > 0) {
          url = await televerserImage(fichier);
        }
        const urlManuelle = String(formData.get(`${champ.cle}_url`) ?? "").trim();
        switch (champ.type) {
          case "booleen":
            valeurs[champ.cle] = formData.get(champ.cle) === "on" || formData.get(champ.cle) === "1";
            break;
          case "nombre": {
            const n = Number(formData.get(champ.cle));
            valeurs[champ.cle] = Number.isFinite(n) ? n : 0;
            break;
          }
          case "range": {
            const n = Number(formData.get(champ.cle));
            valeurs[champ.cle] = Number.isFinite(n) ? n : champ.defaut;
            break;
          }
          case "couleur": {
            const hex = String(formData.get(`${champ.cle}_hex`) ?? formData.get(champ.cle) ?? "").trim();
            valeurs[champ.cle] = hex || String(champ.defaut);
            break;
          }
          case "image": {
            const existant = (se[groupeId] as Record<string, unknown> | undefined)?.[champ.cle];
            const fallback = existant ?? champ.defaut ?? "";
            valeurs[champ.cle] = url ?? (urlManuelle || String(fallback));
            break;
          }
          case "select":
          case "texte":
          case "textaire":
          default:
            valeurs[champ.cle] = String(formData.get(champ.cle) ?? champ.defaut ?? "");
        }
      }
      // le champ logo.image transporte sa propre valeur pour les groupes sans upload
      const nouveau = { ...se, [groupeId]: { ...(se[groupeId] ?? {}), ...valeurs } };
      await db
        .insert(parametres)
        .values({ cle: "settings", valeur: nouveau })
        .onConflictDoUpdate({ target: parametres.cle, set: { valeur: nouveau } });
      publier(revalidateCMS.parametres);
      await journal(uid, "parametres", "parametres", null, `Groupe « ${groupe.label} » mis à jour`, ipNone(req));
    }
    const retour = String(formData.get("__retour") ?? "");
    const retourUrl = retour === "pied-de-page"
      ? "/superadmin/pied-de-page?ok=1"
      : `/superadmin/parametres?onglet=${groupeId}&ok=1`;
    return NextResponse.redirect(new URL(retourUrl, req.url), { status: 303 });
  }

  // ---- Pages -----------------------------------------------------------------
  if (action === "page-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(pages).where(eq(pages.id, id));
    }
    publier(revalidateCMS.pages);
    await journal(uid, "suppression", "page", Number.isFinite(id) ? id : null, "Page supprimée", ipNone(req));
    return NextResponse.redirect(new URL(`/superadmin/pages?ok=supprime`, req.url), { status: 303 });
  }

  if (action === "page-enregistrer") {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    if (id !== null && !Number.isFinite(id)) {
      return NextResponse.redirect(new URL("/superadmin/pages", req.url), { status: 303 });
    }
    const valeurs = {
      title: String(formData.get("title") ?? "").trim(),
      slug: slugify(String(formData.get("slug") ?? "")),
      parentId: null as number | null,
      isHomepage: formData.get("isHomepage") === "on" || formData.get("isHomepage") === "1",
      isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "1",
      showInMenu: formData.get("showInMenu") === "on" || formData.get("showInMenu") === "1",
      menuOrder: Number(formData.get("menuOrder") ?? 0) || 0,
      template: String(formData.get("template") ?? "standard"),
      cssClasses: String(formData.get("cssClasses") ?? "").trim(),
      metaTitle: String(formData.get("metaTitle") ?? "").trim(),
      metaDescription: String(formData.get("metaDescription") ?? "").trim(),
      metaKeywords: String(formData.get("metaKeywords") ?? "").trim(),
      publishedAt: formData.get("isPublished") === "on" || formData.get("isPublished") === "1"
        ? Math.floor(Date.now() / 1000)
        : undefined,
      modifieLe: Math.floor(Date.now() / 1000),
    };
    let pageId: number | null = null;
    try {
      if (id === null) {
        const inseré = await db.insert(pages).values(valeurs).returning({ id: pages.id });
        pageId = inseré[0].id;
        if (valeurs.isHomepage) {
          await db.update(pages).set({ isHomepage: false });
          await db.update(pages).set({ isHomepage: true }).where(eq(pages.id, pageId));
        }
        await journal(uid, "creation", "page", pageId, `Page « ${valeurs.title} » créée`, ipNone(req));
      } else {
        await db.update(pages).set(valeurs).where(eq(pages.id, id));
        if (valeurs.isHomepage) {
          await db.update(pages).set({ isHomepage: false });
          await db.update(pages).set({ isHomepage: true }).where(eq(pages.id, id));
        }
        pageId = id;
        await journal(uid, "modification", "page", id, `Page « ${valeurs.title} » modifiée`, ipNone(req));
      }
    } catch (e) {
      const code = (e as { cause?: { code?: string }; message?: string }).cause?.code
        ?? ((e as { message?: string }).message?.includes("UNIQUE") ? "SQLITE_CONSTRAINT" : undefined);
      if (code === "SQLITE_CONSTRAINT") {
        return NextResponse.redirect(new URL(`/superadmin/pages/${brut}?erreur=slug`, req.url), { status: 303 });
      }
      throw e;
    }
    publier(revalidateCMS.pages);
    return NextResponse.redirect(new URL(pageId ? `/superadmin/pages/${pageId}` : "/superadmin/pages?ok=1", req.url), { status: 303 });
  }

  // ---- Sections --------------------------------------------------------------
  if (action === "section-supprimer") {
    const id = Number(formData.get("__id"));
    const pageId = Number(formData.get("__pageId"));
    if (Number.isFinite(id)) {
      await db.delete(sections).where(eq(sections.id, id));
    }
    publier(revalidateCMS.sections);
    if (Number.isFinite(pageId)) {
      return NextResponse.redirect(new URL(`/superadmin/pages/${pageId}?ok=section-supprimee`, req.url), { status: 303 });
    }
    return NextResponse.redirect(new URL("/superadmin/pages?ok=1", req.url), { status: 303 });
  }

  if (action === "section-ajouter") {
    const pageId = Number(formData.get("__pageId"));
    if (Number.isFinite(pageId)) {
      const existantes = await db.select().from(sections).where(eq(sections.pageId, pageId)).all();
      const ordre = existantes.length > 0 ? Math.max(...existantes.map((t) => t.orderColumn)) + 1 : 0;
      await db.insert(sections).values({
        pageId,
        sectionType: String(formData.get("__sectionType") ?? "text_with_image"),
        title: "", subtitle: "", content: {}, settings: {},
        isVisible: true, cssClasses: "", animation: "", orderColumn: ordre,
      });
      publier(revalidateCMS.sections);
      return NextResponse.redirect(new URL(`/superadmin/pages/${pageId}?ok=ajout`, req.url), { status: 303 });
    }
    return NextResponse.redirect(new URL("/superadmin/pages", req.url), { status: 303 });
  }

  if (action === "section-enregistrer") {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    const pageId = Number(formData.get("__pageId"));
    const sectionType = String(formData.get("__sectionType") ?? "");
    if (!Number.isFinite(pageId)) {
      return NextResponse.redirect(new URL("/superadmin/pages", req.url), { status: 303 });
    }

    const typeSection = getTypeSection(sectionType);
    const content: Record<string, unknown> = {};
    const settings: Record<string, unknown> = {};

    for (const champ of typeSection?.champs ?? []) {
      content[champ.nom] = lireChamp("c", champ, formData);
    }
    for (const p of typeSection?.parametres ?? []) {
      settings[p.nom] = lireChamp("s", { ...p, type: p.type }, formData);
    }
    // champs titre/sous-titre non typés mais présents dans les formulaires
    if (formData.get("c_title") !== null && !("title" in content)) content.title = String(formData.get("c_title") ?? "");
    if (formData.get("c_subtitle") !== null && !("subtitle" in content)) content.subtitle = String(formData.get("c_subtitle") ?? "");

    const isVisible = formData.get("isVisible") === "on" || formData.get("isVisible") === "1";
    const cssClasses = String(formData.get("cssClasses") ?? "").trim();
    const animation = String(formData.get("animation") ?? "").trim();
    const orderColumn = Number(formData.get("orderColumn") ?? 0) || 0;

    try {
      if (id === null) {
        await db.insert(sections).values({
          pageId, sectionType, title: String(content.title ?? ""), subtitle: String(content.subtitle ?? ""),
          content, settings, isVisible, cssClasses, animation, orderColumn,
        });
      } else {
        await db.update(sections).set({
          title: String(content.title ?? ""), subtitle: String(content.subtitle ?? ""),
          content, settings, isVisible, cssClasses, animation,
          orderColumn, modifieLe: Math.floor(Date.now() / 1000),
        }).where(eq(sections.id, id));
      }
    } catch (e) {
      console.error(e);
      return NextResponse.redirect(new URL(`/superadmin/pages/${pageId}?ok=erreur`, req.url), { status: 303 });
    }
    publier(revalidateCMS.sections);
    await journal(uid, "modification", "section", Number.isFinite(id) ? id : null, `Section « ${sectionType} » enregistrée`, ipNone(req));
    return NextResponse.redirect(new URL(`/superadmin/pages/${pageId}?ok=1`, req.url), { status: 303 });
  }

  // ---- Menus -----------------------------------------------------------------

  if (action === "menu-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(menus).where(eq(menus.id, id));
    }
    revalidateTag(TAGS_PUBLICS.menus, "max");
    publier(revalidateCMS.menus);
    return NextResponse.redirect(new URL("/superadmin/menu?ok=supprime", req.url), { status: 303 });
  }

  if (action === "menu-enregistrer") {
    const brut = String(formData.get("__id") ?? "nouveau");
    const id = brut === "nouveau" ? null : Number(brut);
    const title = String(formData.get("title") ?? "").trim();
    const location = String(formData.get("location") ?? "header");
    // items : [index]label + [index]url pour chaque entrée du builder simple
    const items: { label: string; url: string }[] = [];
    const labels = formData.getAll("items_label");
    const urls = formData.getAll("items_url");
    for (let i = 0; i < labels.length; i++) {
      const label = String(labels[i]).trim();
      const url = String(urls[i] ?? "").trim();
      if (label) items.push({ label, url });
    }
    if (id === null) {
      await db.insert(menus).values({ title, location, items });
    } else {
      await db.update(menus).set({ title, location, items }).where(eq(menus.id, id));
    }
    revalidateTag(TAGS_PUBLICS.menus, "max");
    publier(revalidateCMS.menus);
    await journal(uid, "modification", "menu", id, id === null ? `Menu « ${title} » créé` : `Menu « ${title} » modifié`, ipNone(req));
    return NextResponse.redirect(new URL("/superadmin/menu?ok=1", req.url), { status: 303 });
  }

  // ---- Contact / messages ----------------------------------------------------
  if (action === "contact-marquer") {
    const id = Number(formData.get("__id"));
    const lu = String(formData.get("lu") ?? "1") === "1";
    if (Number.isFinite(id)) {
      await db.update(messages).set({ lu }).where(eq(messages.id, id));
    }
    publier(revalidateCMS.messages);
    return NextResponse.redirect(new URL("/superadmin/contacts?ok=1", req.url), { status: 303 });
  }

  if (action === "contact-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(messages).where(eq(messages.id, id));
    }
    publier(revalidateCMS.messages);
    return NextResponse.redirect(new URL("/superadmin/contacts?ok=supprime", req.url), { status: 303 });
  }

  // ---- Devis / soumissions ---------------------------------------------------
  if (action === "devis-marquer") {
    const id = Number(formData.get("__id"));
    const statut = String(formData.get("statut") ?? "nouveau");
    if (Number.isFinite(id)) {
      await db.update(devis).set({ statut }).where(eq(devis.id, id));
    }
    publier(revalidateCMS.devis);
    return NextResponse.redirect(new URL("/superadmin/formulaires?ok=1", req.url), { status: 303 });
  }

  if (action === "devis-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(devis).where(eq(devis.id, id));
    }
    publier(revalidateCMS.devis);
    return NextResponse.redirect(new URL("/superadmin/formulaires?ok=supprime", req.url), { status: 303 });
  }

  if (action === "soumission-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(soumissionsFormulaires).where(eq(soumissionsFormulaires.id, id));
    }
    publier(revalidateCMS.soumissions);
    return NextResponse.redirect(new URL("/superadmin/formulaires?ok=supprime", req.url), { status: 303 });
  }

  // ---- Médias ----------------------------------------------------------------
  if (action === "media-upload") {
    const fichiers = formData.getAll("fichiers");
    let compteur = 0;
    for (const f of fichiers) {
      if (!(f instanceof File) || f.size === 0) continue;
      let url: string | null = null;
      let path = "";
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`soam/media/${Date.now()}-${f.name}`, f, { access: "public" });
        url = blob.url;
        path = blob.url;
      } else {
        // sans blob provider : enregistre quand même la référence (URL vide)
        url = "";
      }
      await db.insert(medias).values({
        filename: f.name,
        originalName: f.name,
        mimeType: f.type,
        size: f.size,
        path,
        url,
        alt: "",
      });
      compteur++;
    }
    revalidateTag(TAGS_PUBLICS.medias, "max");
    publier(revalidateCMS.medias);
    return NextResponse.redirect(new URL(`/superadmin/medias?ok=${compteur > 0 ? "1" : "vide"}`, req.url), { status: 303 });
  }

  if (action === "media-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(medias).where(eq(medias.id, id));
    }
    revalidateTag(TAGS_PUBLICS.medias, "max");
    publier(revalidateCMS.medias);
    return NextResponse.redirect(new URL("/superadmin/medias?ok=supprime", req.url), { status: 303 });
  }

  // ---- Sauvegardes -----------------------------------------------------------
  if (action === "backup-creer") {
    const nom = `sauvegarde-${new Date().toISOString().replace(/[:.]/g, "-")}.db`;
    await db.insert(sauvegardes).values({ filename: nom, size: 0 });
    publier(revalidateCMS.sauvegardes);
    await journal(uid, "creation", "sauvegarde", null, `Sauvegarde créée : ${nom}`, ipNone(req));
    return NextResponse.redirect(new URL("/superadmin/backups?ok=1", req.url), { status: 303 });
  }

  if (action === "backup-supprimer") {
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      await db.delete(sauvegardes).where(eq(sauvegardes.id, id));
    }
    publier(revalidateCMS.sauvegardes);
    return NextResponse.redirect(new URL("/superadmin/backups?ok=supprime", req.url), { status: 303 });
  }

  // ---- Corbeille (soft restore) ----------------------------------------------
  if (action === "corbeille-vider") {
    // supprime définitivement les éléments archivés : traité dans les onglets
    return NextResponse.redirect(new URL("/superadmin/corbeille?ok=1", req.url), { status: 303 });
  }

  if (action === "entite-restaurer") {
    const moduleNom = String(formData.get("__module") ?? "");
    const id = Number(formData.get("__id"));
    if (Number.isFinite(id)) {
      switch (moduleNom) {
        case "temoignages": await db.update(temoignages).set({ isActive: true }).where(eq(temoignages.id, id)); break;
        case "equipe": await db.update(membresEquipe).set({ isActive: true }).where(eq(membresEquipe.id, id)); break;
        case "services": await db.update(services).set({ isActive: true }).where(eq(services.id, id)); break;
        case "projets": await db.update(projets).set({ isPublished: true }).where(eq(projets.id, id)); break;
        case "faq": await db.update(faqs).set({ isActive: true }).where(eq(faqs.id, id)); break;
        case "documents": await db.update(documents).set({ isActive: true }).where(eq(documents.id, id)); break;
        case "emplois": await db.update(offresEmploi).set({ isActive: true }).where(eq(offresEmploi.id, id)); break;
        case "clients-partenaires": await db.update(clientsPartenaires).set({ isActive: true }).where(eq(clientsPartenaires.id, id)); break;
        case "produits": await db.update(produits).set({ isActive: true }).where(eq(produits.id, id)); break;
        case "post": await db.update(posts).set({ isPublished: true, publishedAt: Math.floor(Date.now() / 1000) }).where(eq(posts.id, id)); break;
        case "page": await db.update(pages).set({ isPublished: true }).where(eq(pages.id, id)); break;
        default: break;
      }
    }
    return NextResponse.redirect(new URL("/superadmin/corbeille?ok=1", req.url), { status: 303 });
  }

  if (action === "parametres-enregistrer") {
    publier(revalidateCMS.parametres);
    return NextResponse.redirect(new URL("/superadmin/parametres?ok=1", req.url), { status: 303 });
  }

  // ---- Action inconnue → dashboard
  return NextResponse.redirect(new URL("/superadmin", req.url), { status: 303 });
}

function ipNone(_req: Request): string {
  return "local";
}
function lireChamp(prefix: "c" | "s", champ: FieldDef, formData: FormData): unknown {
  const base = `${prefix}_${champ.nom}`;
  if (champ.type === "collection" && champ.champs) {
    // détermine le nombre d'éléments via les noms de champs
    const indexSet = new Set<number>();
    for (const key of formData.keys()) {
      if (key.startsWith(`${base}_`)) {
        const reste = key.slice(base.length + 1);
        const idx = parseInt(reste.split("_")[0], 10);
        if (!Number.isNaN(idx)) indexSet.add(idx);
      }
    }
    const indices = [...indexSet].sort((a, b) => a - b);
    const items: Record<string, unknown>[] = [];
    for (const idx of indices) {
      const item: Record<string, unknown> = {};
      for (const sc of champ.champs) {
        const scValeur = formData.get(`${base}_${idx}_${sc.nom}`);
        if (scValeur !== null) item[sc.nom] = scValeur as unknown;
      }
      items.push(item);
    }
    return items;
  }
  if (champ.type === "galerie") {
    const images: string[] = [];
    for (const key of formData.keys()) {
      if (key.startsWith(`${base}_`)) {
        const v = String(formData.get(key) ?? "").trim();
        if (v) images.push(v);
      }
    }
    return images;
  }
  const raw = formData.get(base);
  switch (champ.type) {
    case "booleen":
      return raw === "on" || raw === "1";
    case "nombre":
      return Number.isFinite(Number(raw)) ? Number(raw) : 0;
    default:
      return raw === null ? "" : String(raw);
  }
}
async function idUtilisateur(email: string): Promise<number | undefined> {
  try {
    const u = await db.select().from(utilisateurs).where(eq(utilisateurs.email, email)).get();
    return u?.id;
  } catch {
    return undefined;
  }
}

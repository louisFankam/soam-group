import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { devis } from "@/lib/schema";

// ponytail: stockage DB + Blob ; email transactionnel à brancher si demandé.
export async function POST(req: Request) {
  const data = await req.formData();

  // Honeypot : les bots remplissent le champ caché, on feint le succès.
  if (String(data.get("siteWeb") ?? "").trim()) {
    return NextResponse.redirect(new URL("/devis?envoye=1", req.url), { status: 303 });
  }

  const nom = String(data.get("nom") ?? "").trim();
  const telephone = String(data.get("telephone") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const organisation = String(data.get("organisation") ?? "").trim();
  const secteur = String(data.get("secteur") ?? "").trim();
  const service = String(data.get("service") ?? "").trim();
  const budget = String(data.get("budget") ?? "").trim();
  const description = String(data.get("description") ?? "").trim();

  if (!nom || !telephone || !email || !secteur || !service || !budget || !description) {
    return NextResponse.redirect(new URL("/devis?erreur=1", req.url), { status: 303 });
  }

  let fichierUrl: string | null = null;
  const fichier = data.get("fichier");
  if (fichier instanceof File && fichier.size > 0) {
    // ponytail: sans BLOB_READ_WRITE_TOKEN (dev), la pièce jointe est ignorée.
    if (process.env.BLOB_READ_WRITE_TOKEN && fichier.size <= 10 * 1024 * 1024) {
      const blob = await put(`soam/devis/${Date.now()}-${fichier.name}`, fichier, {
        access: "public",
      });
      fichierUrl = blob.url;
    }
  }

  await db.insert(devis).values({
    nom,
    organisation,
    telephone,
    email,
    secteur,
    service,
    budget,
    description,
    fichierUrl,
  });

  return NextResponse.redirect(new URL("/devis?envoye=1", req.url), { status: 303 });
}

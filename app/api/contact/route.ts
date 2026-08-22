import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";

// ponytail: stockage DB (inbox admin) ; brancher un email transactionnel plus tard si demandé.
export async function POST(req: Request) {
  const data = await req.formData();
  const nom = String(data.get("nom") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (!nom || !email || !message) {
    return NextResponse.redirect(new URL("/contact?erreur=1", req.url), { status: 303 });
  }
  await db.insert(messages).values({
    nom,
    email,
    telephone: String(data.get("telephone") ?? "").trim(),
    sujet: String(data.get("sujet") ?? "").trim(),
    message,
  });
  return NextResponse.redirect(new URL("/contact?envoye=1", req.url), { status: 303 });
}

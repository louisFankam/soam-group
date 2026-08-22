import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visites } from "@/lib/schema";

// ponytail : endpoint public sans rate-limit — pire cas, des stats gonflées.
export async function POST(req: Request) {
  // Les visites de l'admin connecté ne sont pas comptées.
  if ((req.headers.get("cookie") ?? "").includes("soam_admin")) {
    return new NextResponse(null, { status: 204 });
  }

  let chemin: unknown;
  try {
    ({ chemin } = await req.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (
    typeof chemin !== "string" ||
    !chemin.startsWith("/") ||
    chemin.startsWith("/admin") ||
    chemin.includes("?") ||
    chemin.includes("#") ||
    chemin.length > 200
  ) {
    return new NextResponse(null, { status: 400 });
  }

  await db
    .insert(visites)
    .values({ jour: new Date().toISOString().slice(0, 10), chemin })
    .onConflictDoUpdate({
      target: [visites.jour, visites.chemin],
      set: { vues: sql`${visites.vues} + 1` },
    });

  return new NextResponse(null, { status: 204 });
}

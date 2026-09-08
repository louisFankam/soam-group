import { cookies, headers } from "next/headers";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

// ponytail: session maison (cookie HMAC + scrypt) au lieu d'Auth.js —
// un seul compte admin, zéro dépendance. Passer à Auth.js si multi-utilisateurs.
// Format du token : base64url(email) + "." + timestamp + "." + role + "." + HMAC

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";
const COOKIE = "soam_admin";
const DUREE_S = 60 * 60 * 24 * 7; // 7 jours

export type Session = { email: string; role: string };

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function hasherMotDePasse(mdp: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(mdp, salt, 64).toString("hex")}`;
}

export function verifierMotDePasse(mdp: string, stocke: string): boolean {
  const [salt, hash] = stocke.split(":");
  if (!salt || !hash) return false;
  const calcule = scryptSync(mdp, salt, 64);
  const attendu = Buffer.from(hash, "hex");
  return calcule.length === attendu.length && timingSafeEqual(calcule, attendu);
}

export async function creerSession(email: string, role: string = "editor"): Promise<void> {
  const payload = `${Buffer.from(email).toString("base64url")}.${Date.now()}.${role}`;
  const https = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    maxAge: DUREE_S,
    path: "/",
  });
}

export async function detruireSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Session de l'admin connecté, ou null. */
export async function sessionActive(): Promise<Session | null> {
  const brut = (await cookies()).get(COOKIE)?.value;
  if (!brut) return null;
  const parties = brut.split(".");
  if (parties.length !== 4) return null;
  const [emailB64, ts, role, sig] = parties;
  const attendu = Buffer.from(sign(`${emailB64}.${ts}.${role}`), "hex");
  const recu = Buffer.from(sig, "hex");
  if (attendu.length !== recu.length || !timingSafeEqual(attendu, recu)) return null;
  if (Date.now() - Number(ts) > DUREE_S * 1000) return null;
  return { email: Buffer.from(emailB64, "base64url").toString(), role };
}

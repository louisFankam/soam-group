import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// ponytail: SQLite fichier en dev, Turso en prod via TURSO_DATABASE_URL — même code.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./soam.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

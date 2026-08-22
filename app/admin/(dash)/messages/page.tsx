import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Icon from "@/components/ui";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ archive?: string }>;
}) {
  const { archive } = await searchParams;
  const voirArchive = archive === "1";

  const liste = await db
    .select()
    .from(messages)
    .where(eq(messages.archive, voirArchive))
    .orderBy(desc(messages.creeLe));

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">
          Messages — {voirArchive ? "archives" : "boîte de réception"}
        </h1>
        <Link
          href={voirArchive ? "/admin/messages" : "/admin/messages?archive=1"}
          className="text-sm text-primary hover:underline"
        >
          {voirArchive ? "← Boîte de réception" : "Voir les archives"}
        </Link>
      </div>

      <div className="space-y-3">
        {liste.map((m) => (
          <article
            key={m.id}
            className={`bg-card border rounded-2xl p-5 ${m.lu || m.archive ? "border-card-border" : "border-primary/40 shadow-sm"}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className={`text-sm ${m.lu ? "text-foreground" : "font-bold text-foreground"}`}>
                  {m.nom}
                  {!m.lu && !m.archive && (
                    <span className="ml-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full align-middle">
                      NOUVEAU
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {m.email}{m.telephone && ` · ${m.telephone}`} ·{" "}
                  {new Date(m.creeLe * 1000).toLocaleString("fr-FR")}
                </p>
                {m.sujet && (
                  <p className="text-xs font-medium text-primary mt-1">{m.sujet}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <form action="/api/admin" method="post">
                  <input type="hidden" name="__action" value="message-lu" />
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="lu" value={m.lu ? "1" : "0"} />
                  <button type="submit" className="text-xs border border-border hover:bg-secondary rounded-lg px-3 py-1.5 transition-colors">
                    Marquer {m.lu ? "non lu" : "lu"}
                  </button>
                </form>
                <form action="/api/admin" method="post">
                  <input type="hidden" name="__action" value="message-archive" />
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="archive" value={m.archive ? "1" : "0"} />
                  <button type="submit" className="text-xs border border-border hover:bg-secondary rounded-lg px-3 py-1.5 transition-colors">
                    {m.archive ? "Restaurer" : "Archiver"}
                  </button>
                </form>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-line">
              {m.message}
            </p>
            <a
              href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.sujet || "Votre demande")}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3"
            >
              Répondre <Icon i="arrow-right" size={13} />
            </a>
          </article>
        ))}
        {liste.length === 0 && (
          <p className="text-sm text-muted-foreground bg-card border border-card-border rounded-2xl p-8 text-center">
            Aucun message.
          </p>
        )}
      </div>
    </div>
  );
}

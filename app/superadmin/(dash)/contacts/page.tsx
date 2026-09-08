import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import Icon from "@/components/ui";

function formatDate(epoch: number): string {
  return new Date(epoch * 1000).toLocaleString("fr-FR");
}

export default async function ContactsPage() {
  const liste = await db.select().from(messages).orderBy(messages.creeLe);
  const nonLus = liste.filter((m) => !m.lu).length;

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="font-headings font-bold text-xl text-foreground">Messages de contact</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{nonLus} non lu(s) sur {liste.length}</p>
      </div>

      <div className="space-y-3">
        {liste.map((m) => (
          <div key={m.id} className={`bg-card border rounded-2xl p-5 ${m.lu ? "border-card-border" : "border-primary/40 shadow-sm"}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {m.nom}
                  {!m.lu && <span className="ml-2 text-[10px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">Nouveau</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.email}
                  {m.telephone && ` • ${m.telephone}`}
                  {m.sujet && ` • ${m.sujet}`}
                </p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{formatDate(m.creeLe)}</div>
            </div>
            <p className="text-sm text-foreground mt-3 whitespace-pre-wrap">{m.message}</p>
            <div className="flex gap-4 mt-4">
              {!m.lu && (
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value="contact-marquer" />
                  <input type="hidden" name="__id" value={String(m.id)} />
                  <input type="hidden" name="lu" value="1" />
                  <button type="submit" className="text-sm text-primary hover:underline inline-flex items-center gap-1"><Icon i="check" size={14} /> Marquer lu</button>
                </form>
              )}
              <form action="/api/superadmin" method="post">
                <input type="hidden" name="__action" value="contact-supprimer" />
                <input type="hidden" name="__id" value={String(m.id)} />
                <button type="submit" className="text-sm text-red-600 hover:underline inline-flex items-center gap-1"><Icon i="trash-2" size={14} /> Supprimer</button>
              </form>
            </div>
          </div>
        ))}
        {liste.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun message.</p>
        )}
      </div>
    </div>
  );
}

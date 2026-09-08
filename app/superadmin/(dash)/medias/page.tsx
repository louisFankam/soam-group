import { db } from "@/lib/db";
import { medias } from "@/lib/schema";
import Icon from "@/components/ui";

export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const liste = await db.select().from(medias).orderBy(medias.id);

  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="font-headings font-bold text-xl text-foreground">Bibliothèque média</h1>

      {ok === "1" && <p className="rounded-xl bg-accent-green/10 border border-accent-green/30 text-foreground text-sm px-4 py-3">Fichier(s) ajouté(s) ✓</p>}
      {ok === "supprime" && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">Fichier supprimé.</p>}
      {ok === "vide" && <p className="rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3">Aucun fichier sélectionné.</p>}

      <form action="/api/superadmin" method="post" encType="multipart/form-data" className="bg-card border border-card-border rounded-2xl p-6">
        <input type="hidden" name="__action" value="media-upload" />
        <label className="block text-sm font-medium text-foreground mb-2">Importer des images</label>
        <input
          type="file"
          name="fichiers"
          accept="image/*"
          multiple
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-secondary/70"
        />
        <button type="submit" className="mt-4 bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2">
          <Icon i="upload" size={16} /> Importer
        </button>
      </form>

      {liste.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {liste.map((m) => (
            <div key={m.id} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt || m.originalName} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5 space-y-1.5">
                <p className="text-xs text-foreground truncate" title={m.originalName}>{m.originalName}</p>
                <p className="text-[11px] text-muted-foreground">{Math.round(m.size / 1024)} Ko</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={m.url}
                    className="w-full text-[11px] bg-input border border-border rounded-lg px-2 py-1 text-muted-foreground truncate"
                  />
                  <form action="/api/superadmin" method="post">
                    <input type="hidden" name="__action" value="media-supprimer" />
                    <input type="hidden" name="__id" value={String(m.id)} />
                    <button type="submit" className="text-red-600 hover:text-red-700" title="Supprimer">
                      <Icon i="trash-2" size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {liste.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun média. Importez des images ci-dessus.</p>
      )}
    </div>
  );
}

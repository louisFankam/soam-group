import Link from "next/link";
import { db } from "@/lib/db";
import { menus } from "@/lib/schema";
import type { TypeMenuRow } from "@/lib/cms-data";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

function RenduMenu({ menu, nouveau }: { menu: TypeMenuRow | null; nouveau: boolean }) {
  const items = (menu?.items as { label: string; url: string }[] | undefined) ?? [];
  return (
    <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
      <input type="hidden" name="__action" value="menu-enregistrer" />
      <input type="hidden" name="__id" value={nouveau ? "nouveau" : String(menu!.id)} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Titre <span className="text-red-500">*</span></label>
          <input name="title" required defaultValue={menu?.title ?? ""} className={inputCls} placeholder="ex: Menu principal" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Emplacement</label>
          <select name="location" defaultValue={menu?.location ?? "header"} className={inputCls}>
            <option value="header">En-tête (header)</option>
            <option value="footer">Pied de page (footer)</option>
          </select>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Liens du menu (réordonnables ci-dessous) :</p>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <input name="items_label" defaultValue={it.label} placeholder="Libellé" className={inputCls} />
              <input name="items_url" defaultValue={it.url} placeholder="/chemin" className={inputCls} />
            </div>
          ))}
          <div className="flex gap-2">
            <input name="items_label" placeholder="Libellé (nouveau)" className={inputCls} />
            <input name="items_url" placeholder="/chemin (nouveau)" className={inputCls} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Laissez le libellé vide pour supprimer un lien. Ajoutez une ligne vide pour créer un nouveau lien.</p>
      </div>

      <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">
        Enregistrer le menu
      </button>
    </form>
  );
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; nouveau?: string; ok?: string }>;
}) {
  const { edit, nouveau, ok } = await searchParams;
  const liste = await db.select().from(menus);
  const idEdit = edit ? Number(edit) : null;
  const courant = idEdit !== null && Number.isFinite(idEdit)
    ? liste.find((m) => m.id === idEdit) ?? null
    : null;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headings font-bold text-xl text-foreground">Menus</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gérez les menus d&apos;en-tête et de pied de page.</p>
        </div>
        <Link href="/superadmin/menu?nouveau=1" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl">
          + Nouveau menu
        </Link>
      </div>

      {ok && (
        <p className="rounded-xl bg-accent-green/10 border border-accent-green/30 text-foreground text-sm px-4 py-3">Enregistré ✓</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {liste.map((m) => (
          <div key={m.id} className="bg-card border border-card-border rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">{m.title}</p>
            <p className="text-xs text-muted-foreground capitalize">{m.location === "header" ? "En-tête" : "Pied de page"} — {(m.items as unknown[]).length} lien(s)</p>
            <div className="flex gap-2">
              <Link href={`/superadmin/menu?edit=${m.id}`} className="text-sm text-primary hover:underline">Éditer</Link>
              <form action="/api/superadmin" method="post">
                <input type="hidden" name="__action" value="menu-supprimer" />
                <input type="hidden" name="__id" value={String(m.id)} />
                <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
              </form>
            </div>
          </div>
        ))}
        {liste.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">Aucun menu. Créez-en un.</p>
        )}
      </div>

      {(nouveau || courant) && (
        <RenduMenu menu={courant} nouveau={Boolean(nouveau)} />
      )}
    </div>
  );
}

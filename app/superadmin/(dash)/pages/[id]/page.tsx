import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { pages, sections } from "@/lib/schema";
import { TYPES_SECTIONS, getTypeSection } from "@/lib/section-types";
import Icon from "@/components/ui";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: brutId } = await params;
  const nouveau = brutId === "nouveau";
  let page: Record<string, unknown> = {};
  if (!nouveau) {
    const num = Number(brutId);
    if (!Number.isFinite(num)) notFound();
    const p = await db.select().from(pages).where(eq(pages.id, num)).get();
    if (!p) notFound();
    page = p as Record<string, unknown>;
  }

  const sectionsPage = nouveau
    ? []
    : await db.select().from(sections).where(eq(sections.pageId, Number(page.id))).orderBy(asc(sections.orderColumn));

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/superadmin/pages" className="text-sm text-primary hover:underline">← Pages</Link>
      <h1 className="font-headings font-bold text-xl text-foreground -mt-3">
        {nouveau ? "Nouvelle page" : `Page — ${String(page.title ?? "")}`}
      </h1>

      {/* Formulaire page */}
      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
        <input type="hidden" name="__action" value="page-enregistrer" />
        <input type="hidden" name="__id" value={brutId} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Titre <span className="text-red-500">*</span></label>
            <input name="title" required defaultValue={String(page.title ?? "")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Slug <span className="text-red-500">*</span></label>
            <input name="slug" required defaultValue={String(page.slug ?? "")} className={inputCls} placeholder="ex: a-propos" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Ordre dans le menu</label>
            <input name="menuOrder" type="number" defaultValue={String(page.menuOrder ?? 0)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Template</label>
            <select name="template" defaultValue={String(page.template ?? "standard")} className={inputCls}>
              <option value="standard">Standard (sections)</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" defaultChecked={page.isPublished !== false} className="w-4 h-4 accent-[#1a4fbd]" /> Publiée</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="isHomepage" defaultChecked={Boolean(page.isHomepage)} className="w-4 h-4 accent-[#1a4fbd]" /> Page d&apos;accueil</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="showInMenu" defaultChecked={page.showInMenu !== false} className="w-4 h-4 accent-[#1a4fbd]" /> Afficher dans le menu</label>
        </div>
        <details className="border border-card-border rounded-xl p-4">
          <summary className="text-sm font-medium text-foreground cursor-pointer">SEO & classes avancées</summary>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <input name="metaTitle" defaultValue={String(page.metaTitle ?? "")} placeholder="Meta title" className={inputCls} />
            <input name="metaDescription" defaultValue={String(page.metaDescription ?? "")} placeholder="Meta description" className={inputCls} />
            <input name="metaKeywords" defaultValue={String(page.metaKeywords ?? "")} placeholder="Meta keywords" className={inputCls} />
            <input name="cssClasses" defaultValue={String(page.cssClasses ?? "")} placeholder="Classes CSS" className={inputCls} />
          </div>
        </details>
        <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">
          Enregistrer la page
        </button>
      </form>

      {/* Sections */}
      {!nouveau && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headings font-semibold text-lg text-foreground">Sections ({sectionsPage.length})</h2>
          </div>

          {sectionsPage.length > 0 && (
            <ul className="space-y-2">
              {sectionsPage.map((s, i) => {
                const type = getTypeSection(s.sectionType);
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 bg-card border border-card-border rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-muted-foreground w-6 shrink-0">#{i + 1}</span>
                      <Icon i={type?.icone ?? "layout"} size={16} className="text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {s.title || (type?.nom ?? s.sectionType)}
                          {!s.isVisible && <span className="ml-2 text-[10px] uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Masquée</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{type?.nom ?? s.sectionType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link href={`/superadmin/pages/${page.id}/sections/${s.id}`} className="text-sm text-primary hover:underline">Éditer</Link>
                      <form action="/api/superadmin" method="post">
                        <input type="hidden" name="__action" value="section-supprimer" />
                        <input type="hidden" name="__id" value={String(s.id)} />
                        <input type="hidden" name="__pageId" value={String(page.id)} />
                        <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="bg-card border border-card-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Ajouter une section</h3>
            <form action="/api/superadmin" method="post" className="flex flex-wrap gap-2">
              <input type="hidden" name="__action" value="section-ajouter" />
              <input type="hidden" name="__pageId" value={String(page.id)} />
              <select name="__sectionType" className={inputCls} style={{ maxWidth: "18rem" }}>
                {TYPES_SECTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
              <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl">
                + Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sections, pages } from "@/lib/schema";
import { getTypeSection } from "@/lib/section-types";
import { RenduChamp } from "@/components/superadmin/AdminChampSection";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ id: string; sid: string }>;
}) {
  const { id: pageIdRaw, sid } = await params;
  const pageId = Number(pageIdRaw);
  if (!Number.isFinite(pageId)) notFound();
  const page = await db.select().from(pages).where(eq(pages.id, pageId)).get();
  if (!page) notFound();

  const num = Number(sid);
  if (!Number.isFinite(num)) notFound();
  const section = await db.select().from(sections).where(eq(sections.id, num)).get();
  if (!section) notFound();

  const type = getTypeSection(section.sectionType);
  if (!type) notFound();
  const content = section.content as Record<string, unknown>;
  const settings = section.settings as Record<string, unknown>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href={`/superadmin/pages/${pageId}`} className="text-sm text-primary hover:underline">
        ← {page.title || "La page"}
      </Link>
      <h1 className="font-headings font-bold text-xl text-foreground -mt-3">
        {type.nom}
        <span className="block text-sm font-normal text-muted-foreground mt-1">{type.description}</span>
      </h1>

      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-5">
        <input type="hidden" name="__action" value="section-enregistrer" />
        <input type="hidden" name="__id" value={String(section.id)} />
        <input type="hidden" name="__pageId" value={String(pageId)} />
        <input type="hidden" name="__sectionType" value={section.sectionType} />

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Titre de la section</label>
            <input name="c_title" defaultValue={section.title} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Sous-titre</label>
            <textarea name="c_subtitle" rows={2} defaultValue={section.subtitle} className={inputCls} />
          </div>
        </div>

        {type.champs
          .filter((c) => c.nom !== "title" && c.nom !== "subtitle")
          .map((champ) => (
            <RenduChamp key={champ.nom} prefix="c" champ={champ} valeur={content[champ.nom]} />
          ))}

        <div className="border-t border-card-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Paramètres d&apos;affichage</h3>
          {type.parametres.map((p) => (
            <RenduChamp key={p.nom} prefix="s" champ={{ ...p, type: p.type }} valeur={settings[p.nom]} />
          ))}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Classes CSS</label>
              <input name="cssClasses" defaultValue={section.cssClasses} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Animation</label>
              <input name="animation" defaultValue={section.animation} className={inputCls} />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm mt-4">
            <input type="checkbox" name="isVisible" defaultChecked={section.isVisible} className="w-4 h-4 accent-[#1a4fbd]" />
            Section visible sur le site
          </label>
        </div>

        <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">
          Enregistrer la section
        </button>
      </form>
    </div>
  );
}

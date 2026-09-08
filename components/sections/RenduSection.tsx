import Link from "next/link";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "@/lib/db";
import { services as servicesTable, temoignages as temoignagesTable, faqs, membresEquipe, posts, produits, projets, documents as documentsTable, clientsPartenaires, sections } from "@/lib/schema";
import { eq } from "drizzle-orm";

type Section = InferSelectModel<typeof sections>;

type Item = Record<string, string | number | boolean | null | string[] | undefined>;
type Content = Record<string, string | number | boolean | null | string[] | Item[] | undefined>;

function val(v: unknown): string { return String(v ?? ""); }
function truthy(v: unknown): boolean { return v != null && String(v) !== "" && v !== false; }

const PAD_MAP: Record<string, string> = {
  xs: "py-6", sm: "py-10", md: "py-16", lg: "py-24", xl: "py-32",
};

const FOND_MAP: Record<string, string> = {
  clair: "bg-white", creme: "bg-[#fdf8f0]", sombre: "bg-hero-dark text-white",
  accent: "bg-primary text-white", aucun: "",
};

const COL_MAP: Record<string, string> = {
  "2": "grid-cols-1 sm:grid-cols-2", "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const HAUTEUR_MAP: Record<string, string> = {
  sm: "min-h-[320px]", md: "min-h-[480px]", lg: "min-h-[600px]", plein: "min-h-screen",
};

function badge(text: string | undefined) {
  if (!text) return null;
  return <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">{text}</span>;
}

function SousTitre({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <>
      {title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{title}</h2>}
      {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{subtitle}</p>}
    </>
  );
}

async function fetchModuleData(source: string, moduleType: string): Promise<Record<string, unknown>[]> {
  if (source !== "module") return [];
  switch (moduleType) {
    case "services_grid": return (await db.select().from(servicesTable).where(eq(servicesTable.isActive, true))) as unknown as Record<string, unknown>[];
    case "temoignages": return (await db.select().from(temoignagesTable).where(eq(temoignagesTable.isActive, true))) as unknown as Record<string, unknown>[];
    case "faq": return (await db.select().from(faqs).where(eq(faqs.isActive, true))) as unknown as Record<string, unknown>[];
    case "equipe": return (await db.select().from(membresEquipe).where(eq(membresEquipe.isActive, true))) as unknown as Record<string, unknown>[];
    case "products_grid": return (await db.select().from(produits).where(eq(produits.isActive, true))) as unknown as Record<string, unknown>[];
    case "projets_grid": return (await db.select().from(projets).where(eq(projets.isPublished, true))) as unknown as Record<string, unknown>[];
    case "clients_logos": return (await db.select().from(clientsPartenaires).where(eq(clientsPartenaires.isActive, true))) as unknown as Record<string, unknown>[];
    default: return [];
  }
}

export async function RenduSection({ section }: { section: Section }) {
  const c = (section.content ?? {}) as Record<string, unknown>;
  const cv = c as Record<string, React.ReactNode>;
  const s = (section.settings ?? {}) as Record<string, unknown>;
  const pad = PAD_MAP[String(s.paddingY ?? "md")] ?? "py-16";
  const fond = FOND_MAP[String(s.fond ?? "clair")] ?? "";
  const cols = COL_MAP[String(s.colonnes ?? "3")] ?? COL_MAP["3"];

  const sectionId = `section-${section.id}`;

  const wrapper = (cls: string, children: React.ReactNode) => (
    <section id={sectionId} className={`${pad} ${fond} ${cls} ${section.cssClasses ?? ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );

  switch (section.sectionType) {
    case "hero": {
      const hauteur = HAUTEUR_MAP[String(s.hauteur ?? "md")] ?? HAUTEUR_MAP.md;
      const overlay = String(s.overlay ?? "0.5");
      const centrer = s.centrer !== false;
      const img = String(c.imageFondUrl ?? "");
      return (
        <section id={sectionId} className={`relative ${hauteur} flex items-center ${centrer ? "justify-center text-center" : "justify-start"} overflow-hidden ${section.cssClasses ?? ""}`}>
          {img && <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover hero-zoom" />}
          <div className="absolute inset-0 bg-black" style={{ opacity: Number(overlay) || 0.5 }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            {badge(String(c.badge ?? ""))}
            {cv.title && <h1 className="font-headings font-bold text-3xl md:text-5xl lg:text-6xl mb-4">{String(c.title)}</h1>}
            {cv.subtitle && <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">{String(c.subtitle)}</p>}
            <div className="flex flex-wrap gap-4 justify-center">
              {cv.boutonPrimaire && <Link href={String(c.boutonPrimaireUrl ?? "#")} className="bg-primary hover:bg-primary-deep text-white font-semibold px-6 py-3 rounded-xl transition-colors">{String(c.boutonPrimaire)}</Link>}
              {cv.boutonSecondaire && <Link href={String(c.boutonSecondaireUrl ?? "#")} className="border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors">{String(c.boutonSecondaire)}</Link>}
            </div>
          </div>
        </section>
      );
    }

    case "text_with_image": {
      const pos = String(s.positionImage ?? "droite");
      const textBlock = (
        <div className="space-y-4">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground">{section.subtitle}</p>}
          {cv.texte && <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: String(c.texte) }} />}
        </div>
      );
      const imgBlock = c.imageUrl ? (
        <img src={String(c.imageUrl)} alt={section.title ?? ""} className="rounded-2xl w-full object-cover" />
      ) : null;
      return wrapper("", (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${pos === "gauche" ? "" : ""}`}>
          {pos === "gauche" ? <>{imgBlock}{textBlock}</> : <>{textBlock}{imgBlock}</>}
        </div>
      ));
    }

    case "services_grid":
    case "temoignages":
    case "equipe":
    case "faq":
    case "products_grid":
    case "projets_grid":
    case "clients_logos": {
      const source = String(c.source ?? "manuel");
      const itemsRaw = Array.isArray(c.items) ? c.items : [];
      let items = itemsRaw as Record<string, unknown>[];
      if (source === "module") {
        items = await fetchModuleData(source, section.sectionType);
      }
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`grid ${cols} gap-6`}>
            {items.map((item, i) => (
              <CardItem key={i} sectionType={section.sectionType} item={item} style={String(s.style ?? "")} />
            ))}
          </div>
          {items.length === 0 && <p className="text-muted-foreground text-sm">Aucun élément configuré.</p>}
        </div>
      ));
    }

    case "statistiques": {
      const items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
      return wrapper("text-center", (
        <div>
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`grid ${cols} gap-8`}>
            {items.map((item, i) => (
              <div key={i} className="text-center">
                {(item as Record<string, React.ReactNode>).icone && <div className="text-3xl mb-2">{String(item.icone)}</div>}
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{String(item.valeur ?? "0")}</div>
                <div className="text-sm text-muted-foreground">{String(item.label ?? "")}</div>
              </div>
            ))}
          </div>
        </div>
      ));
    }

    case "galerie": {
      const images = (Array.isArray(c.images) ? c.images : []) as string[];
      const arrondi = String(s.arrondi ?? "lg");
      const radiusMap: Record<string, string> = { aucun: "", md: "rounded-lg", lg: "rounded-2xl", plein: "rounded-full" };
      const radius = radiusMap[arrondi] ?? "rounded-2xl";
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`grid ${cols} gap-4`}>
            {images.map((url, i) => (
              <img key={i} src={url} alt={`Image ${i + 1}`} className={`w-full aspect-square object-cover ${radius}`} />
            ))}
          </div>
          {images.length === 0 && <p className="text-muted-foreground text-sm">Aucune image.</p>}
        </div>
      ));
    }

    case "cta": {
      const taille = String(s.taille ?? "md");
      const padMap: Record<string, string> = { sm: "py-12", md: "py-20", lg: "py-28" };
      return (
        <section id={sectionId} className={`${padMap[taille] ?? padMap.md} relative overflow-hidden cta-gradient ${section.cssClasses ?? ""}`}>
          {cv.imageFondUrl && <img src={String(c.imageFondUrl)} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            {cv.title && <h2 className="font-headings font-bold text-2xl md:text-3xl mb-3">{String(c.title)}</h2>}
            {cv.subtitle && <p className="text-white/80 mb-8">{String(c.subtitle)}</p>}
            {cv.boutonTexte && <Link href={String(c.boutonUrl ?? "#")} className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">{String(c.boutonTexte)}</Link>}
          </div>
        </section>
      );
    }

    case "contact_form":
      return wrapper("", (
        <div className="max-w-3xl mx-auto text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground mb-8">{section.subtitle}</p>}
          <form action="/api/contact" method="post" className="text-left bg-card border border-card-border rounded-2xl p-6 space-y-4">
            <input name="nom" placeholder="Nom complet" required className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <input name="email" type="email" placeholder="Email" required className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <input name="telephone" placeholder="Téléphone (optionnel)" className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <input name="sujet" placeholder="Sujet" className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <textarea name="message" rows={5} placeholder="Votre message" required className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm">Envoyer le message</button>
          </form>
        </div>
      ));

    case "custom_form": {
      const champs = (Array.isArray(c.champs) ? c.champs : []) as Record<string, unknown>[];
      return wrapper("", (
        <div className="max-w-3xl mx-auto text-center">
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground mb-8">{section.subtitle}</p>}
          <form action="/api/contact" method="post" className="text-left bg-card border border-card-border rounded-2xl p-6 space-y-4">
            <input type="hidden" name="source" value="formulaire-personnalise" />
            {champs.map((ch, i) => {
              const label = String(ch.label ?? "");
              const type = String(ch.type ?? "texte");
              const obligatoire = ch.obligatoire === true || ch.obligatoire === "1";
              if (type === "textarea") {
                return <textarea key={i} name={`champ_${i}`} placeholder={label} required={obligatoire} rows={4} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />;
              }
              if (type === "select") {
                const opts = String(ch.options ?? "").split(",").map((o) => o.trim()).filter(Boolean);
                return (
                  <select key={i} name={`champ_${i}`} required={obligatoire} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm">
                    <option value="">{label}</option>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                );
              }
              return <input key={i} name={`champ_${i}`} type={type === "email" ? "email" : "text"} placeholder={label} required={obligatoire} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm" />;
            })}
            <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm">Envoyer</button>
          </form>
        </div>
      ));
    }

    case "custom_html":
      return c.code ? (
        <section id={sectionId} className={`${pad} ${fond} ${section.cssClasses ?? ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: String(c.code) }} />
        </section>
      ) : null;

    case "video": {
      let embedUrl = String(c.url ?? "");
      if (embedUrl.includes("youtube.com/watch")) {
        const vid = new URL(embedUrl).searchParams.get("v");
        if (vid) embedUrl = `https://www.youtube.com/embed/${vid}`;
      } else if (embedUrl.includes("youtu.be/")) {
        embedUrl = `https://www.youtube.com/embed/${embedUrl.split("youtu.be/")[1]}`;
      } else if (embedUrl.includes("vimeo.com/")) {
        embedUrl = `https://player.vimeo.com/video/${embedUrl.split("vimeo.com/")[1]}`;
      }
      return wrapper("", (
        <div className="text-center">
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{section.subtitle}</p>}
          {embedUrl && (
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%" }}>
              <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen title={section.title ?? "Vidéo"} />
            </div>
          )}
        </div>
      ));
    }

    case "carte":
      return wrapper("", (
        <div>
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3 text-center">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground mb-8 text-center">{section.subtitle}</p>}
          {c.lien ? (
            <iframe src={String(c.lien)} className="w-full h-96 rounded-2xl border border-card-border" allowFullScreen loading="lazy" title={section.title ?? "Carte"} />
          ) : c.adresse ? (
            <div className="bg-muted rounded-2xl h-96 flex items-center justify-center text-muted-foreground">
              <p>{String(c.adresse)}</p>
            </div>
          ) : null}
        </div>
      ));

    case "newsletter":
      return wrapper("text-center", (
        <div className="max-w-xl mx-auto">
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground mb-6">{section.subtitle}</p>}
          <form action="/api/contact" method="post" className="flex gap-3 max-w-md mx-auto">
            <input type="hidden" name="source" value="newsletter" />
            <input name="email" type="email" placeholder="Votre email" required className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm" />
            <button type="submit" className="bg-primary hover:bg-primary-deep transition-colors text-white font-semibold px-5 py-3 rounded-xl text-sm whitespace-nowrap">
              {String(c.boutonTexte ?? "S'abonner")}
            </button>
          </form>
        </div>
      ));

    case "social_links": {
      const liens = [
        { url: c.facebook, label: "Facebook" },
        { url: c.twitter, label: "Twitter / X" },
        { url: c.linkedin, label: "LinkedIn" },
        { url: c.instagram, label: "Instagram" },
        { url: c.youtube, label: "YouTube" },
      ].filter((l) => l.url);
      return wrapper("text-center", (
        <div>
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-6">{section.title}</h2>}
          <div className="flex flex-wrap gap-4 justify-center">
            {liens.map((l) => (
              <a key={l.label} href={String(l.url)} target="_blank" rel="noopener noreferrer" className="bg-card border border-card-border rounded-xl px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
      ));
    }

    case "documents": {
      const source = String(c.source ?? "manuel");
      let items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
      if (source === "module") {
        items = (await db.select().from(documentsTable).where(eq(documentsTable.isActive, true))) as unknown as Record<string, unknown>[];
      }
      return wrapper("", (
        <div className="text-center">
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{section.subtitle}</p>}
          <div className="space-y-3 max-w-2xl mx-auto">
            {items.map((item, i) => (
              <a key={i} href={String(item.fileUrl ?? item.url ?? "#")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-card border border-card-border rounded-xl p-4 hover:bg-secondary transition-colors text-left">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">📄</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{String(item.title ?? item.nom ?? "Document")}</p>
                  {(item as Record<string, React.ReactNode>).description && <p className="text-xs text-muted-foreground truncate">{String(item.description)}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>
      ));
    }

    case "chronologie": {
      const items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {items.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 z-10">{i + 1}</div>
                  <div className="flex-1 bg-card border border-card-border rounded-xl p-5 text-left">
                    {(item as Record<string, React.ReactNode>).date && <p className="text-xs text-primary font-semibold mb-1">{String(item.date)}</p>}
                    {(item as Record<string, React.ReactNode>).title && <p className="text-sm font-semibold text-foreground">{String(item.title)}</p>}
                    {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground mt-1">{String(item.description)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    }

    case "fonctionnalites": {
      const items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
      const layout = String(s.layout ?? "cartes");
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`${layout === "liste" ? "space-y-4 max-w-3xl mx-auto" : `grid ${cols} gap-6`}`}>
            {items.map((item, i) => (
              <div key={i} className={`bg-card border border-card-border rounded-2xl p-5 text-left ${layout === "liste" ? "flex items-start gap-4" : ""}`}>
                {(item as Record<string, React.ReactNode>).icone && <div className="text-2xl mb-2 shrink-0">{String(item.icone)}</div>}
                <div>
                  {(item as Record<string, React.ReactNode>).title && <p className="text-sm font-semibold text-foreground mb-1">{String(item.title)}</p>}
                  {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground">{String(item.description)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ));
    }

    case "tarifs": {
      const items = (Array.isArray(c.items) ? c.items : []) as Record<string, unknown>[];
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`grid ${cols} gap-6 max-w-5xl mx-auto`}>
            {items.map((item, i) => (
              <div key={i} className={`bg-card border rounded-2xl p-6 text-left ${(item as Record<string, React.ReactNode>).misEnAvant ? "border-primary ring-2 ring-primary/20" : "border-card-border"}`}>
                {(item as Record<string, React.ReactNode>).nom && <h3 className="font-headings font-bold text-lg text-foreground mb-2">{String(item.nom)}</h3>}
                {(item as Record<string, React.ReactNode>).prix && (
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">{String(item.prix)}</span>
                    {(item as Record<string, React.ReactNode>).devise && <span className="text-sm text-muted-foreground ml-1">{String(item.devise)}</span>}
                    {(item as Record<string, React.ReactNode>).periode && <span className="text-sm text-muted-foreground">{String(item.periode)}</span>}
                  </div>
                )}
                {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground mb-4">{String(item.description)}</p>}
                {(item as Record<string, React.ReactNode>).caracteristiques && (
                  <ul className="space-y-2 mb-6">
                    {String(item.caracteristiques).split("\n").filter(Boolean).map((f, j) => (
                      <li key={j} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-accent-green mt-0.5">✓</span> {f.trim()}
                      </li>
                    ))}
                  </ul>
                )}
                {(item as Record<string, React.ReactNode>).boutonTexte && <Link href={String(item.boutonUrl ?? "#")} className={`block text-center font-semibold text-sm px-5 py-3 rounded-xl transition-colors ${(item as Record<string, React.ReactNode>).misEnAvant ? "bg-primary text-white hover:bg-primary-deep" : "bg-secondary text-primary hover:bg-secondary/70"}`}>{String(item.boutonTexte)}</Link>}
              </div>
            ))}
          </div>
        </div>
      ));
    }

    case "blog_posts_grid": {
      const cats = String(c.categorie ?? "");
      let query = db.select().from(posts).where(eq(posts.isPublished, true));
      const allPosts = await query;
      const filtered = cats ? allPosts.filter((p) => String(p.categoryId ?? "") === cats) : allPosts;
      const maxItems = Number(s.colonnes ?? 3) * 2;
      return wrapper("", (
        <div className="text-center">
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto mb-10">{section.subtitle}</p>}
          <div className={`grid ${cols} gap-6`}>
            {filtered.slice(0, maxItems).map((post) => (
              <Link key={post.id} href={`/actualites/${post.slug}`} className="bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow text-left">
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full aspect-video object-cover" />}
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-1">{post.title}</p>
                  {post.excerpt && <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ));
    }

    default:
      return wrapper("text-center", (
        <div>
          {badge(String(c.badge ?? ""))}
          {section.title && <h2 className="font-headings font-bold text-2xl md:text-3xl text-foreground mb-3">{section.title}</h2>}
          {section.subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{section.subtitle}</p>}
          <p className="text-xs text-muted-foreground mt-4 italic">Type de section « {section.sectionType} » non pris en charge pour l&apos;affichage public.</p>
        </div>
      ));
  }
}

function CardItem({ sectionType, item, style }: { sectionType: string; item: Record<string, unknown>; style: string }) {
  const iv = item as Record<string, React.ReactNode>;
  switch (sectionType) {
    case "services_grid":
      return (
        <div className="bg-card border border-card-border rounded-2xl p-6 text-left hover:shadow-md transition-shadow">
          {(item as Record<string, React.ReactNode>).icon && <div className="text-3xl mb-3">{String(item.icon)}</div>}
          {(item as Record<string, React.ReactNode>).title && <h3 className="font-headings font-semibold text-foreground mb-2">{String(item.title)}</h3>}
          {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground">{String(item.description)}</p>}
        </div>
      );
    case "temoignages":
      return (
        <div className="bg-card border border-card-border rounded-2xl p-6 text-left">
          {(item as Record<string, React.ReactNode>).content && <p className="text-sm text-foreground mb-4 italic">« {String(item.content)} »</p>}
          <div className="flex items-center gap-3">
            {(item as Record<string, React.ReactNode>).imageUrl && <img src={String(item.imageUrl)} alt="" className="w-10 h-10 rounded-full object-cover" />}
            <div>
              {(item as Record<string, React.ReactNode>).name && <p className="text-sm font-semibold text-foreground">{String(item.name)}</p>}
              {(item as Record<string, React.ReactNode>).role && <p className="text-xs text-muted-foreground">{String(item.role)}{(item as Record<string, React.ReactNode>).company ? ` — ${String(item.company)}` : ""}</p>}
            </div>
          </div>
        </div>
      );
    case "equipe":
      return (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden text-center">
          {(item as Record<string, React.ReactNode>).imageUrl && <img src={String(item.imageUrl)} alt={String(item.nom ?? "")} className="w-full aspect-square object-cover" />}
          <div className="p-5">
            {(item as Record<string, React.ReactNode>).nom && <h3 className="font-headings font-semibold text-foreground mb-1">{String(item.nom)}</h3>}
            {(item as Record<string, React.ReactNode>).role && <p className="text-xs text-primary font-medium">{String(item.role)}</p>}
            {(item as Record<string, React.ReactNode>).bio && <p className="text-sm text-muted-foreground mt-2">{String(item.bio)}</p>}
          </div>
        </div>
      );
    case "faq":
      return (
        <details className="bg-card border border-card-border rounded-xl p-5 text-left group">
          <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
            {String(item.question ?? "")}
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
          </summary>
          {(item as Record<string, React.ReactNode>).answer && <p className="text-sm text-muted-foreground mt-3">{String(item.answer)}</p>}
        </details>
      );
    case "products_grid":
      return (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          {(item as Record<string, React.ReactNode>).imageUrl && <img src={String(item.imageUrl)} alt={String(item.name ?? "")} className="w-full aspect-square object-cover" />}
          <div className="p-5">
            {(item as Record<string, React.ReactNode>).name && <h3 className="font-headings font-semibold text-foreground mb-1">{String(item.name)}</h3>}
            {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground line-clamp-2">{String(item.description)}</p>}
            {(item as Record<string, React.ReactNode>).price && <p className="text-lg font-bold text-primary mt-2">{Number(item.price).toLocaleString("fr-FR")} FCFA</p>}
          </div>
        </div>
      );
    case "projets_grid":
      return (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          {(item as Record<string, React.ReactNode>).imageUrl && <img src={String(item.imageUrl)} alt={String(item.title ?? "")} className="w-full aspect-video object-cover" />}
          <div className="p-5">
            {(item as Record<string, React.ReactNode>).title && <h3 className="font-headings font-semibold text-foreground mb-1">{String(item.title)}</h3>}
            {(item as Record<string, React.ReactNode>).description && <p className="text-sm text-muted-foreground line-clamp-2">{String(item.description)}</p>}
          </div>
        </div>
      );
    case "clients_logos":
      return (
        <div className="flex items-center justify-center p-4">
          {(item as Record<string, React.ReactNode>).logoUrl ? (
            <img src={String(item.logoUrl)} alt={String(item.name ?? "")} className="max-h-16 object-contain" />
          ) : (
            <span className="text-sm text-muted-foreground">{String(item.name ?? "")}</span>
          )}
        </div>
      );
    default:
      return (
        <div className="bg-card border border-card-border rounded-xl p-5 text-left">
          <p className="text-sm text-foreground">{JSON.stringify(item).slice(0, 200)}</p>
        </div>
      );
  }
}

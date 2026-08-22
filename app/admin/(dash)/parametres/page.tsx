import { AdminChamp } from "@/components/admin/AdminChamp";
import { getParametres, type HeroData, type SiteInfo } from "@/lib/data";

const CHAMPS_SITE = [
  { nom: "name", label: "Nom" },
  { nom: "tagline", label: "Slogan" },
  { nom: "phone", label: "Téléphone" },
  { nom: "whatsapp", label: "WhatsApp" },
  { nom: "email", label: "Email" },
  { nom: "address", label: "Adresse" },
  { nom: "hours", label: "Horaires" },
].map((c) => ({ ...c, type: "text" as const, requis: true }));

const CLES_JSON = [
  "hero", "stats", "whyItems", "partners", "testimonials",
  "faqItems", "navLinks", "portfolioFilters", "contactSubjects", "featuredSolution",
  "titres",
];

const inputCls =
  "w-full bg-input border border-border focus:border-primary outline-none rounded-xl px-3.5 py-2.5 text-sm font-mono";

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string; cle?: string }>;
}) {
  const { ok, erreur } = await searchParams;
  const p = await getParametres();
  const site = p.site as SiteInfo;
  const hero = p.hero as HeroData;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-headings font-bold text-xl text-foreground">Paramètres</h1>

      {(ok || erreur) && (
        <p
          className={`rounded-xl border text-sm px-4 py-3 ${
            erreur
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-accent-green/10 border-accent-green/30 text-foreground"
          }`}
        >
          {erreur === "json" ? "JSON invalide — corrigez et réessayez." : "Enregistré ✓"}
        </p>
      )}

      {/* Coordonnées */}
      <form action="/api/admin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
        <input type="hidden" name="__action" value="parametres-site" />
        <h2 className="font-headings font-semibold text-base text-foreground">
          Coordonnées de l&rsquo;entreprise
        </h2>
        {CHAMPS_SITE.map((c) => (
          <AdminChamp key={c.nom} champ={c} valeur={site[c.nom as keyof SiteInfo]} />
        ))}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl"
        >
          Enregistrer les coordonnées
        </button>
      </form>

      {/* Image du héros */}
      <form action="/api/admin" method="post" encType="multipart/form-data" className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
        <input type="hidden" name="__action" value="parametres-hero-image" />
        <h2 className="font-headings font-semibold text-base text-foreground">
          Image du héros (accueil)
        </h2>
        {hero.imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.imageUrl} alt="" className="h-24 rounded-lg object-cover" />
            <p className="text-xs text-muted-foreground truncate">Actuelle : {hero.imageUrl}</p>
          </>
        )}
        <input
          type="file"
          name="imageUrl_fichier"
          accept="image/*"
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-secondary/70"
        />
        <p className="text-xs text-muted-foreground">Ou coller une URL (vide = image de secours picsum) :</p>
        <input
          name="imageUrl_url"
          defaultValue={hero.imageUrl ?? ""}
          placeholder="https://…"
          className={`${inputCls} font-sans`}
        />
        <button
          type="submit"
          className="border border-primary text-primary hover:bg-secondary transition-colors text-sm font-medium px-4 py-2 rounded-xl"
        >
          Enregistrer l&apos;image du héros
        </button>
      </form>

      {/* Blocs avancés */}
      <details className="bg-card border border-card-border rounded-2xl p-6">
        <summary className="font-headings font-semibold text-base text-foreground cursor-pointer">
          Blocs avancés (JSON)
        </summary>
        <p className="text-xs text-muted-foreground mt-2 mb-5">
          Édition directe du contenu structuré (hero, chiffres, FAQ, témoignages…). Format JSON strict.
        </p>
        <div className="space-y-6">
          {/* ponytail: les clés non seedées sont masquées plutôt que de faire planter la page */}
          {CLES_JSON.filter((cle) => p[cle] !== undefined).map((cle) => (
            <form key={cle} action="/api/admin" method="post" className="space-y-2">
              <input type="hidden" name="__action" value="parametres-json" />
              <input type="hidden" name="cle" value={cle} />
              <label className="block text-sm font-medium text-foreground">{cle}</label>
              <textarea
                name="json"
                rows={Math.min(10, Math.max(3, JSON.stringify(p[cle], null, 2).split("\n").length))}
                defaultValue={JSON.stringify(p[cle], null, 2)}
                className={`${inputCls} font-mono`}
              />
              <button
                type="submit"
                className="border border-primary text-primary hover:bg-secondary transition-colors text-sm font-medium px-4 py-2 rounded-xl"
              >
                Enregistrer « {cle} »
              </button>
            </form>
          ))}
        </div>
      </details>
    </div>
  );
}

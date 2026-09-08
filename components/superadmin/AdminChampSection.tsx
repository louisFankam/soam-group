import type { FieldDef } from "@/lib/section-types";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export function RenduChamp({
  prefix,
  champ,
  valeur,
  chemin,
}: {
  prefix: "c" | "s";
  champ: FieldDef;
  valeur: unknown;
  chemin?: string;
}) {
  const nom = chemin ?? `${prefix}_${champ.nom}`;
  const label = (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {champ.label}
      {champ.note && <span className="text-xs text-muted-foreground font-normal ml-1">({champ.note})</span>}
    </label>
  );

  if (champ.type === "texte" || champ.type === "couleur") {
    return (
      <div>
        {label}
        <input
          type={champ.type === "couleur" ? "color" : "text"}
          name={nom}
          defaultValue={typeof valeur === "string" ? String(valeur) : typeof valeur === "number" ? String(valeur) : ""}
          className={champ.type === "couleur" ? "w-14 h-11 rounded-xl border border-border bg-transparent p-1 cursor-pointer" : inputCls}
        />
      </div>
    );
  }

  if (champ.type === "nombre") {
    return (
      <div>
        {label}
        <input type="number" name={nom} defaultValue={String(valeur ?? 0)} className={`${inputCls} w-28`} />
      </div>
    );
  }

  if (champ.type === "booleen") {
    return (
      <div className="flex items-center gap-3">
        <input type="checkbox" name={nom} defaultChecked={Boolean(valeur)} className="w-5 h-5 accent-[#1a4fbd]" />
        <label className="text-sm font-medium text-foreground">{champ.label}</label>
      </div>
    );
  }

  if (champ.type === "select") {
    return (
      <div>
        {label}
        <select name={nom} defaultValue={String(valeur ?? champ.options?.[0]?.valeur ?? "")} className={inputCls}>
          {champ.options?.map((o) => (
            <option key={o.valeur} value={o.valeur}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (champ.type === "textaire" || champ.type === "wysiwyg") {
    return (
      <div>
        {label}
        <textarea name={nom} rows={champ.type === "wysiwyg" ? 5 : 3} defaultValue={typeof valeur === "string" ? String(valeur) : ""} className={inputCls} />
      </div>
    );
  }

  if (champ.type === "image") {
    return (
      <div>
        {label}
        <input type="text" name={nom} defaultValue={typeof valeur === "string" ? String(valeur) : ""} placeholder="https://…" className={inputCls} />
      </div>
    );
  }

  if (champ.type === "galerie") {
    const images = Array.isArray(valeur) ? (valeur as string[]) : [];
    return (
      <div>
        {label}
        {images.length === 0 && <p className="text-xs text-muted-foreground mb-2">Aucune image pour l&apos;instant.</p>}
        {images.map((img, i) => (
          <input key={i} type="text" name={`${nom}_${i}`} defaultValue={img} placeholder="https://…" className={`${inputCls} mb-2`} />
        ))}
        <input type="text" name={`${nom}_nouvelle`} placeholder="Coller une URL d'image puis enregistrer" className={inputCls} />
      </div>
    );
  }

  if (champ.type === "code") {
    return (
      <div>
        {label}
        <textarea name={nom} rows={6} defaultValue={typeof valeur === "string" ? String(valeur) : ""} className={`${inputCls} font-mono text-xs`} />
      </div>
    );
  }

  if (champ.type === "collection" && champ.champs) {
    const sousChamps = champ.champs;
    const items = Array.isArray(valeur) ? (valeur as Record<string, unknown>[]) : [{}];
    return (
      <div>
        {label}
        <div className="space-y-4">
          {items.map((item, i) => (
            <fieldset key={i} name={`${nom}_${i}`} className="border border-card-border rounded-xl p-4 space-y-3 bg-muted/40">
              <legend className="px-2 text-xs text-muted-foreground">Élément {i + 1}</legend>
              {sousChamps.map((sc) => (
                <RenduChamp key={sc.nom} prefix="c" champ={sc} valeur={(item as Record<string, unknown>)[sc.nom]} chemin={`${nom}_${i}_${sc.nom}`} />
              ))}
            </fieldset>
          ))}
          <div className="text-xs text-muted-foreground">
            Pour ajouter/modifier des éléments, utilisez l&apos;édition JSON avancée ci-dessous.
          </div>
        </div>
      </div>
    );
  }

  if (champ.type === "relation") {
    return (
      <div>
        {label}
        <input type="text" name={nom} defaultValue={String(valeur ?? "")} className={inputCls} placeholder="ID ou slug" />
      </div>
    );
  }

  return null;
}

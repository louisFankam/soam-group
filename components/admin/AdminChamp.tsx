import type { ChampSpec } from "@/lib/admin-entites";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export function AdminChamp({
  champ,
  valeur,
}: {
  champ: ChampSpec;
  valeur: unknown;
}) {
  const id = `champ-${champ.nom}`;

  if (champ.type === "image") {
    const url = typeof valeur === "string" ? valeur : "";
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
          {champ.label}
        </label>
        {url && (
          <p className="text-xs text-muted-foreground mb-2 truncate">
            Actuelle : {url}
          </p>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url && <img src={url} alt="" className="h-20 rounded-lg mb-2 object-cover" />}
        <input
          id={id}
          type="file"
          name={`${champ.nom}_fichier`}
          accept="image/*"
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-secondary/70"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Ou coller une URL :
        </p>
        <input
          name={`${champ.nom}_url`}
          defaultValue={url}
          placeholder="https://…"
          className={`${inputCls} mt-1`}
        />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {champ.label}
        {champ.requis && <span className="text-red-500"> *</span>}
      </label>
      {champ.type === "textarea" || champ.type === "liste" ? (
        <textarea
          id={id}
          name={champ.nom}
          required={champ.requis}
          rows={champ.type === "liste" ? 5 : 3}
          defaultValue={Array.isArray(valeur) ? (valeur as string[]).join("\n") : String(valeur ?? "")}
          className={inputCls}
        />
      ) : champ.type === "couleur" ? (
        <select id={id} name={champ.nom} defaultValue={String(valeur ?? "primary")} className={inputCls}>
          <option value="primary">Bleu</option>
          <option value="green">Vert</option>
          <option value="orange">Orange</option>
        </select>
      ) : champ.type === "booleen" ? (
        <input
          id={id}
          type="checkbox"
          name={champ.nom}
          defaultChecked={Boolean(valeur)}
          className="w-5 h-5 accent-[#1a4fbd]"
        />
      ) : (
        <input
          id={id}
          name={champ.nom}
          required={champ.requis}
          type={champ.type === "nombre" ? "number" : "text"}
          defaultValue={String(valeur ?? "")}
          className={inputCls}
        />
      )}
    </div>
  );
}

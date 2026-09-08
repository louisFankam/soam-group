import type { ChampSAC } from "@/lib/superadmin-entites";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export function AdminChampSuperadmin({
  champ,
  valeur,
}: {
  champ: ChampSAC;
  valeur: unknown;
}) {
  const id = `champ-${champ.nom}`;
  const requise = champ.requis && <span className="text-red-500"> *</span>;
  const label = (
    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
      {champ.label}
      {requise}
    </label>
  );

  if (champ.type === "image") {
    const url = typeof valeur === "string" ? valeur : "";
    return (
      <div>
        {label}
        {url && (
          <>
            <p className="text-xs text-muted-foreground mb-2 truncate">Actuelle : {url}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-20 rounded-lg mb-2 object-cover" />
          </>
        )}
        <input
          type="file"
          name={`${champ.nom}_fichier`}
          accept="image/*"
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-secondary/70"
        />
        <p className="text-xs text-muted-foreground mt-1">Ou coller une URL :</p>
        <input
          name={`${champ.nom}_url`}
          defaultValue={url}
          placeholder="https://…"
          className={`${inputCls} mt-1`}
        />
      </div>
    );
  }

  if (champ.type === "liste") {
    return (
      <div>
        {label}
        <textarea
          id={id}
          name={champ.nom}
          required={champ.requis}
          rows={4}
          defaultValue={Array.isArray(valeur) ? (valeur as string[]).join("\n") : String(valeur ?? "")}
          className={inputCls}
        />
        {champ.note && <p className="text-xs text-muted-foreground mt-1">{champ.note}</p>}
      </div>
    );
  }

  if (champ.type === "textaire") {
    return (
      <div>
        {label}
        <textarea
          id={id}
          name={champ.nom}
          required={champ.requis}
          rows={3}
          defaultValue={String(valeur ?? "")}
          className={inputCls}
        />
      </div>
    );
  }

  if (champ.type === "couleur") {
    return (
      <div>
        {label}
        <select id={id} name={champ.nom} defaultValue={String(valeur ?? "primary")} className={inputCls}>
          <option value="primary">Bleu</option>
          <option value="green">Vert</option>
          <option value="orange">Orange</option>
        </select>
      </div>
    );
  }

  if (champ.type === "booleen") {
    return (
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="checkbox"
          name={champ.nom}
          defaultChecked={Boolean(valeur)}
          className="w-5 h-5 accent-[#1a4fbd]"
        />
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {champ.label}
        </label>
      </div>
    );
  }

  if (champ.type === "select") {
    return (
      <div>
        {label}
        <select id={id} name={champ.nom} defaultValue={String(valeur ?? champ.options?.[0]?.valeur ?? "")} className={inputCls}>
          {champ.options?.map((o) => (
            <option key={o.valeur} value={o.valeur}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={id}
        name={champ.nom}
        required={champ.requis}
        type={champ.type === "nombre" ? "number" : champ.type === "email" ? "email" : "text"}
        defaultValue={String(valeur ?? "")}
        className={inputCls}
      />
    </div>
  );
}

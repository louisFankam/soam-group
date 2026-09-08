import type { DefChampParametre } from "@/lib/settings";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export function AdminChampParametre({
  champ,
  valeur,
}: {
  champ: DefChampParametre;
  valeur: unknown;
}) {
  const id = `p-${champ.cle}`;
  const label = (
    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
      {champ.label}
    </label>
  );

  if (champ.type === "booleen") {
    return (
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="checkbox"
          name={champ.cle}
          defaultChecked={Boolean(valeur)}
          className="w-5 h-5 accent-[#1a4fbd]"
        />
        <label htmlFor={id} className="text-sm font-medium text-foreground">{champ.label}</label>
      </div>
    );
  }

  if (champ.type === "couleur") {
    return (
      <div>
        {label}
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="color"
            name={champ.cle}
            defaultValue={String(valeur ?? champ.defaut ?? "#000000")}
            className="w-10 h-10 rounded-lg border border-border bg-transparent p-1 cursor-pointer"
          />
          <input
            type="text"
            name={`${champ.cle}_hex`}
            defaultValue={String(valeur ?? champ.defaut ?? "#000000")}
            className={`${inputCls} w-32`}
          />
        </div>
      </div>
    );
  }

  if (champ.type === "range") {
    const min = champ.min ?? 0;
    const max = champ.max ?? 100;
    return (
      <div>
        {label}
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="range"
            name={champ.cle}
            min={min}
            max={max}
            defaultValue={Number(valeur ?? champ.defaut ?? min)}
            className="accent-[#1a4fbd] flex-1"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {String(valeur ?? champ.defaut)}
          </span>
        </div>
      </div>
    );
  }

  if (champ.type === "select") {
    return (
      <div>
        {label}
        <select id={id} name={champ.cle} defaultValue={String(valeur ?? champ.defaut ?? "")} className={inputCls}>
          {champ.options?.map((o) => (
            <option key={o.valeur} value={o.valeur}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (champ.type === "textaire") {
    return (
      <div>
        {label}
        <textarea id={id} name={champ.cle} rows={3} defaultValue={String(valeur ?? "")} className={inputCls} />
        {champ.note && <p className="text-xs text-muted-foreground mt-1">{champ.note}</p>}
      </div>
    );
  }

  if (champ.type === "image") {
    const url = String(valeur ?? "");
    return (
      <div>
        {label}
        {url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-14 rounded-lg mb-2 object-contain bg-white border border-card-border" />
          </>
        )}
        <input
          type="file"
          name={`${champ.cle}_fichier`}
          accept="image/*"
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-secondary/70"
        />
        <input
          name={`${champ.cle}_url`}
          defaultValue={url}
          placeholder="Ou coller une URL https://…"
          className={`${inputCls} mt-2`}
        />
      </div>
    );
  }

  if (champ.type === "nombre") {
    return (
      <div>
        {label}
        <input
          id={id}
          name={champ.cle}
          type="number"
          defaultValue={String(valeur ?? champ.defaut ?? 0)}
          className={inputCls}
        />
      </div>
    );
  }

  return (
    <div>
      {label}
      <input id={id} name={champ.cle} defaultValue={String(valeur ?? "")} className={inputCls} />
      {champ.note && <p className="text-xs text-muted-foreground mt-1">{champ.note}</p>}
    </div>
  );
}

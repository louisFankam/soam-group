"use client";

import { useState } from "react";
import Icon from "@/components/ui";

const SECTEURS = [
  "Entreprises",
  "Administrations",
  "Santé",
  "Éducation",
  "ONG & Projets",
  "Commerce",
  "Autre",
];

const TRANCHES: Record<string, string[]> = {
  GNF: ["Moins de 10 M GNF", "10 – 50 M GNF", "50 – 200 M GNF", "Plus de 200 M GNF", "À discuter"],
  EUR: [
    "Moins de 1 000 €",
    "1 000 – 5 000 €",
    "5 000 – 20 000 €",
    "Plus de 20 000 €",
    "À discuter",
  ],
};

const ETAPES = ["Coordonnées", "Votre besoin", "Votre projet"];

const champ =
  "w-full rounded-xl border border-card-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary";
const label = "block text-sm font-semibold text-foreground mb-1.5";

export default function FormulaireDevis({ services }: { services: string[] }) {
  const [etape, setEtape] = useState(0);
  const [devise, setDevise] = useState("GNF");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const valider = () => {
    const f = document.forms[0] as HTMLFormElement;
    const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value?.trim() ?? "";
    const e: Record<string, string> = {};
    if (etape === 0) {
      if (!v("nom")) e.nom = "Votre nom complet est requis.";
      if (!v("telephone")) e.telephone = "Un numéro de téléphone est requis.";
      if (!v("email") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))
        e.email = "Une adresse email valide est requise.";
    }
    if (etape === 1) {
      if (!v("secteur")) e.secteur = "Sélectionnez votre secteur.";
      if (!v("service")) e.service = "Sélectionnez le service recherché.";
    }
    if (etape === 2 && v("description").length < 20)
      e.description = "Décrivez votre projet en quelques mots (20 caractères minimum).";
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const suivant = () => {
    if (!valider()) return;
    // ponytail: reporte le rendu de l'étape suivante après le clic en cours,
    // sinon le bouton "Envoyer" apparaît sous le curseur et encaisse le même clic.
    setTimeout(() => setEtape((n) => Math.min(n + 1, ETAPES.length - 1)), 0);
  };

  const Erreur = ({ nom }: { nom: string }) =>
    erreurs[nom] ? (
      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
        <Icon i="alert-circle" size={13} /> {erreurs[nom]}
      </p>
    ) : null;

  return (
    <form action="/api/devis" method="post" encType="multipart/form-data" noValidate>
      {/* Honeypot : invisible pour les humains */}
      <input type="text" name="siteWeb" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {/* Progression */}
      <ol className="flex items-center gap-2 mb-8">
        {ETAPES.map((t, n) => (
          <li key={t} className="flex-1">
            <button
              type="button"
              onClick={() => n < etape && setEtape(n)}
              className="w-full text-left disabled:cursor-default"
              disabled={n >= etape}
            >
              <span
                className={`h-1.5 rounded-full block transition-colors ${
                  n <= etape ? "bg-primary" : "bg-section-alt"
                }`}
              />
              <span
                className={`mt-2 block text-xs font-semibold ${
                  n === etape ? "text-primary" : n < etape ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {n + 1}. {t}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Étape 1 — Coordonnées */}
      <div hidden={etape !== 0} className="space-y-4">
        <div>
          <label htmlFor="nom" className={label}>
            Nom complet *
          </label>
          <input id="nom" name="nom" required placeholder="Ex. Aminata Traoré" className={champ} />
          <Erreur nom="nom" />
        </div>
        <div>
          <label htmlFor="organisation" className={label}>
            Organisation
          </label>
          <input id="organisation" name="organisation" placeholder="Nom de votre structure" className={champ} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="telephone" className={label}>
              Téléphone *
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              required
              placeholder="+226 XX XX XX XX"
              className={champ}
            />
            <Erreur nom="telephone" />
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Email *
            </label>
            <input id="email" name="email" type="email" required placeholder="vous@exemple.com" className={champ} />
            <Erreur nom="email" />
          </div>
        </div>
      </div>

      {/* Étape 2 — Besoin */}
      <div hidden={etape !== 1} className="space-y-4">
        <div>
          <label htmlFor="secteur" className={label}>
            Secteur d&apos;activité *
          </label>
          <select id="secteur" name="secteur" required defaultValue="" className={champ}>
            <option value="" disabled>
              — Sélectionner —
            </option>
            {SECTEURS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Erreur nom="secteur" />
        </div>
        <div>
          <label htmlFor="service" className={label}>
            Service recherché *
          </label>
          <select id="service" name="service" required defaultValue="" className={champ}>
            <option value="" disabled>
              — Sélectionner —
            </option>
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Erreur nom="service" />
        </div>

        <fieldset>
          <legend className={`${label} mb-2`}>Budget indicatif *</legend>
          <input type="radio" name="devise" value="GNF" checked={devise === "GNF"} onChange={() => setDevise("GNF")} className="sr-only" id="devise-gnf" />
          <input type="radio" name="devise" value="EUR" checked={devise === "EUR"} onChange={() => setDevise("EUR")} className="sr-only" id="devise-eur" />
          <div className="flex gap-2 mb-3">
            {["GNF", "EUR"].map((d) => (
              <label
                key={d}
                htmlFor={`devise-${d.toLowerCase()}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer border transition-colors ${
                  devise === d ? "bg-primary text-white border-primary" : "border-card-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {d === "GNF" ? "Franc guinéen" : "Euro"}
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {TRANCHES[devise].map((tranche, n) => {
              const valeur = tranche;
              return (
                <label
                  key={valeur}
                  className="flex items-center gap-2.5 rounded-xl border border-card-border px-4 py-3 text-sm cursor-pointer hover:border-primary/40 has-checked:border-primary has-checked:bg-primary/5 transition-colors"
                >
                  <input
                    type="radio"
                    name="budget"
                    value={valeur}
                    defaultChecked={n === 0}
                    required
                    className="accent-[var(--color-primary)]"
                  />
                  {valeur}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Étape 3 — Projet */}
      <div hidden={etape !== 2} className="space-y-4">
        <div>
          <label htmlFor="description" className={label}>
            Décrivez votre projet *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            placeholder="Contexte, objectifs, échéances souhaitées…"
            className={`${champ} resize-y`}
          />
          <Erreur nom="description" />
        </div>
        <div>
          <label htmlFor="fichier" className={label}>
            Joindre un fichier <span className="font-normal text-muted-foreground">(cahier des charges, devis… — optionnel)</span>
          </label>
          <input
            id="fichier"
            name="fichier"
            type="file"
            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/15 cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1.5">PDF ou document, 10 Mo maximum.</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-card-border">
        {etape > 0 ? (
          <button
            type="button"
            onClick={() => setEtape((n) => n - 1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon i="arrow-left" size={16} /> Retour
          </button>
        ) : (
          <span />
        )}
        {etape < ETAPES.length - 1 ? (
          <button
            type="button"
            onClick={suivant}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-deep text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Continuer <Icon i="arrow-right" size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-accent-green hover:bg-accent-green/90 text-white font-bold text-sm px-7 py-3 rounded-xl shadow-sm transition-colors"
          >
            Envoyer ma demande <Icon i="send" size={16} />
          </button>
        )}
      </div>
    </form>
  );
}

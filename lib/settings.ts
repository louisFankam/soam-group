// boala: Settings structurés (Phase 4). Un objet JSON stocké sous la clé
// "settings" des paramètres, organisé en groupes (general, contact, social,
// seo, footer, appearance, logo). Le superadmin les édite via /superadmin/parametres.
// Repli par défaut ici pour que le site ne casse pas avant le premier enregistrement.

export type TypeChampParametre =
  | "texte" | "textaire" | "booleen" | "couleur" | "select" | "nombre"
  | "image" | "range" | "json";

export type DefChampParametre = {
  cle: string;
  label: string;
  type: TypeChampParametre;
  defaut: string | number | boolean | Record<string, unknown> | null;
  options?: { valeur: string; label: string }[];
  note?: string;
  min?: number;
  max?: number;
};

export type GroupeSetting = {
  id: string;
  label: string;
  icone: string;
  description: string;
  champs: DefChampParametre[];
};

export const GROUPES_SETTINGS: GroupeSetting[] = [
  {
    id: "general",
    label: "Général",
    icone: "server",
    description: "Identité de base de l'entreprise.",
    champs: [
      { cle: "nom_site", label: "Nom du site", type: "texte", defaut: "SOAM GROUP" },
      { cle: "slogan", label: "Slogan", type: "texte", defaut: "Intégrateur technologique" },
      { cle: "description", label: "Description courte", type: "textaire", defaut: "Informatique, cybersécurité, logiciels métiers et énergie solaire." },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icone: "mail",
    description: "Coordonnées affichées dans le site et le pied de page.",
    champs: [
      { cle: "telephone", label: "Téléphone", type: "texte", defaut: "+226 25 33 44 55" },
      { cle: "whatsapp", label: "WhatsApp", type: "texte", defaut: "+226 70 00 00 00" },
      { cle: "email", label: "Email", type: "texte", defaut: "contact@soamgroup.net" },
      { cle: "adresse", label: "Adresse", type: "texte", defaut: "Ouagadougou, Burkina Faso" },
      { cle: "horaires", label: "Horaires", type: "texte", defaut: "Lun – Ven : 8h00 – 18h00" },
    ],
  },
  {
    id: "social",
    label: "Réseaux sociaux",
    icone: "users",
    description: "Liens vers vos réseaux sociaux.",
    champs: [
      { cle: "facebook", label: "Facebook", type: "texte", defaut: "" },
      { cle: "twitter", label: "Twitter / X", type: "texte", defaut: "" },
      { cle: "linkedin", label: "LinkedIn", type: "texte", defaut: "" },
      { cle: "instagram", label: "Instagram", type: "texte", defaut: "" },
      { cle: "youtube", label: "YouTube", type: "texte", defaut: "" },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    icone: "search",
    description: "Meta par défaut pour les pages dynamiques.",
    champs: [
      { cle: "meta_description", label: "Meta description par défaut", type: "textaire", defaut: "" },
      { cle: "meta_keywords", label: "Mots-clés (séparés par virgule)", type: "texte", defaut: "" },
      { cle: "indexation", label: "Autoriser l'indexation", type: "booleen", defaut: true },
    ],
  },
  {
    id: "footer",
    label: "Pied de page",
    icone: "layout",
    description: "Contenu du pied de page (édité ici et dans /superadmin/pied-de-page).",
    champs: [
      { cle: "texte", label: "Texte / à propos court", type: "textaire", defaut: "SOAM GROUP accompagne les entreprises et institutions dans leur transformation numérique." },
      { cle: "copyright", label: "Copyright", type: "texte", defaut: "© SOAM GROUP — Tous droits réservés" },
      { cle: "afficher_contact", label: "Afficher les coordonnées", type: "booleen", defaut: true },
      { cle: "afficher_social", label: "Afficher les réseaux sociaux", type: "booleen", defaut: true },
    ],
  },
  {
    id: "appearance",
    label: "Apparence",
    icone: "palette",
    description: "Couleurs et polices du site (appliquées en direct).",
    champs: [
      { cle: "couleur_principale", label: "Couleur principale", type: "couleur", defaut: "#1a4fbd" },
      { cle: "couleur_accent", label: "Couleur d'accent (vert)", type: "couleur", defaut: "#27ae60" },
      { cle: "couleur_secondaire", label: "Couleur secondaire (orange)", type: "couleur", defaut: "#e67e22" },
      { cle: "couleur_fond", label: "Couleur de fond", type: "couleur", defaut: "#ffffff" },
      { cle: "couleur_texte", label: "Couleur du texte", type: "couleur", defaut: "#0a0f1e" },
      { cle: "police_titres", label: "Police des titres", type: "select", defaut: "dm_sans", options: [
        { valeur: "dm_sans", label: "DM Sans" },
        { valeur: "inter", label: "Inter" },
        { valeur: "poppins", label: "Poppins" },
        { valeur: "playfair", label: "Playfair Display" },
      ]},
      { cle: "police_texte", label: "Police du texte", type: "select", defaut: "dm_sans", options: [
        { valeur: "dm_sans", label: "DM Sans" },
        { valeur: "inter", label: "Inter" },
        { valeur: "poppins", label: "Poppins" },
        { valeur: "playfair", label: "Playfair Display" },
      ]},
      { cle: "rayon_boutons", label: "Arrondi des boutons", type: "range", defaut: "12", min: 0, max: 32 },
      { cle: "espacement_sections", label: "Espacement vertical des sections", type: "select", defaut: "24px", options: [
        { valeur: "16px", label: "Compact" }, { valeur: "24px", label: "Moyen" },
        { valeur: "40px", label: "Espacé" }, { valeur: "64px", label: "Très espacé" },
      ]},
    ],
  },
  {
    id: "logo",
    label: "Logo",
    icone: "image",
    description: "Logo, taille et marges.",
    champs: [
      { cle: "url", label: "URL du logo", type: "image", defaut: "/logo.jpeg" },
      { cle: "largeur", label: "Largeur (px)", type: "nombre", defaut: "160" },
      { cle: "hauteur", label: "Hauteur (px)", type: "nombre", defaut: "48" },
      { cle: "marge_top", label: "Marge haut (px)", type: "nombre", defaut: "0" },
      { cle: "padding", label: "Padding (px)", type: "nombre", defaut: "0" },
    ],
  },
];

export type SettingsData = Record<string, Record<string, string | number | boolean | Record<string, unknown>>>;

export function settingsDefauts(): SettingsData {
  const out: SettingsData = {};
  for (const g of GROUPES_SETTINGS) {
    out[g.id] = {};
    for (const c of g.champs) out[g.id][c.cle] = c.defaut as string | number | boolean;
  }
  return out;
}

export function getChampSetting(groupId: string, cle: string): DefChampParametre | undefined {
  const g = GROUPES_SETTINGS.find((x) => x.id === groupId);
  return g?.champs.find((c) => c.cle === cle);
}

export function trousGroupe(settings: SettingsData, groupeId: string): Record<string, unknown> {
  const groupe = GROUPES_SETTINGS.find((g) => g.id === groupeId);
  const actuel = settings[groupeId] ?? {};
  const out: Record<string, unknown> = {};
  for (const c of groupe?.champs ?? []) {
    out[c.cle] = actuel[c.cle] !== undefined ? actuel[c.cle] : c.defaut;
  }
  return out;
}

// boala: Types de sections CMS (Phase 3). Chaque type définit les champs de
// contenu (content) et les paramètres de rendu (settings) que le superadmin
// remplit dans l'éditeur de section. Inspiré du projet soam-site-web-app-main.

export type ChampType =
  | "texte"        // input text court
  | "textaire"     // textarea
  | "wysiwyg"      // éditeur riche (aligné sur textarea pour l'instant)
  | "image"        // URL / upload image
  | "galerie"      // liste d'URLs d'images
  | "collection"   // items répétables (services, stats, plans...)
  | "relation"     // relation vers un module (ex: services, projets)
  | "select"       // choix parmi des options fixes
  | "booleen"      // toggle
  | "nombre"       // number
  | "couleur"      // color picker
  | "code"         // bloc HTML/CSS/JS libre

export type FieldDef = {
  nom: string;
  label: string;
  type: ChampType;
  options?: { valeur: string; label: string }[];
  champs?: FieldDef[]; // pour "collection" : schéma des sous-champs
  note?: string;
};

export type SettingDef = {
  nom: string;
  label: string;
  type: "select" | "nombre" | "booleen" | "couleur" | "texte";
  options?: { valeur: string; label: string }[];
  defaut?: string | number | boolean;
  note?: string;
};

export type SectionType = {
  id: string;
  nom: string;
  description: string;
  icone: string;
  champs: FieldDef[];
  parametres: SettingDef[];
};

// Paramètres communs à (presque) tous les types de sections.
const PARAMS_COMMUNS: SettingDef[] = [
  { nom: "fond", label: "Fond de la section", type: "select", defaut: "clair", options: [
    { valeur: "clair", label: "Clair" },
    { valeur: "creme", label: "Crème" },
    { valeur: "sombre", label: "Sombre" },
    { valeur: "accent", label: "Couleur d'accent" },
    { valeur: "aucun", label: "Aucun / transparent" },
  ]},
  { nom: "animation", label: "Animation d'entrée", type: "select", defaut: "none", options: [
    { valeur: "none", label: "Aucune" },
    { valeur: "fade", label: "Fondu" },
    { valeur: "gauche", label: "Glissement gauche" },
    { valeur: "droite", label: "Glissement droite" },
    { valeur: "haut", label: "Glissement haut" },
    { valeur: "zoom", label: "Zoom" },
  ]},
  { nom: "paddingY", label: "Espacement vertical", type: "select", defaut: "md", options: [
    { valeur: "xs", label: "Petit" }, { valeur: "sm", label: "Moyen-petit" },
    { valeur: "md", label: "Moyen" }, { valeur: "lg", label: "Grand" },
    { valeur: "xl", label: "Très grand" },
  ]},
];

const PARAMS_COLONNES: SettingDef[] = [
  { nom: "colonnes", label: "Nombre de colonnes", type: "select", defaut: "3", options: [
    { valeur: "2", label: "2" }, { valeur: "3", label: "3" }, { valeur: "4", label: "4" },
  ]},
];

// Champs communs réutilisés
const champTitre: FieldDef = { nom: "badge", label: "Badge (petit texte au-dessus)", type: "texte" };
const champTitrePrincipal: FieldDef = { nom: "title", label: "Titre de la section", type: "texte" };
const champSousTitre: FieldDef = { nom: "subtitle", label: "Sous-titre / description", type: "textaire" };

export const TYPES_SECTIONS: SectionType[] = [
  {
    id: "hero",
    nom: "Héros (bannière)",
    description: "Grande bannière titre avec image/vidéo de fond et boutons.",
    icone: "layout",
    champs: [
      champTitre,
      champTitrePrincipal,
      champSousTitre,
      { nom: "imageFondUrl", label: "Image de fond (URL)", type: "image" },
      { nom: "videoFondUrl", label: "Vidéo de fond (URL, optionnelle)", type: "texte" },
      { nom: "boutonPrimaire", label: "Bouton principal (texte)", type: "texte" },
      { nom: "boutonPrimaireUrl", label: "Lien du bouton principal", type: "texte" },
      { nom: "boutonSecondaire", label: "Bouton secondaire (texte)", type: "texte" },
      { nom: "boutonSecondaireUrl", label: "Lien du bouton secondaire", type: "texte" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "hauteur", label: "Hauteur", type: "select", defaut: "md", options: [
        { valeur: "sm", label: "Compacte" }, { valeur: "md", label: "Moyenne" },
        { valeur: "lg", label: "Grande" }, { valeur: "plein", label: "Plein écran" },
      ]},
      { nom: "overlay", label: "Voile sombre sur l'image", type: "select", defaut: "0.5", options: [
        { valeur: "0", label: "Aucun" }, { valeur: "0.3", label: "Léger" },
        { valeur: "0.5", label: "Moyen" }, { valeur: "0.8", label: "Fort" },
      ]},
      { nom: "centrer", label: "Centrer le contenu", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "text_with_image",
    nom: "Texte + image",
    description: "Un bloc texte avec une image à gauche ou à droite.",
    icone: "layout",
    champs: [
      champBadge(),
      champTitrePrincipal,
      champSousTitre,
      { nom: "texte", label: "Contenu détaillé", type: "wysiwyg" },
      { nom: "imageUrl", label: "Image", type: "image" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "positionImage", label: "Position de l'image", type: "select", defaut: "gauche", options: [
        { valeur: "gauche", label: "Image à gauche" }, { valeur: "droite", label: "Image à droite" },
      ]},
      { nom: "largeurImage", label: "Largeur de l'image", type: "select", defaut: "1/2", options: [
        { valeur: "1/3", label: "1/3" }, { valeur: "1/2", label: "1/2" }, { valeur: "2/3", label: "2/3" },
      ]},
    ],
  },
  {
    id: "services_grid",
    nom: "Grille de services",
    description: "Affiche les services en grille avec icônes.",
    icone: "layers",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module Services" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Services (si saisie manuelle)", type: "collection", champs: [
        { nom: "title", label: "Titre", type: "texte" },
        { nom: "icon", label: "Icône", type: "texte" },
        { nom: "description", label: "Description", type: "textaire" },
        { nom: "lien", label: "Lien (optionnel)", type: "texte" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "style", label: "Style", type: "select", defaut: "icone", options: [
        { valeur: "icone", label: "Icône" }, { valeur: "image", label: "Image" },
        { valeur: "numero", label: "Numéroté" },
      ]},
    ],
  },
  {
    id: "temoignages",
    nom: "Témoignages",
    description: "Carrousel de témoignages clients.",
    icone: "message-circle",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module Témoignages" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Témoignages (si manuel)", type: "collection", champs: [
        { nom: "name", label: "Nom", type: "texte" },
        { nom: "role", label: "Rôle", type: "texte" },
        { nom: "company", label: "Société", type: "texte" },
        { nom: "content", label: "Contenu", type: "textaire" },
        { nom: "rating", label: "Note (1-5)", type: "nombre" },
        { nom: "imageUrl", label: "Avatar (URL)", type: "image" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "afficherNote", label: "Afficher les notes", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "faq",
    nom: "FAQ",
    description: "Questions fréquentes en accordéon.",
    icone: "help-circle",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module FAQ" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Questions (si manuel)", type: "collection", champs: [
        { nom: "question", label: "Question", type: "texte" },
        { nom: "answer", label: "Réponse", type: "textaire" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "ouvrirPremiere", label: "Ouvrir la première question", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "equipe",
    nom: "Équipe",
    description: "Grille des membres de l'équipe.",
    icone: "users",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module Équipe" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Membres (si manuel)", type: "collection", champs: [
        { nom: "nom", label: "Nom", type: "texte" },
        { nom: "role", label: "Rôle", type: "texte" },
        { nom: "bio", label: "Bio", type: "textaire" },
        { nom: "imageUrl", label: "Photo (URL)", type: "image" },
      ]},
    ],
    parametres: [...PARAMS_COMMUNS, ...PARAMS_COLONNES],
  },
  {
    id: "galerie",
    nom: "Galerie d'images",
    description: "Galerie avec lightbox.",
    icone: "camera",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "images", label: "Images", type: "galerie" },
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "arrondi", label: "Bords arrondis", type: "select", defaut: "lg", options: [
        { valeur: "aucun", label: "Aucun" }, { valeur: "md", label: "Moyen" },
        { valeur: "lg", label: "Arrondi" }, { valeur: "plein", label: "Cercle" },
      ]},
    ],
  },
  {
    id: "cta",
    nom: "Appel à l'action (CTA)",
    description: "Bandeau avec titre, texte et bouton.",
    icone: "zap",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "boutonTexte", label: "Texte du bouton", type: "texte" },
      { nom: "boutonUrl", label: "Lien du bouton", type: "texte" },
      { nom: "imageFondUrl", label: "Image de fond (URL)", type: "image" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "taille", label: "Taille", type: "select", defaut: "md", options: [
        { valeur: "sm", label: "Petite" }, { valeur: "md", label: "Moyenne" },
        { valeur: "lg", label: "Grande" },
      ]},
    ],
  },
  {
    id: "contact_form",
    nom: "Formulaire de contact",
    description: "Formulaire de contact avec infos de contact.",
    icone: "mail",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "afficherInfos", label: "Afficher les coordonnées", type: "booleen" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "colonneInfos", label: "Colonne infos à côté", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "custom_form",
    nom: "Formulaire personnalisé",
    description: "Formulaire avec champs définis librement.",
    icone: "pen-tool",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "champs", label: "Champs du formulaire", type: "collection", champs: [
        { nom: "label", label: "Label", type: "texte" },
        { nom: "type", label: "Type", type: "select", options: [
          { valeur: "text", label: "Texte" }, { valeur: "email", label: "Email" },
          { valeur: "textarea", label: "Zone de texte" }, { valeur: "select", label: "Liste" },
        ]},
        { nom: "options", label: "Options (si liste, séparées par virgule)", type: "texte" },
        { nom: "obligatoire", label: "Obligatoire", type: "booleen" },
      ]},
    ],
    parametres: [...PARAMS_COMMUNS],
  },
  {
    id: "statistiques",
    nom: "Chiffres clés",
    description: "Statistiques / chiffres animés.",
    icone: "chart-bar",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "items", label: "Chiffres", type: "collection", champs: [
        { nom: "valeur", label: "Nombre", type: "texte" },
        { nom: "label", label: "Label", type: "texte" },
        { nom: "icone", label: "Icône", type: "texte" },
        { nom: "couleur", label: "Couleur", type: "couleur" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "animer", label: "Animation compteur", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "clients_logos",
    nom: "Logos clients / partenaires",
    description: "Carrousel de logos.",
    icone: "building",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module Clients & Partenaires" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Logos (si manuel)", type: "collection", champs: [
        { nom: "name", label: "Nom", type: "texte" },
        { nom: "logoUrl", label: "Logo (URL)", type: "image" },
        { nom: "url", label: "Lien (URL)", type: "texte" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "noirBlanc", label: "Afficher en noir et blanc", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "blog_posts_grid",
    nom: "Articles de blog",
    description: "Grille des derniers articles.",
    icone: "pen-tool",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "categorie", label: "Catégorie (vide = toutes)", type: "texte" },
    ],
    parametres: [...PARAMS_COMMUNS, ...PARAMS_COLONNES],
  },
  {
    id: "tarifs",
    nom: "Tarifs / Plans",
    description: "Grille tarifaire.",
    icone: "shopping-cart",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "items", label: "Plans", type: "collection", champs: [
        { nom: "nom", label: "Nom du plan", type: "texte" },
        { nom: "prix", label: "Prix", type: "texte" },
        { nom: "devise", label: "Devise", type: "texte" },
        { nom: "periode", label: "Période (ex: /mois)", type: "texte" },
        { nom: "description", label: "Description", type: "textaire" },
        { nom: "caracteristiques", label: "Caractéristiques (une par ligne)", type: "textaire" },
        { nom: "boutonTexte", label: "Texte du bouton", type: "texte" },
        { nom: "boutonUrl", label: "Lien du bouton", type: "texte" },
        { nom: "misEnAvant", label: "Plan mis en avant", type: "booleen" },
      ]},
    ],
    parametres: [...PARAMS_COMMUNS, ...PARAMS_COLONNES],
  },
  {
    id: "custom_html",
    nom: "HTML / CSS personnalisé",
    description: "Bloc de code libre.",
    icone: "code-2",
    champs: [
      { nom: "code", label: "Code HTML/CSS/JS", type: "code" },
    ],
    parametres: [...PARAMS_COMMUNS],
  },
  {
    id: "fonctionnalites",
    nom: "Fonctionnalités",
    description: "Liste de fonctionnalités avec puces.",
    icone: "check",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "items", label: "Fonctionnalités", type: "collection", champs: [
        { nom: "title", label: "Titre", type: "texte" },
        { nom: "description", label: "Description", type: "textaire" },
        { nom: "icone", label: "Icône", type: "texte" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "layout", label: "Disposition", type: "select", defaut: "cartes", options: [
        { valeur: "cartes", label: "Cartes" }, { valeur: "liste", label: "Liste" },
      ]},
    ],
  },
  {
    id: "chronologie",
    nom: "Chronologie (timeline)",
    description: "Étapes dans le temps.",
    icone: "clock",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "items", label: "Étapes", type: "collection", champs: [
        { nom: "date", label: "Date / période", type: "texte" },
        { nom: "title", label: "Titre", type: "texte" },
        { nom: "description", label: "Description", type: "textaire" },
      ]},
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "orientation", label: "Orientation", type: "select", defaut: "verticale", options: [
        { valeur: "verticale", label: "Verticale" }, { valeur: "horizontale", label: "Horizontale" },
      ]},
    ],
  },
  {
    id: "video",
    nom: "Vidéo",
    description: "Intégration YouTube / Vimeo.",
    icone: "camera",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "url", label: "URL de la vidéo (YouTube/Vimeo)", type: "texte" },
      { nom: "imageMiniature", label: "Miniature (URL, optionnelle)", type: "image" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "ratio", label: "Ratio", type: "select", defaut: "16/9", options: [
        { valeur: "16/9", label: "16:9" }, { valeur: "4/3", label: "4:3" }, { valeur: "1/1", label: "1:1" },
      ]},
    ],
  },
  {
    id: "carte",
    nom: "Carte",
    description: "Carte Google Maps.",
    icone: "map-pin",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "adresse", label: "Adresse / lieu", type: "texte" },
      { nom: "lien", label: "Lien Google Maps", type: "texte" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "zoom", label: "Zoom", type: "nombre", defaut: "14" },
    ],
  },
  {
    id: "newsletter",
    nom: "Newsletter",
    description: "Inscription à la newsletter.",
    icone: "mail",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "boutonTexte", label: "Texte du bouton", type: "texte" },
    ],
    parametres: [...PARAMS_COMMUNS],
  },
  {
    id: "social_links",
    nom: "Réseaux sociaux",
    description: "Liens vers les réseaux sociaux.",
    icone: "users",
    champs: [
      champTitrePrincipal,
      { nom: "facebook", label: "Facebook (URL)", type: "texte" },
      { nom: "twitter", label: "Twitter / X (URL)", type: "texte" },
      { nom: "linkedin", label: "LinkedIn (URL)", type: "texte" },
      { nom: "instagram", label: "Instagram (URL)", type: "texte" },
      { nom: "youtube", label: "YouTube (URL)", type: "texte" },
    ],
    parametres: [
      ...PARAMS_COMMUNS,
      { nom: "style", label: "Style", type: "select", defaut: "icones", options: [
        { valeur: "icones", label: "Icônes" }, { valeur: "texte", label: "Texte" },
        { valeur: "les-deux", label: "Icônes + texte" },
      ]},
    ],
  },
  {
    id: "products_grid",
    nom: "Grille de produits",
    description: "Affiche les produits de la boutique.",
    icone: "shopping-cart",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "categorie", label: "Catégorie (vide = toutes)", type: "texte" },
    ],
    parametres: [
      ...PARAMS_COMMUNS, ...PARAMS_COLONNES,
      { nom: "afficherPanier", label: "Afficher l'ajout au panier", type: "booleen", defaut: "true" },
    ],
  },
  {
    id: "documents",
    nom: "Documents",
    description: "Fichiers à télécharger.",
    icone: "file",
    champs: [
      champTitrePrincipal, champSousTitre,
      { nom: "source", label: "Source", type: "select", options: [
        { valeur: "module", label: "Depuis le module Documents" },
        { valeur: "manuel", label: "Saisie manuelle" },
      ]},
      { nom: "items", label: "Documents (si manuel)", type: "collection", champs: [
        { nom: "title", label: "Titre", type: "texte" },
        { nom: "description", label: "Description", type: "textaire" },
        { nom: "fileUrl", label: "URL du fichier", type: "texte" },
      ]},
    ],
    parametres: [...PARAMS_COMMUNS],
  },
  {
    id: "projets_grid",
    nom: "Réalisations / Projets",
    description: "Grille de réalisations.",
    icone: "folder-check",
    champs: [
      champBadge(), champTitrePrincipal, champSousTitre,
      { nom: "categorie", label: "Catégorie (vide = toutes)", type: "texte" },
      { nom: "tri", label: "Tri", type: "select", options: [
        { valeur: "recent", label: "Plus récents" },
        { valeur: "phare", label: "Projets phares d'abord" },
        { valeur: "manuel", label: "Ordre manuel" },
      ]},
    ],
    parametres: [...PARAMS_COMMUNS, ...PARAMS_COLONNES],
  },
];

function champBadge(): FieldDef {
  return { nom: "badge", label: "Badge (petit texte au-dessus)", type: "texte" };
}

/** Récupère un type de section par son id. */
export function getTypeSection(id: string): SectionType | undefined {
  return TYPES_SECTIONS.find((t) => t.id === id);
}

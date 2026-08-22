import { articles, expertises, equipe, logiciels, realisations, solutions } from "./schema";
import { TAGS } from "./data";

// ponytail: CRUD piloté par spec — un seul formulaire/action génériques pour les 6 entités.
// Si une entité demande un traitement spécial, la sortir de cette table vers du sur-mesure.

export type ChampSpec = {
  nom: string;
  label: string;
  type: "text" | "slug" | "textarea" | "liste" | "couleur" | "nombre" | "booleen" | "image";
  requis?: boolean;
};

export type EntiteSpec = {
  table:
    | typeof expertises
    | typeof logiciels
    | typeof solutions
    | typeof realisations
    | typeof articles
    | typeof equipe;
  tag: string;
  titre: string;
  colonneTitre: string;
  routePublic?: string;
  champs: ChampSpec[];
};

const couleur: ChampSpec = { nom: "color", label: "Couleur", type: "couleur" };
const image: ChampSpec = { nom: "imageUrl", label: "Image", type: "image" };
const imageSeed: ChampSpec = {
  nom: "imageSeed",
  label: "Image de secours (seed)",
  type: "text",
};

export const ENTITES: Record<string, EntiteSpec> = {
  expertises: {
    table: expertises,
    tag: TAGS.expertises,
    titre: "Expertises",
    colonneTitre: "title",
    routePublic: "/expertises",
    champs: [
      { nom: "title", label: "Titre", type: "text", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "icon", label: "Icône", type: "text" },
      { nom: "description", label: "Description courte", type: "textarea", requis: true },
      { nom: "longDescription", label: "Description longue", type: "textarea", requis: true },
      { nom: "prestations", label: "Prestations (une par ligne)", type: "liste" },
      couleur,
      imageSeed,
      image,
      { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
    ],
  },
  logiciels: {
    table: logiciels,
    tag: TAGS.logiciels,
    titre: "Logiciels",
    colonneTitre: "name",
    routePublic: "/logiciels",
    champs: [
      { nom: "name", label: "Nom", type: "text", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "tagline", label: "Accroche", type: "text", requis: true },
      { nom: "description", label: "Description courte", type: "textarea", requis: true },
      { nom: "longDescription", label: "Présentation", type: "textarea", requis: true },
      { nom: "features", label: "Fonctionnalités (une par ligne)", type: "liste" },
      { nom: "benefits", label: "Bénéfices (un par ligne)", type: "liste" },
      couleur,
      imageSeed,
      image,
    ],
  },
  solutions: {
    table: solutions,
    tag: TAGS.solutions,
    titre: "Solutions",
    colonneTitre: "title",
    routePublic: "/solutions",
    champs: [
      { nom: "title", label: "Titre", type: "text", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "desc", label: "Description courte", type: "textarea", requis: true },
      { nom: "icon", label: "Icône", type: "text" },
      { nom: "longDescription", label: "Description longue", type: "textarea", requis: true },
      { nom: "points", label: "Points inclus (un par ligne)", type: "liste" },
      couleur,
      imageSeed,
      image,
    ],
  },
  realisations: {
    table: realisations,
    tag: TAGS.realisations,
    titre: "Réalisations",
    colonneTitre: "title",
    routePublic: "/realisations",
    champs: [
      { nom: "title", label: "Titre", type: "text", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "category", label: "Catégorie", type: "text", requis: true },
      { nom: "description", label: "Description courte", type: "textarea", requis: true },
      { nom: "contexte", label: "Contexte", type: "textarea" },
      { nom: "mission", label: "Mission", type: "textarea" },
      { nom: "resultats", label: "Résultats (un par ligne)", type: "liste" },
      couleur,
      imageSeed,
      image,
      { nom: "featured", label: "Projet phare (accueil)", type: "booleen" },
      { nom: "span", label: "Largeur accueil (1 ou 2)", type: "nombre" },
    ],
  },
  actualites: {
    table: articles,
    tag: TAGS.articles,
    titre: "Actualités",
    colonneTitre: "title",
    routePublic: "/actualites",
    champs: [
      { nom: "title", label: "Titre", type: "text", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "category", label: "Catégorie", type: "text", requis: true },
      { nom: "date", label: "Date affichée", type: "text", requis: true },
      { nom: "excerpt", label: "Chapeau", type: "textarea", requis: true },
      { nom: "body", label: "Corps de l'article (un paragraphe par ligne)", type: "liste" },
      imageSeed,
      image,
    ],
  },
  equipe: {
    table: equipe,
    tag: TAGS.equipe,
    titre: "Équipe",
    colonneTitre: "nom",
    champs: [
      { nom: "nom", label: "Nom", type: "text", requis: true },
      { nom: "role", label: "Rôle", type: "text", requis: true },
      { nom: "bio", label: "Bio", type: "textarea" },
      imageSeed,
      image,
      { nom: "ordre", label: "Ordre d'affichage", type: "nombre" },
    ],
  },
};

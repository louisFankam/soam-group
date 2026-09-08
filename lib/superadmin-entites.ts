// boala: CRUD superadmin piloté par spec — un ensemble de modules de contenu
// gérés de façon générique (liste + formulaire + suppression). Les entités à
// traitement spécial (pages/sections, menu, medias, parametres, backups...)
// ont leurs propres pages sur-mesure.
import {
  temoignages, membresEquipe, services, projets, faqs, documents,
  offresEmploi, clientsPartenaires, produits, commandes, categories, tags,
} from "./schema";

export type ChampSAC = {
  nom: string;
  label: string;
  type: "texte" | "slug" | "textaire" | "liste" | "couleur" | "nombre" |
        "booleen" | "image" | "email" | "select" | "json";
  options?: { valeur: string; label: string }[];
  requis?: boolean;
  note?: string;
};

export type EntiteSAC = {
  table: typeof temoignages | typeof membresEquipe | typeof services |
         typeof projets | typeof faqs | typeof documents | typeof offresEmploi |
         typeof clientsPartenaires | typeof produits | typeof commandes |
         typeof categories | typeof tags;
  tag: string;
  titre: string;
  colonneTitre: string;
  sousTitreColonne?: string; // colonne secondaire affichée sous le titre
  champs: ChampSAC[];
};

export const ENTITES_SUPERADMIN: Record<string, EntiteSAC> = {
  temoignages: {
    table: temoignages,
    tag: "temoignages",
    titre: "Témoignages",
    colonneTitre: "name",
    sousTitreColonne: "company",
    champs: [
      { nom: "name", label: "Nom", type: "texte", requis: true },
      { nom: "role", label: "Rôle", type: "texte" },
      { nom: "company", label: "Société", type: "texte" },
      { nom: "content", label: "Contenu du témoignage", type: "textaire", requis: true },
      { nom: "rating", label: "Note (1-5)", type: "nombre" },
      { nom: "imageUrl", label: "Avatar (URL)", type: "image" },
      { nom: "isActive", label: "Actif", type: "booleen" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
    ],
  },
  equipe: {
    table: membresEquipe,
    tag: "equipe",
    titre: "Équipe",
    colonneTitre: "nom",
    sousTitreColonne: "role",
    champs: [
      { nom: "nom", label: "Nom", type: "texte", requis: true },
      { nom: "role", label: "Rôle / poste", type: "texte", requis: true },
      { nom: "bio", label: "Bio", type: "textaire" },
      { nom: "email", label: "Email", type: "email" },
      { nom: "phone", label: "Téléphone", type: "texte" },
      { nom: "imageUrl", label: "Photo (URL)", type: "image" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
      { nom: "isActive", label: "Actif", type: "booleen" },
    ],
  },
  services: {
    table: services,
    tag: "services",
    titre: "Services",
    colonneTitre: "title",
    champs: [
      { nom: "title", label: "Titre", type: "texte", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "icon", label: "Icône", type: "texte" },
      { nom: "description", label: "Description courte", type: "textaire" },
      { nom: "longDescription", label: "Description longue", type: "textaire" },
      { nom: "imageUrl", label: "Image (URL)", type: "image" },
      { nom: "color", label: "Couleur", type: "couleur" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
      { nom: "isActive", label: "Actif", type: "booleen" },
    ],
  },
  projets: {
    table: projets,
    tag: "projets",
    titre: "Projets / Réalisations",
    colonneTitre: "title",
    champs: [
      { nom: "title", label: "Titre", type: "texte", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "description", label: "Description courte", type: "textaire" },
      { nom: "contexte", label: "Contexte", type: "textaire" },
      { nom: "mission", label: "Mission", type: "textaire" },
      { nom: "resultats", label: "Résultats (un par ligne)", type: "liste" },
      { nom: "imageUrl", label: "Image (URL)", type: "image" },
      { nom: "color", label: "Couleur", type: "couleur" },
      { nom: "featured", label: "Projet phare", type: "booleen" },
      { nom: "isPublished", label: "Publié", type: "booleen" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
    ],
  },
  faq: {
    table: faqs,
    tag: "faq",
    titre: "FAQ",
    colonneTitre: "question",
    champs: [
      { nom: "question", label: "Question", type: "texte", requis: true },
      { nom: "answer", label: "Réponse", type: "textaire", requis: true },
      { nom: "category", label: "Catégorie", type: "texte" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
      { nom: "isActive", label: "Actif", type: "booleen" },
    ],
  },
  documents: {
    table: documents,
    tag: "documents",
    titre: "Documents",
    colonneTitre: "title",
    champs: [
      { nom: "title", label: "Titre", type: "texte", requis: true },
      { nom: "description", label: "Description", type: "textaire" },
      { nom: "fileUrl", label: "URL du fichier", type: "texte", requis: true },
      { nom: "category", label: "Catégorie", type: "texte" },
      { nom: "isActive", label: "Actif", type: "booleen" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
    ],
  },
  emplois: {
    table: offresEmploi,
    tag: "emplois",
    titre: "Offres d'emploi",
    colonneTitre: "title",
    champs: [
      { nom: "title", label: "Titre du poste", type: "texte", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "department", label: "Département", type: "texte" },
      { nom: "location", label: "Lieu", type: "texte" },
      { nom: "type", label: "Type de contrat", type: "select", options: [
        { valeur: "CDI", label: "CDI" }, { valeur: "CDD", label: "CDD" },
        { valeur: "Stage", label: "Stage" }, { valeur: "Freelance", label: "Freelance" },
      ]},
      { nom: "description", label: "Description", type: "textaire" },
      { nom: "requirements", label: "Prérequis (un par ligne)", type: "liste" },
      { nom: "isActive", label: "Active", type: "booleen" },
    ],
  },
  "clients-partenaires": {
    table: clientsPartenaires,
    tag: "clients",
    titre: "Clients & Partenaires",
    colonneTitre: "name",
    champs: [
      { nom: "name", label: "Nom", type: "texte", requis: true },
      { nom: "type", label: "Type", type: "select", options: [
        { valeur: "client", label: "Client" }, { valeur: "partner", label: "Partenaire" },
      ]},
      { nom: "logoUrl", label: "Logo (URL)", type: "image" },
      { nom: "url", label: "Site web (URL)", type: "texte" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
      { nom: "isActive", label: "Actif", type: "booleen" },
    ],
  },
  produits: {
    table: produits,
    tag: "produits",
    titre: "Produits",
    colonneTitre: "name",
    champs: [
      { nom: "name", label: "Nom", type: "texte", requis: true },
      { nom: "slug", label: "Slug URL", type: "slug", requis: true },
      { nom: "description", label: "Description", type: "textaire" },
      { nom: "price", label: "Prix (en FCFA)", type: "nombre" },
      { nom: "stock", label: "Stock", type: "nombre" },
      { nom: "imageUrl", label: "Image (URL)", type: "image" },
      { nom: "category", label: "Catégorie", type: "texte" },
      { nom: "isActive", label: "Actif", type: "booleen" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
    ],
  },
  commandes: {
    table: commandes,
    tag: "commandes",
    titre: "Commandes",
    colonneTitre: "nom",
    sousTitreColonne: "email",
    champs: [
      { nom: "statut", label: "Statut", type: "select", options: [
        { valeur: "nouveau", label: "Nouveau" }, { valeur: "paye", label: "Payé" },
        { valeur: "expedie", label: "Expédié" }, { valeur: "annule", label: "Annulé" },
      ]},
    ],
  },
  "blog/categories": {
    table: categories,
    tag: "categories",
    titre: "Catégories",
    colonneTitre: "name",
    champs: [
      { nom: "name", label: "Nom", type: "texte", requis: true },
      { nom: "slug", label: "Slug", type: "slug", requis: true },
      { nom: "group", label: "Groupe", type: "select", options: [
        { valeur: "blog", label: "Blog" }, { valeur: "service", label: "Service" },
        { valeur: "project", label: "Projet" },
      ]},
      { nom: "description", label: "Description", type: "textaire" },
      { nom: "ordre", label: "Ordre", type: "nombre" },
    ],
  },
  "blog/tags": {
    table: tags,
    tag: "tags",
    titre: "Tags",
    colonneTitre: "name",
    champs: [
      { nom: "name", label: "Nom", type: "texte", requis: true },
      { nom: "slug", label: "Slug", type: "slug", requis: true },
    ],
  },
};

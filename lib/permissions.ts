// Permissions par rôle — chaque role est associé à la liste des patterns
// d'action autorisés. Un pattern "pages.*" signifie tous les CRUD sur les pages.
// Vérification via `aPermission(role, "pages.creer")`.

export const ROLE_SUPERADMIN = "superadmin";
export const ROLE_EDITOR = "editor";
export const ROLE_VIEWER = "viewer";

export type Role = typeof ROLE_SUPERADMIN | typeof ROLE_EDITOR | typeof ROLE_VIEWER;

const PERMISSIONS_EDITOR: string[] = [
  // Contenu
  "pages.*", "sections.*", "blog.*", "media.*",
  // Modules
  "services.*", "projets.*", "equipe.*", "temoignages.*",
  "faq.*", "documents.*", "emplois.*", "clients.*",
  // Messages / formulaires
  "contacts.*", "formulaires.*",
  // Boutique
  "produits.*", "commandes.*",
];

const PERMISSIONS: Record<string, string[]> = {};
PERMISSIONS[ROLE_SUPERADMIN] = [
  ...PERMISSIONS_EDITOR,
  "utilisateurs.*", "parametres.*", "system.*", "menu.*", "footer.*",
];
PERMISSIONS[ROLE_EDITOR] = PERMISSIONS_EDITOR;
PERMISSIONS[ROLE_VIEWER] = [];

/** Vérifie si un rôle possède une permission donnée. */
export function aPermission(role: string, permission: string): boolean {
  if (role === ROLE_SUPERADMIN) return true;
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  // "pages.*" couvre "pages.creer", "pages.modifier", etc.
  return perms.some(
    (p) => p === permission || (p.endsWith(".*") && permission.startsWith(p.slice(0, -2))),
  );
}

/** Rôles disponibles pour la sélection dans l'admin. */
export const ROLES = [
  { valeur: ROLE_SUPERADMIN, label: "SuperAdmin", description: "Accès total — contenu, paramètres, utilisateurs, système" },
  { valeur: ROLE_EDITOR, label: "Éditeur", description: "Contenu et modules — pas de settings ni utilisateurs" },
  { valeur: ROLE_VIEWER, label: "Lecteur", description: "Lecture seule sur tout le contenu" },
] as const;

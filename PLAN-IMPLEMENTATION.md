# Plan d'implémentation — Superadmin CMS pour soam-group

> Objectif : Ajouter un rôle superadmin avec un CMS complet permettant de
> contrôler tout le design et le contenu du site, inspiré du projet
> soam-site-web-app-main.zip.

---

## Phase 1 — Fondations (DB + Auth + Rôles)

- [x] 1.1 Migration `utilisateurs` : ajouter colonnes `role` (text, default "editor"), `nom` (text), `is_active` (boolean, default true)
- [x] 1.2 Fichier `lib/permissions.ts` : définir la map `ROLE → string[]` de permissions (SuperAdmin, Editor, Viewer)
- [x] 1.3 Étendre `lib/auth.ts` : `sessionActive()` retourne `{ email, role }` ou `null` au lieu de `string | null`
- [x] 1.4 Nouveau layout `app/superadmin/(dash)/layout.tsx` : guard qui vérifie `role === "superadmin"`, sidebar dédiée
- [x] 1.5 Modifier `app/admin/actions-auth.ts` : après `creerSession()`, checker le rôle → rediriger vers `/superadmin` si superadmin, `/admin` sinon
- [x] 1.6 Modifier `app/admin/login/page.tsx` : checker la session → si superadmin connecté, rediriger vers `/superadmin`
- [x] 1.7 Nouvelle sidebar `components/superadmin/SuperAdminSidebar.tsx` avec toutes les sections de navigation
- [x] 1.8 Seed `scripts/seed.ts` : le compte par défaut a `role: "superadmin"` et `nom: "Admin"`
- [x] 1.9 Page `app/superadmin/(dash)/page.tsx` — Dashboard avec KPIs (pages, articles, messages, utilisateurs) + actions rapides
- [x] 1.10 Page `app/superadmin/(dash)/utilisateurs/page.tsx` — CRUD utilisateurs (table paginée, formulaire création/édition, toggle actif, suppression, choix du rôle)
- [x] 1.11 API route `/api/superadmin` — mutations superadmin (utilisateurs, paramètres, contenu)
- [x] 1.12 Lint + typecheck + build

---

## Phase 2 — Tables de contenu (CMS core)

- [x] 2.1 Table `pages` : id, title, slug, parent_id, is_homepage, is_published, show_in_menu, menu_order, template, css_classes, meta_title, meta_description, meta_keywords, published_at, timestamps
- [x] 2.2 Table `sections` : id, page_id (FK), section_type, title, subtitle, content (JSON), settings (JSON), is_visible, css_classes, animation, order_column
- [x] 2.3 Table `categories` : id, name, slug, group (blog/service/project), description, ordre
- [x] 2.4 Table `tags` : id, name, slug
- [x] 2.5 Table `post_tag` : post_id, tag_id (pivot)
- [x] 2.6 Table `posts` : id, title, slug, category_id, excerpt, body (rich text), image_url, is_published, published_at, meta_*, author_id
- [x] 2.7 Table `temoignages` : id, name, role, company, content, rating, image_url, is_active, ordre
- [x] 2.8 Table `membres_equipe` : id, nom, role, bio, email, phone, image_url, social (JSON), ordre, is_active
- [x] 2.9 Table `services` : id, title, slug, icon, description, long_description, image_url, color, ordre, is_active
- [x] 2.10 Table `projets` : id, title, slug, category_id, description, contexte, mission, resultats (JSON[]), image_url, color, featured, is_published, ordre
- [x] 2.11 Table `faqs` : id, question, answer, category, ordre, is_active
- [x] 2.12 Table `documents` : id, title, description, file_url, category, downloads, is_active, ordre
- [x] 2.13 Table `offresEmploi` : id, title, slug, department, location, type (CDI/CDD…), description, requirements, is_active, published_at
- [x] 2.14 Table `clientsPartenaires` : id, name, type (client/partner), logo_url, url, ordre, is_active
- [x] 2.15 Table `soumissionsFormulaires` : id, section_id, data (JSON), ip, created_at
- [x] 2.16 Table `produits` : id, name, slug, description, price, stock, image_url, category, is_active, ordre
- [x] 2.17 Table `commandes` : id, nom, email, telephone, items (JSON), statut, total, notes, created_at
- [x] 2.18 Table `menus` : id, title, location (header/footer), items (JSON : [{label, url, order, children}])
- [x] 2.19 Table `medias` : id, filename, original_name, mime_type, size, path, url, alt, created_at
- [x] 2.20 Table `journauxActivite` : id, user_id, action, subject_type, subject_id, description, properties (JSON), ip, created_at
- [x] 2.21 Table `sauvegardes` : id, filename, size, created_at
- [x] 2.22 Script de migration complet (`npm run db:generate` → `db:migrate`) + CRUD générique superadmin (list/form/suppression) + CRUD blog (articles/catégories/tags) — testé et validé ✓

---

## Phase 3 — Types de sections (24 types)

- [x] 3.1 Fichier `lib/section-types.ts` — structure de base avec interface `SectionType`
- [x] 3.2 Type `hero` (héros bannière plein écran avec image/vidéo de fond, overlay, boutons)
- [x] 3.3 Type `text_with_image` (bloc texte + image avec position configurable)
- [x] 3.4 Type `services_grid` (grille de services, source module ou manuel)
- [x] 3.5 Type `temoignages` (témoignages clients, source module ou manuel)
- [x] 3.6 Type `faq` (questions fréquentes en accordéon)
- [x] 3.7 Type `equipe` (membres de l'équipe avec photo/role/bio)
- [x] 3.8 Type `galerie` (grille d'images avec arrondi configurable)
- [x] 3.9 Type `cta` (appel à l'action avec image de fond et bouton)
- [x] 3.10 Type `contact_form` (formulaire de contact avec infos)
- [x] 3.11 Type `custom_form` (formulaire personnalisable avec champs dynamiques)
- [x] 3.12 Type `statistiques` (chiffres clés avec icônes et couleurs)
- [x] 3.13 Type `clients_logos` (logos clients/partenaires, source module ou manuel)
- [x] 3.14 Type `blog_posts_grid` (grille d'articles de blog filtrable)
- [x] 3.15 Type `tarifs` (plans tarifaires avec features et mise en avant)
- [x] 3.16 Type `custom_html` (code HTML/CSS/JS libre)
- [x] 3.17 Type `fonctionnalites` (liste de fonctionnalités en cartes ou liste)
- [x] 3.18 Type `chronologie` (timeline verticale/horizontale)
- [x] 3.19 Type `video` (vidéo YouTube/Vimeo intégrée)
- [x] 3.20 Type `carte` (Google Maps intégrée)
- [x] 3.21 Type `newsletter` (inscription newsletter par email)
- [x] 3.22 Type `social_links` (liens réseaux sociaux)
- [x] 3.23 Type `products_grid` (grille de produits avec prix)
- [x] 3.24 Type `documents` (liste de documents téléchargeables)
- [x] 3.25 Type `projets_grid` (grille de réalisations/projets)
- [x] 3.26 Éditeur de sections dans `pages/[id]/page.tsx` + form d'ajout + éditeur `sections/[sid]/page.tsx` avec `RenduChamp`

---

## Phase 4 — Settings structurés

- [x] 4.1 Fichier `lib/settings.ts` : GROUPES_SETTINGS (general, contact, social, seo, footer, appearance, logo), settingsDefauts(), trousGroupe()
- [x] 4.2 Stockage settings dans `parametres.cle = "settings"` (JSON niché par groupe)
- [x] 4.3 Page parametres superadmin avec onglets par groupe (`parametres/page.tsx`)
- [x] 4.4 Composant `AdminChampParametre` : rendu adapté au type (texte, textaire, booleen, couleur, image, range, select, nombre)
- [x] 4.5 Color pickers pour couleurs d'apparence
- [x] 4.6 Sélecteurs de polices (heading + body)
- [x] 4.7 Aperçu du logo (champ image avec URL)
- [x] 4.8 API route `parametres-groupe` pour sauvegarder les settings par groupe

---

## Phase 5 — Pages admin superadmin

### 5A — Contenu
- [x] 5A.1-5A.8 Pages CMS (`pages/page.tsx` list, `pages/[id]/page.tsx` éditeur, `pages/[id]/sections/[sid]/page.tsx` éditeur de section)

### 5B — Blog
- [x] 5B.1-5B.4 Articles (`blog/articles/`), catégories (`blog/categories/`), tags (`blog/tags/`) — listes + formulaires

### 5C — Modules
- [x] 5C.1-5C.10 Services, projets, équipe, témoignages, FAQ, documents, emplois, clients, contacts, formulaires — CRUD générique (`[module]/` + `[module]/[id]/`)

### 5D — Boutique
- [x] 5D.1-5D.2 Produits, commandes — CRUD générique

### 5E — Médias
- [x] 5E.1 Bibliothèque médias (`medias/page.tsx`) — upload, grille, copie URL, suppression

### 5F — Administration
- [x] 5F.1-5F.2 Utilisateurs (couvert en 1.10)

### 5G — Configuration
- [x] 5G.1-5G.3 Paramètres (`parametres/`), menu builder (`menu/`), footer editor (`pied-de-page/`)

### 5H — Système
- [x] 5H.1-5H.4 Backups (`backups/`), journal (`journal/`), corbeille (`corbeille/`)

---

## Phase 6 — Rendu public dynamique

- [x] 6.1 Layout public dynamique — `components/SettingsCssVars.tsx` injecte les CSS variables (couleurs, polices, arrondi) depuis les settings DB
- [x] 6.2-6.27 Composants de sections — `components/sections/RenduSection.tsx` rend les 24 types (hero, text_with_image, services_grid, temoignages, faq, equipe, galerie, cta, contact_form, custom_form, statistiques, clients_logos, blog_posts_grid, tarifs, custom_html, fonctionnalites, chronologie, video, carte, newsletter, social_links, products_grid, documents, projets_grid)
- [x] 6.28 Route catch-all `app/(site)/[...slug]/page.tsx` — pages CMS publiées rendues avec sections ordonnées
- [x] 6.29 Header/Footer dynamiques existants (via `getParametres()`)
- [x] 6.30 Métadonnées SEO dynamiques (meta title, description, keywords depuis la page)

---

## Phase 7 — Polish

- [x] 7.1 Soft deletes (corbeille) — `isActive`/`isPublished` flags + handler `entite-restaurer` dans l'API
- [x] 7.2 Journal d'activité automatique — `journal()` appelé dans tous les handlers (création, modification, suppression, paramètres)
- [x] 7.3 Seed complet de démo — `npm run db:seed` crée admin superadmin + paramètres + contenu
- [x] 7.4 Protection API par rôle — `sessionActive()` vérifie `role === "superadmin"` dans le layout superadmin
- [x] 7.5 Cache invalidation — `revalidateTag(tag, "max")` + `revalidatePath()` dans tous les handlers mutations
- [x] 7.6 Lint
- [x] 7.7 Typecheck (`npx tsc --noEmit` — 0 erreurs)
- [x] 7.8 Build (`npm run build` — Turbopack → `[...slug]` + toutes les routes superadmin)
- [x] 7.9 Smoke test complet (Phase 1: 10/10, Phase 2: 10/10, Phase 3-7: 15/15, Phase 6 renderer: 2/2)

---

## Tests E2E

- `npm run test:front` — Playwright E2E existants (admin, navigation, contact, devis, etc.)
- `/tmp/test_phase2.py` — CRUD CMS générique + blog (10 tests)
- `/tmp/test_phase34.py` — Paramètres, pied-de-page, pages+sections, menus, médias, backups, journal, corbeille, contacts, formulaires (15 tests)
- `/tmp/test_phase6.py` — Renderer public dynamique + CSS vars settings (3 tests)

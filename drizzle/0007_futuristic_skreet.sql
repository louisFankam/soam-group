CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`group` text DEFAULT 'blog' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `clients_partenaires` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'client' NOT NULL,
	`logo_url` text,
	`url` text DEFAULT '' NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `commandes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text DEFAULT '' NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`statut` text DEFAULT 'nouveau' NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`file_url` text NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`downloads` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `journaux_activite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`subject_type` text DEFAULT '' NOT NULL,
	`subject_id` integer,
	`description` text DEFAULT '' NOT NULL,
	`properties` text DEFAULT '{}' NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text DEFAULT '' NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`path` text DEFAULT '' NOT NULL,
	`url` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `membres_equipe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`role` text NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`image_url` text,
	`social` text DEFAULT '{}' NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`location` text DEFAULT 'header' NOT NULL,
	`items` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offres_emploi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`department` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'CDI' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`requirements` text DEFAULT '[]' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`published_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `offres_emploi_slug_unique` ON `offres_emploi` (`slug`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`parent_id` integer,
	`is_homepage` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`show_in_menu` integer DEFAULT true NOT NULL,
	`menu_order` integer DEFAULT 0 NOT NULL,
	`template` text DEFAULT 'standard' NOT NULL,
	`css_classes` text DEFAULT '' NOT NULL,
	`meta_title` text DEFAULT '' NOT NULL,
	`meta_description` text DEFAULT '' NOT NULL,
	`meta_keywords` text DEFAULT '' NOT NULL,
	`published_at` integer,
	`cree_le` integer NOT NULL,
	`modifie_le` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE TABLE `post_tag` (
	`post_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer,
	`excerpt` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '[]' NOT NULL,
	`image_url` text,
	`is_published` integer DEFAULT true NOT NULL,
	`published_at` integer,
	`meta_title` text DEFAULT '' NOT NULL,
	`meta_description` text DEFAULT '' NOT NULL,
	`author_id` integer,
	`cree_le` integer NOT NULL,
	`modifie_le` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `produits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`category` text DEFAULT '' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `produits_slug_unique` ON `produits` (`slug`);--> statement-breakpoint
CREATE TABLE `projets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer,
	`description` text DEFAULT '' NOT NULL,
	`contexte` text DEFAULT '' NOT NULL,
	`mission` text DEFAULT '' NOT NULL,
	`resultats` text DEFAULT '[]' NOT NULL,
	`image_url` text,
	`color` text DEFAULT 'primary' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projets_slug_unique` ON `projets` (`slug`);--> statement-breakpoint
CREATE TABLE `sauvegardes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`section_type` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`subtitle` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '{}' NOT NULL,
	`settings` text DEFAULT '{}' NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`css_classes` text DEFAULT '' NOT NULL,
	`animation` text DEFAULT '' NOT NULL,
	`order_column` integer DEFAULT 0 NOT NULL,
	`cree_le` integer NOT NULL,
	`modifie_le` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`long_description` text DEFAULT '' NOT NULL,
	`image_url` text,
	`color` text DEFAULT 'primary' NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `soumissions_formulaires` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer,
	`data` text DEFAULT '{}' NOT NULL,
	`ip` text DEFAULT '' NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `temoignages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`image_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);

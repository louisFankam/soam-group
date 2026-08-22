CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`image_seed` text NOT NULL,
	`body` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `equipe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`role` text NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`image_seed` text NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expertises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`icon` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text NOT NULL,
	`prestations` text NOT NULL,
	`color` text DEFAULT 'primary' NOT NULL,
	`image_seed` text NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expertises_slug_unique` ON `expertises` (`slug`);--> statement-breakpoint
CREATE TABLE `logiciels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text NOT NULL,
	`features` text NOT NULL,
	`benefits` text NOT NULL,
	`color` text DEFAULT 'primary' NOT NULL,
	`image_seed` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `logiciels_slug_unique` ON `logiciels` (`slug`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text DEFAULT '' NOT NULL,
	`sujet` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`lu` integer DEFAULT false NOT NULL,
	`archive` integer DEFAULT false NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parametres` (
	`cle` text PRIMARY KEY NOT NULL,
	`valeur` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `realisations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image_seed` text NOT NULL,
	`color` text DEFAULT 'primary' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`contexte` text DEFAULT '' NOT NULL,
	`mission` text DEFAULT '' NOT NULL,
	`resultats` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `realisations_slug_unique` ON `realisations` (`slug`);--> statement-breakpoint
CREATE TABLE `solutions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`icon` text NOT NULL,
	`color` text DEFAULT 'primary' NOT NULL,
	`long_description` text NOT NULL,
	`points` text NOT NULL,
	`image_seed` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `solutions_slug_unique` ON `solutions` (`slug`);--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`mot_de_passe_hash` text NOT NULL,
	`cree_le` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_email_unique` ON `utilisateurs` (`email`);
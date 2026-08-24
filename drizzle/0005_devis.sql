CREATE TABLE `devis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`telephone` text NOT NULL,
	`email` text NOT NULL,
	`secteur` text NOT NULL,
	`service` text NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`description` text NOT NULL,
	`fichier_url` text,
	`statut` text DEFAULT 'nouveau' NOT NULL,
	`cree_le` integer NOT NULL
);

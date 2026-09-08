ALTER TABLE `utilisateurs` ADD `nom` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `utilisateurs` ADD `role` text DEFAULT 'editor' NOT NULL;--> statement-breakpoint
ALTER TABLE `utilisateurs` ADD `actif` integer DEFAULT true NOT NULL;
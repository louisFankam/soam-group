CREATE TABLE `tentatives_connexion` (
	`email` text PRIMARY KEY NOT NULL,
	`echecs` integer DEFAULT 0 NOT NULL,
	`bloque_jusqua` integer
);

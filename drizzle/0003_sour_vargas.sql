CREATE TABLE `visites` (
	`jour` text NOT NULL,
	`chemin` text NOT NULL,
	`vues` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`jour`, `chemin`)
);

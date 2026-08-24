// Contenu éditable du site — l'admin portail modifiera ces données.
// ponytail: contenu en TS statique pour la v1 ; à déplacer en DB/CMS quand l'admin arrive.

export const site = {
  name: "SOAM GROUP",
  tagline: "Intégrateur technologique — Ouagadougou, Burkina Faso",
  phone: "+226 25 XX XX XX",
  whatsapp: "+226 70 XX XX XX",
  email: "contact@soamgroup.net",
  address: "Ouagadougou, Burkina Faso — Zone du Bois, Rue 12.09",
  hours: "Lundi – Vendredi : 08h00 – 17h00",
};

export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "/expertises" },
  { label: "Solutions", href: "/solutions" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Logiciels", href: "/logiciels" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export type Color = "primary" | "green" | "orange";

export const hero = {
  badge: "Votre partenaire technologique de confiance",
  title: "Des solutions technologiques complètes pour propulser votre organisation",
  subtitle:
    "Informatique, cybersécurité, logiciels métiers, réseaux, énergie solaire et formation : SOAM GROUP couvre l'ensemble de vos besoins numériques, de la conception à la maintenance.",
  videoSrc: "/videos/hero.mp4",
  imageSeed: "soam-hero-tech-africa", // sert de poster pendant le chargement de la vidéo
};

export const stats = [
  { n: "250+", label: "Projets réalisés", icon: "folder-check", color: "text-primary" },
  { n: "120+", label: "Clients accompagnés", icon: "users", color: "text-accent-green" },
  { n: "11", label: "Domaines d'expertise", icon: "layers", color: "text-accent-orange" },
  { n: "10+", label: "Années d'expérience", icon: "award", color: "text-primary" },
] as const;

export const expertises = [
  {
    slug: "informatique-infrastructure",
    icon: "server",
    title: "Informatique & Infrastructure",
    description:
      "Architecture réseau, serveurs, virtualisation et cloud hybride pour votre organisation.",
    color: "primary" as Color,
    imageSeed: "server-room-datacenter",
    longDescription:
      "Nous concevons, déployons et maintenons des infrastructures informatiques fiables et évolutives : serveurs physiques et virtuels, baies de stockage, postes de travail, sauvegarde et reprise après sinistre. Notre approche hybride combine on-premise et cloud pour garantir performance, disponibilité et maîtrise des coûts.",
    prestations: [
      "Audit et conception d'architecture",
      "Fourniture et installation de serveurs et postes de travail",
      "Virtualisation et cloud hybride",
      "Solutions de sauvegarde et continuité d'activité",
      "Contrats de maintenance et supervision",
    ],
  },
  {
    slug: "cybersecurite",
    icon: "shield",
    title: "Cybersécurité",
    description:
      "Protection des systèmes d'information, audit de sécurité et conformité réglementaire.",
    color: "primary" as Color,
    imageSeed: "cybersecurity-shield",
    longDescription:
      "Face à des menaces en constante évolution, nous protégeons votre système d'information de bout en bout : audit et test d'intrusion, pare-feu nouvelle génération, détection proactive, sensibilisation des utilisateurs et mise en conformité. Notre SOC surveille vos infrastructures 24h/24 et 7j/7.",
    prestations: [
      "Audit de sécurité et tests d'intrusion",
      "Pare-feu, VPN et segmentation réseau",
      "Centre opérationnel de sécurité (SOC) 24/7",
      "Sauvegarde sécurisée et plan de réponse aux incidents",
      "Sensibilisation et formation des équipes",
    ],
  },
  {
    slug: "logiciels-applications",
    icon: "code-2",
    title: "Logiciels & Applications",
    description:
      "Développement sur mesure de solutions logicielles métiers adaptées à votre secteur.",
    color: "green" as Color,
    imageSeed: "software-development-code",
    longDescription:
      "Du cahier des charges à la mise en production, nous développons des applications web et mobiles sur mesure : applications métiers, portails clients, API et intégrations. Nos produits packagés SOAM couvrent les besoins courants (comptabilité, RH, scolaire, santé) et se personnalisent à votre processus.",
    prestations: [
      "Analyse fonctionnelle et cadrage",
      "Développement web et mobile sur mesure",
      "Intégration et interopérabilité (API)",
      "Migration de données et reprise",
      "Maintenance évolutive et support",
    ],
  },
  {
    slug: "transformation-numerique",
    icon: "refresh-cw",
    title: "Transformation numérique",
    description:
      "Digitalisation de vos processus métiers et modernisation de votre système d'information.",
    color: "green" as Color,
    imageSeed: "digital-transformation-office",
    longDescription:
      "Nous accompagnons les organisations dans la digitalisation complète de leurs processus : dématérialisation documentaire, workflow de validation, gestion électronique, conduite du changement. Objectif : gagner en efficacité, traçabilité et qualité de service, avec une adoption réelle par vos équipes.",
    prestations: [
      "Cartographie et digitalisation des processus",
      "Dématérialisation et GED",
      "Automatisation des workflows",
      "Accompagnement au changement et formation",
    ],
  },
  {
    slug: "reseaux-telecommunications",
    icon: "network",
    title: "Réseaux & Télécommunications",
    description:
      "Conception et déploiement d'infrastructures réseau fiables et performantes.",
    color: "orange" as Color,
    imageSeed: "network-fiber-optic",
    longDescription:
      "Câblage cuivre et fibre optique, réseaux LAN/WLAN d'entreprise, liaisons inter-sites, WiFi haute densité et téléphonie IP : nous déployons des réseaux certifiés dimensionnés pour votre croissance, avec une QoS adaptée à chaque usage (voix, données, vidéo).",
    prestations: [
      "Câblage structuré cuivre et fibre optique",
      "Réseaux LAN/WAN et WiFi haute densité",
      "Téléphonie IP et visioconférence",
      "Interconnexion multi-sites (VPN/MPLS)",
      "Supervision et exploitation réseau",
    ],
  },
  {
    slug: "securite-electronique",
    icon: "camera",
    title: "Sécurité électronique",
    description:
      "Vidéosurveillance, contrôle d'accès et systèmes d'alarme pour vos locaux.",
    color: "orange" as Color,
    imageSeed: "security-camera-cctv",
    longDescription:
      "Protégez vos locaux et vos personnes avec des systèmes électroniques intelligents : vidéosurveillance IP haute définition avec analyse embarquée, contrôle d'accès badgée ou biométrique, alarme intrusion et interphonie. Le tout centralisable dans notre plateforme SOAM SECURITY.",
    prestations: [
      "Vidéosurveillance IP et analyse vidéo",
      "Contrôle d'accès physique (badge, biométrie)",
      "Alarmes intrusion et détection incendie",
      "Interphonie et gestion des visiteurs",
      "Centralisation et télésurveillance",
    ],
  },
  {
    slug: "energie-solaire",
    icon: "sun",
    title: "Énergie solaire",
    description:
      "Installation de systèmes photovoltaïques pour l'autonomie énergétique de votre structure.",
    color: "orange" as Color,
    imageSeed: "solar-panels-africa",
    longDescription:
      "Étude, dimensionnement et installation de systèmes photovoltaïques raccordés ou autonomes : autoconsommation pour entreprises, sites isolés, pompage solaire et centrales jusqu'à plusieurs centaines de kWc. Nous assurons le suivi de production et la maintenance pour garantir votre retour sur investissement.",
    prestations: [
      "Étude de faisabilité et dimensionnement",
      "Installations photovoltaïques raccordées et autonomes",
      "Pompage solaire agricole et hydro-agricole",
      "Stockage batterie et hybridation groupe électrogène",
      "Monitoring et maintenance de centrales",
    ],
  },
  {
    slug: "formation-numerique",
    icon: "graduation-cap",
    title: "Formation numérique",
    description:
      "Programmes de formation certifiants en informatique et transformation numérique.",
    color: "green" as Color,
    imageSeed: "digital-training-classroom",
    longDescription:
      "Nos programmes certifiants montent en compétences vos équipes sur les outils numériques du quotidien comme sur les technologies avancées : bureautique, cybersécurité, développement, gestion de projet digital. Formations intra-entreprise sur mesure ou parcours inter-entreprises dans nos centres.",
    prestations: [
      "Bureautique et outils collaboratifs",
      "Formations techniques (réseaux, sécurité, développement)",
      "Parcours certifiants et TFP",
      "Formation intra-entreprise sur mesure",
    ],
  },
  {
    slug: "infographie-design",
    icon: "pen-tool",
    title: "Infographie & Design",
    description:
      "Identité visuelle, supports de communication et conception graphique professionnelle.",
    color: "primary" as Color,
    imageSeed: "graphic-design-studio",
    longDescription:
      "Notre studio créatif donne une identité forte à votre marque : logo et charte graphique, supports print et digitaux, signalétique, habillage réseaux sociaux. Une image professionnelle qui renforce votre crédibilité auprès de vos clients et partenaires.",
    prestations: [
      "Identité visuelle et charte graphique",
      "Supports print (plaquettes, affiches, rapports)",
      "Design digital (web, réseaux sociaux)",
      "Signalétique et habillage de locaux",
    ],
  },
  {
    slug: "commerce-general",
    icon: "shopping-cart",
    title: "Commerce général",
    description:
      "Fourniture d'équipements informatiques, consommables et matériels bureautiques.",
    color: "primary" as Color,
    imageSeed: "it-equipment-store",
    longDescription:
      "Partenaire des grandes marques (HP, Dell, Lenovo, Cisco), nous fournissons équipements informatiques, matériels bureautiques, mobilier de bureau et consommables, avec garantie locale et service après-vente assuré par nos techniciens certifiés.",
    prestations: [
      "Équipements informatiques et périphériques",
      "Matériels bureautiques et impression",
      "Consommables et accessoires",
      "Garantie locale et SAV certifié",
    ],
  },
];

export const featuredSolution = {
  badge: "Solution phare",
  title: "Solution Entreprise",
  slug: "entreprise",
  description:
    "ERP complet, sécurité, infrastructure et accompagnement pour les moyennes et grandes entreprises.",
  imageSeed: "enterprise-solution-building",
};

export const solutions = [
  {
    slug: "sante",
    title: "Solution Santé",
    desc: "Dossiers patients, gestion hospitalière et télémédecine.",
    icon: "heart-pulse",
    color: "green" as Color,
    longDescription:
      "Une offre complète pour cliniques, hôpitaux et centres de santé : dossier patient électronique, gestion des consultations et de la pharmacie, facturation médicale et télémédecine. Conçue pour les réalités du terrain : connectivité limitée, équipes multiples, exigences de traçabilité.",
    points: [
      "Dossier patient électronique partagé",
      "Gestion des consultations et rendez-vous",
      "Pharmacie et stock médicaments",
      "Facturation et assurance",
      "Télémédecine et télé-expertise",
    ],
    imageSeed: "health-solution-hospital",
  },
  {
    slug: "education",
    title: "Solution Éducation",
    desc: "Gestion scolaire, plateforme e-learning et communication.",
    icon: "graduation-cap",
    color: "primary" as Color,
    longDescription:
      "Digitalisez la vie scolaire de la maternelle à l'université : inscription en ligne, notes et bulletins, emplois du temps, communication parents via SMS et application mobile, e-learning. Déployée dans plus de 1 200 établissements à travers le pays.",
    points: [
      "Inscriptions et scolarité en ligne",
      "Notes, bulletins et conseils de classe",
      "Communication parents (SMS + app mobile)",
      "Plateforme e-learning intégrée",
      "Tableaux de bord de direction",
    ],
    imageSeed: "education-solution-school",
  },
  {
    slug: "securite",
    title: "Solution Sécurité",
    desc: "Vidéosurveillance, contrôle d'accès et cybersécurité.",
    icon: "shield-check",
    color: "orange" as Color,
    longDescription:
      "La convergence de la sécurité physique et logique : vidéosurveillance intelligente, contrôle d'accès centralisé, détection d'intrusion et cybersécurité des systèmes. Supervision unifiée depuis SOAM SECURITY, alertes temps réel et historique complet.",
    points: [
      "Vidéosurveillance IP intelligente",
      "Contrôle d'accès centralisé multi-sites",
      "Détection intrusion et alarmes",
      "Cybersécurité associée (SOC)",
      "Application mobile de supervision",
    ],
    imageSeed: "security-solution-monitoring",
  },
  {
    slug: "energie",
    title: "Solution Énergie",
    desc: "Systèmes solaires, gestion énergétique et smart building.",
    icon: "zap",
    color: "green" as Color,
    longDescription:
      "Maîtrisez votre énergie : installations photovoltaïques dimensionnées à votre consommation, monitoring de production en temps réel, gestion intelligente du bâtiment (éclairage, climatisation, prises pilotées) et hybridation avec groupes électrogènes pour une continuité totale.",
    points: [
      "Autoconsommation photovoltaïque",
      "Monitoring de production et consommation",
      "Smart building (GTB simplifiée)",
      "Hybridation solaire + groupe + batterie",
    ],
    imageSeed: "energy-solution-solar",
  },
  {
    slug: "entreprise",
    title: "Solution Entreprise",
    desc: "ERP complet, sécurité, infrastructure et accompagnement pour les moyennes et grandes entreprises.",
    icon: "building",
    color: "primary" as Color,
    longDescription:
      "La solution phare de SOAM GROUP pour les moyennes et grandes entreprises : un socle complet qui réunit gestion (ERP), cybersécurité et infrastructure réseau, déployé et opéré par nos équipes. Un interlocuteur unique pour digitaliser l'ensemble de votre organisation, avec un accompagnement continu garanti.",
    points: [
      "ERP intégré : finance, stocks, RH, ventes",
      "Cybersécurité managée (SOC, audit, sensibilisation)",
      "Infrastructure réseau et serveurs certifiés",
      "Support technique et maintenance continue",
      "Formation des équipes incluse",
    ],
    imageSeed: "enterprise-solution-building",
  },
];

export const whyItems = [
  {
    icon: "zap",
    title: "Expertise technique",
    text: "Des ingénieurs certifiés maîtrisant les dernières technologies du marché.",
    color: "primary" as Color,
  },
  {
    icon: "layers",
    title: "Solutions intégrées",
    text: "Un écosystème complet couvrant tous vos besoins technologiques.",
    color: "green" as Color,
  },
  {
    icon: "user-check",
    title: "Approche personnalisée",
    text: "Chaque projet est unique. Nous adaptons nos solutions à vos réalités.",
    color: "orange" as Color,
  },
  {
    icon: "headphones",
    title: "Accompagnement continu",
    text: "Support technique, formation et maintenance après déploiement.",
    color: "primary" as Color,
  },
  {
    icon: "lightbulb",
    title: "Innovation",
    text: "Veille technologique permanente pour vous proposer le meilleur.",
    color: "green" as Color,
  },
  {
    icon: "map-pin",
    title: "Proximité",
    text: "Présence locale et connaissance du contexte africain.",
    color: "orange" as Color,
  },
];

export const portfolioFilters = [
  "Tous",
  "Infrastructure",
  "Logiciels",
  "Cybersécurité",
  "Énergie",
  "Transformation numérique",
];

export const portfolio = [
  {
    slug: "reseau-campus-uao",
    category: "Infrastructure",
    title: "Réseau Campus UAO",
    description:
      "Déploiement complet du réseau filaire et Wi-Fi pour 5 000 utilisateurs.",
    imageSeed: "university-campus-network",
    color: "primary" as Color,
    featured: true,
    contexte:
      "L'Université Ouaga 2000 accueillait 5 000 étudiants et 400 personnels sur un réseau vieillissant, saturé aux heures de pointe et impossible à administrer centralement.",
    mission:
      "Conception et déploiement d'un réseau filaire et Wi-Fi nouvelle génération : cœur de réseau redondant, câblage cat6A de 42 bâtiments, 380 bornes Wi-Fi 6, segmentation par VLAN (pédagogie, recherche, administration, résidences) et portail captif.",
    resultats: [
      "5 000 utilisateurs simultanés sans saturation",
      "Couverture Wi-Fi 100% du campus",
      "Temps de résolution des incidents divisé par 4 grâce à la supervision",
    ],
  },
  {
    slug: "soam-clinic-chu",
    category: "Logiciels",
    title: "SOAM CLINIC – CHU",
    description:
      "Implémentation du dossier patient électronique pour 400 lits.",
    imageSeed: "hospital-software-team",
    color: "green" as Color,
    featured: false,
    contexte:
      "Un CHU de 400 lits gérait encore ses dossiers patients sur papier : pertes de dossiers, files d'attente, facturation manuelle et absence d'historique médical fiable.",
    mission:
      "Déploiement de SOAM CLINIC : dossier patient électronique, circuit de soins informatisé, pharmacie et facturation. Formation de 300 soignants et migration de 10 ans d'archives médicales.",
    resultats: [
      "Dossier patient disponible en moins de 2 secondes",
      "Zéro dossier perdu depuis la mise en production",
      "Temps de facturation réduit de 70%",
    ],
  },
  {
    slug: "soc-banque-atlantique",
    category: "Cybersécurité",
    title: "SOC Banque Atlantique",
    description: "Centre opérationnel de sécurité avec monitoring 24/7.",
    imageSeed: "security-operations-center",
    color: "orange" as Color,
    featured: false,
    contexte:
      "Une banque panafricaine faisait face à une recrudescence de tentatives de phishing et d'intrusions sur son réseau d'agences, sans équipe dédiée à la surveillance de sécurité.",
    mission:
      "Mise en place d'un centre opérationnel de sécurité (SOC) : SIEM centralisé, corrélation des journaux des 87 agences, playbooks de réponse aux incidents et astreinte 24/7 assurée par nos analystes certifiés.",
    resultats: [
      "Détection moyenne des incidents : 8 minutes",
      "87 agences supervisées en continu",
      "0 incident majeur depuis la mise en service",
    ],
  },
  {
    slug: "centrale-solaire-ong",
    category: "Énergie",
    title: "Centrale solaire ONG",
    description: "Système 50 kWc pour autonomie énergétique complète.",
    imageSeed: "solar-farm-africa",
    color: "green" as Color,
    featured: false,
    contexte:
      "Une ONG internationale gérait un site de 2 hectares en zone rurale alimenté exclusivement par groupe électrogène : coût du carburant explosif et coupures fréquentes perturbant les activités.",
    mission:
      "Dimensionnement et construction d'une centrale solaire de 50 kWc avec stockage batterie de 120 kWh et hybridation automatique du groupe existant. Monitoring à distance et formation des équipes locales à la maintenance de premier niveau.",
    resultats: [
      "92% de l'énergie produite par le soleil",
      "Facture carburant réduite de 85%",
      "Continuité électrique 24h/24",
    ],
  },
  {
    slug: "digitalisation-ministere-education",
    category: "Transformation numérique",
    title: "Digitalisation Ministère de l'Éducation",
    description:
      "Plateforme nationale de gestion scolaire déployée dans 1 200 établissements.",
    imageSeed: "ministry-digital-government",
    color: "primary" as Color,
    featured: true,
    span: 2,
    contexte:
      "Le ministère consolidait les résultats scolaires de 1 200 établissements par collecte papier : plusieurs mois de délais, erreurs de saisie nombreuses et aucune vision temps réel du système éducatif.",
    mission:
      "Conception et déploiement d'une plateforme nationale de gestion scolaire : saisie décentralisée des notes, bulletins automatisés, tableaux de bord ministériels et communication parents. Déploiement progressif avec formation de 3 500 personnels.",
    resultats: [
      "1 200 établissements connectés",
      "Bulletins produits en 48h au lieu de 3 mois",
      "3 500 agents formés et autonomes",
    ],
  },
];

export const softwareProducts = [
  {
    slug: "soam-cg-pv",
    name: "SOAM CG et PV",
    tagline: "Comptabilité Générale & Paie",
    description:
      "Solution de comptabilité et gestion de la paie conforme aux normes SYSCOHADA.",
    features: [
      "Grand livre & balance",
      "États financiers",
      "Gestion de la paie",
      "Déclarations fiscales",
    ],
    color: "primary" as Color,
    imageSeed: "accounting-software-dashboard",
    longDescription:
      "SOAM CG et PV digitalise toute la chaîne comptable et paie des PME et cabinets : saisie assistée, lettrage automatique, états financiers conformes SYSCOHADA révisé et déclarations fiscales générées en un clic. Multi-dossiers, multi-exercices, avec une piste d'audit fiable.",
    benefits: [
      "Conformité SYSCOHADA révisé garantie",
      "Paie intégralement paramétrable (conventions, primes)",
      "Exports fiscaux et tableaux de bord direction",
    ],
  },
  {
    slug: "soam-rh",
    name: "SOAM RH",
    tagline: "Ressources Humaines",
    description:
      "Gestion complète du personnel, recrutement, formation et évaluation des performances.",
    features: [
      "Fiches employés",
      "Suivi des présences",
      "Gestion des congés",
      "Évaluation annuelle",
    ],
    color: "green" as Color,
    imageSeed: "hr-software-dashboard",
    longDescription:
      "SOAM RH centralise tout le cycle de vie de l'employé : recrutement, onboarding, présences pointées, congés validés en workflow, entretiens annuels et plan de formation. Self-service employé inclus pour réduire la charge administrative.",
    benefits: [
      "Self-service employé (solde congés, bulletins)",
      "Pointage biométrique intégré",
      "Indicateurs RH temps réel",
    ],
  },
  {
    slug: "soam-school",
    name: "SOAM SCHOOL",
    tagline: "Gestion Scolaire",
    description:
      "Plateforme digitale pour la gestion des élèves, notes, emplois du temps et parents.",
    features: [
      "Gestion des élèves",
      "Notes & bulletins",
      "Emplois du temps",
      "Communication parents",
    ],
    color: "orange" as Color,
    imageSeed: "school-management-dashboard",
    longDescription:
      "SOAM SCHOOL est la plateforme de référence pour la gestion scolaire en Afrique de l'Ouest : inscriptions, notes et bulletins conformes, emplois du temps automatiques, cahier de texte numérique et communication parents par SMS et application mobile.",
    benefits: [
      "Bulletins conformes générés en 1 clic",
      "Application parents iOS / Android / USSD",
      "Fonctionne avec connexion instable (mode dégradé)",
    ],
  },
  {
    slug: "soam-clinic",
    name: "SOAM CLINIC",
    tagline: "Gestion Hospitalière",
    description:
      "Dossiers patients électroniques, consultations, pharmacie et facturation médicale.",
    features: [
      "Dossiers patients",
      "Consultations",
      "Gestion des rendez-vous",
      "Facturation médicale",
    ],
    color: "primary" as Color,
    imageSeed: "clinic-management-dashboard",
    longDescription:
      "SOAM CLINIC accompagne cliniques et hôpitaux dans l'informatisation complète du parcours patient : dossier médical partagé, circuit de soins, gestion pharmaceutique liée aux prescriptions et facturation tiers payant.",
    benefits: [
      "Dossier patient accessible en 2 secondes",
      "Interactions médicamenteuses signalées",
      "Facturation assurance/tiers payant intégrée",
    ],
  },
  {
    slug: "soam-pharma",
    name: "SOAM PHARMA",
    tagline: "Gestion Pharmacie",
    description:
      "Gestion des stocks médicaments, ventes, ordonnances et traçabilité.",
    features: [
      "Stock médicaments",
      "Ventes & ordonnances",
      "Alertes péremption",
      "Rapports de vente",
    ],
    color: "green" as Color,
    imageSeed: "pharmacy-management-dashboard",
    longDescription:
      "SOAM PHARMA sécurise la gestion de l'officine et de la pharmacie hospitalière : stocks multi-dépôts, dates de péremption surveillées, dispensation sur ordonnance tracée et rapprochement automatique avec les fournisseurs.",
    benefits: [
      "Ruptures de stock évitées (alertes prédictives)",
      "Traçabilité lot par lot complète",
      "Caisse et assurances intégrées",
    ],
  },
  {
    slug: "soam-security",
    name: "SOAM SECURITY",
    tagline: "Surveillance & Sécurité",
    description:
      "Plateforme de gestion des systèmes de vidéosurveillance et contrôle d'accès.",
    features: [
      "Gestion des caméras",
      "Contrôle d'accès",
      "Alertes temps réel",
      "Historique des événements",
    ],
    color: "orange" as Color,
    imageSeed: "security-monitoring-dashboard",
    longDescription:
      "SOAM SECURITY unifie la sécurité physique : caméras IP multi-marques, contrôle d'accès, alarmes et événements consolidés sur une seule console. Analyse vidéo embarquée (franchissement de ligne, objets abandonnés) et notifications instantanées.",
    benefits: [
      "Console unique multi-sites",
      "Analyse vidéo IA embarquée",
      "Notifications mobiles temps réel",
    ],
  },
];

export const partners = [
  "Microsoft",
  "Cisco",
  "HP",
  "Dell",
  "Oracle",
  "IBM",
  "Lenovo",
  "Huawei",
];

export const testimonials = [
  {
    quote:
      "SOAM GROUP a entièrement reconfiguré notre réseau en trois semaines. Résultat : zéro interruption depuis 18 mois.",
    name: "Kofi Mensah",
    role: "DSI",
    company: "Groupe NSIA",
  },
  {
    quote:
      "Le logiciel SOAM SCHOOL a simplifié la gestion de nos 2 400 élèves. Les parents sont enchantés par le suivi en temps réel.",
    name: "Aminata Traoré",
    role: "Directrice",
    company: "Lycée Excellence",
  },
  {
    quote:
      "Excellente équipe technique. Réactive, compétente et très professionnelle. Je recommande vivement SOAM GROUP.",
    name: "Dr. Ibrahim Ouédraogo",
    role: "Médecin Chef",
    company: "Clinique Sainte Famille",
  },
  {
    quote:
      "Leur système de vidéosurveillance couvre désormais l'intégralité de nos trois entrepôts. Un déploiement impeccable, dans les délais annoncés.",
    name: "Salif Compaoré",
    role: "Directeur Logistique",
    company: "Faso Négoce",
  },
  {
    quote:
      "Grâce à SOAM PAY, nos paiements mobiles sont enfin centralisés. Le support est disponible et les mises à jour sont régulières.",
    name: "Mariam Kaboré",
    role: "Gérante",
    company: "Boutique Faso Design",
  },
];

export const news = [
  {
    slug: "partenariat-microsoft-2025",
    category: "Partenariat",
    date: "5 juin 2025",
    title:
      "SOAM GROUP et Microsoft renouvellent leur partenariat stratégique",
    excerpt:
      "Un accord étendu permettant à SOAM GROUP d'accéder aux dernières solutions cloud et IA de Microsoft.",
    imageSeed: "partnership-signing-meeting",
    body: [
      "SOAM GROUP annonce le renouvellement de son partenariat stratégique avec Microsoft pour trois années supplémentaires. Cet accord élargit notre accès aux technologies cloud Azure, aux outils d'intelligence artificielle Copilot et au programme de licences O365 destiné aux organisations africaines.",
      "« Ce partenariat nous permet de proposer à nos clients des solutions cloud de classe mondiale, adaptées aux réalités locales », explique la direction générale de SOAM GROUP. Nos ingénieurs, déjà certifiés Azure Fundamentals et Administrator, poursuivront leur montée en compétence grâce au programme de certification accéléré inclus dans l'accord.",
      "Les premières offres issues de ce partenariat — messagerie collaborative sécurisée et sauvegarde cloud hybride — seront disponibles pour nos clients dès le prochain trimestre.",
    ],
  },
  {
    slug: "forum-africain-cybersecurite-2025",
    category: "Événement",
    date: "20 mai 2025",
    title: "SOAM GROUP présent au Forum Africain de la Cybersécurité 2025",
    excerpt:
      "Notre équipe a animé trois ateliers sur la protection des infrastructures critiques en Afrique.",
    imageSeed: "cybersecurity-conference-event",
    body: [
      "SOAM GROUP était partenaire officiel de la édition 2025 du Forum Africain de la Cybersécurité, qui s'est tenu à Ouagadougou avec plus de 1 500 participants venus de 23 pays.",
      "Nos experts ont animé trois ateliers à guichets fermés : protection des infrastructures critiques, réponse aux incidents ransomware en environnement bancaire, et sécurisation des systèmes de paiement mobile, en pleine expansion dans la région.",
      "Ce forum a également été l'occasion de présenter SOAM SECURITY v2 et notre offre SOC managée, qui suscite un fort intérêt auprès des banques et opérateurs télécoms de la sous-région.",
    ],
  },
  {
    slug: "lancement-soam-security-v2",
    category: "Innovation",
    date: "10 avril 2025",
    title: "Lancement de SOAM SECURITY v2.0 avec IA intégrée",
    excerpt:
      "La nouvelle version intègre la reconnaissance faciale et l'analyse comportementale pour une sécurité renforcée.",
    imageSeed: "product-launch-innovation",
    body: [
      "SOAM GROUP dévoile SOAM SECURITY version 2.0, une mise à niveau majeure de sa plateforme unifiée de sécurité physique. Au programme : analyse vidéo augmentée par intelligence artificielle et expérience opérateur entièrement repensée.",
      "La nouvelle version intègre la reconnaissance faciale en flux (listes blanches/noires), la détection d'objets abandonnés, le franchissement de ligne et les attroupements anormaux. Chaque alerte est horodatée, illustrée et routée automatiquement vers le bon opérateur.",
      "Disponible dès maintenant pour les nouveaux clients, la migration v2 est offerte aux clients sous contrat de maintenance jusqu'à fin 2025.",
    ],
  },
];

export const faqItems = [
  {
    q: "Quels types d'entreprises accompagnez-vous ?",
    a: "SOAM GROUP accompagne les PME, grandes entreprises, institutions publiques, établissements scolaires, cliniques et toute organisation souhaitant optimiser ses outils technologiques.",
  },
  {
    q: "Proposez-vous des solutions clés en main ?",
    a: "Oui. Nos équipes assurent l'analyse, la conception, le déploiement, la formation et la maintenance de chaque solution livrée.",
  },
  {
    q: "Comment se déroule un projet chez SOAM GROUP ?",
    a: "Après une consultation initiale gratuite, nous établissons un devis détaillé. Une fois validé, notre équipe prend en charge l'ensemble du projet avec un suivi régulier.",
  },
  {
    q: "Intervenez-vous en dehors du Burkina Faso ?",
    a: "Nous avons réalisé des projets dans plusieurs pays d'Afrique de l'Ouest et sommes ouverts à toute collaboration internationale.",
  },
];

export const contactSubjects = [
  "Demande de devis",
  "Infrastructure & réseaux",
  "Cybersécurité",
  "Solutions logicielles",
  "Énergie solaire",
  "Formation",
  "Autre",
];

// Helper générique : retrouve un élément par son slug.
export function getBySlug<T extends { slug: string }>(
  items: T[],
  slug: string
): T | undefined {
  return items.find((i) => i.slug === slug);
}

// Titres et sous-titres des bannières de pages et en-têtes de sections.
// Éditable depuis l'admin (Paramètres → Blocs avancés → titres).
export const titres = {
  accueil: {
    expertises: {
      badge: "Nos expertises",
      title: "10 domaines d'expertise à votre service",
      subtitle:
        "De l'infrastructure au logiciel, SOAM GROUP couvre l'ensemble du spectre technologique pour vous offrir une approche 360°.",
    },
    solutions: {
      badge: "Nos solutions",
      title: "Solutions adaptées à chaque secteur",
      subtitle:
        "Des offres packagées conçues pour répondre aux enjeux spécifiques de votre industrie.",
    },
    why: {
      badge: "Pourquoi SOAM GROUP ?",
      title: "Ce qui nous distingue",
      subtitle:
        "Une combinaison unique d'expertise technique, d'engagement humain et de proximité avec nos clients.",
    },
    realisations: {
      badge: "Nos réalisations",
      title: "Projets phares",
      subtitle: "Une sélection de nos réalisations les plus emblématiques.",
    },
    logiciels: {
      badge: "Nos logiciels",
      title: "Solutions logicielles SOAM",
      subtitle:
        "Six produits SaaS conçus pour digitaliser les processus clés de votre organisation.",
    },
    partenaires: { badge: "Clients & Partenaires", title: "Ils nous font confiance" },
    temoignages: { badge: "Témoignages", title: "Ce que disent nos clients" },
    actualites: { badge: "Actualités", title: "Dernières nouvelles" },
    faq: {
      badge: "FAQ",
      title: "Questions fréquentes",
      subtitle: "Tout ce que vous devez savoir avant de nous contacter.",
    },
    cta: {
      title: "Prêt à transformer votre organisation ?",
      texte: "Parlons de votre projet et trouvons ensemble la solution adaptée à vos besoins.",
    },
  },
  pages: {
    expertises: {
      badge: "Nos expertises",
      title: "10 domaines d'expertise à votre service",
      subtitle:
        "De l'infrastructure au design, SOAM GROUP couvre l'ensemble du spectre technologique pour une approche 360°.",
    },
    solutions: {
      badge: "Nos solutions",
      title: "Solutions adaptées à chaque secteur",
      subtitle:
        "Des offres packagées qui combinent infrastructure, logiciels et accompagnement, prêtes à déployer.",
    },
    logiciels: {
      badge: "Nos logiciels",
      title: "Des logiciels métiers pensés pour l'Afrique",
      subtitle:
        "Six produits SaaS conçus pour digitaliser les processus clés de votre organisation, avec ou sans connexion permanente.",
    },
    realisations: {
      badge: "Nos réalisations",
      title: "Des projets qui parlent d'eux-mêmes",
      subtitle:
        "Une sélection de nos réalisations les plus emblématiques : contexte, mission et résultats mesurables.",
    },
    actualites: {
      badge: "Actualités",
      title: "Dernières nouvelles",
      subtitle: "Partenariats, événements et innovations : suivez la vie de SOAM GROUP.",
    },
    contact: {
      badge: "Contact",
      title: "Parlons de votre projet",
      subtitle: "Consultation initiale gratuite. Nous répondons sous 24h ouvrées.",
    },
    apropos: {
      badge: "À propos",
      title: "Une équipe d'ingénieurs au service de la transformation africaine",
      subtitle:
        "Depuis plus de 10 ans, SOAM GROUP conçoit et opère des solutions technologiques pour les entreprises et institutions d'Afrique de l'Ouest.",
    },
  },
};

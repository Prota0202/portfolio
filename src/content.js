export const links = {
  email: 'Abdelbadi1@protonmail.com',
  phone: '+32 485 466 702',
  linkedin: 'https://www.linkedin.com/in/abdelbadi-lababidi-929537397/',
  github: 'https://github.com/Prota0202',
  cv: 'CV-Abdelbadi-Lababidi.pdf',
};

export const experiences = [
  {
    tab: 'Terrain',
    period: '2019 — 2026',
    tag: 'Jobs étudiants',
    title: ['Le terrain', "d'abord"],
    ghost: 'TERRAIN 2019',
    desc: "Retail, pharmacie, horeca, sites industriels — jobs étudiants de 2019 à 2026, dont cinq ans en parallèle du bachelier et du master à l'ECAM (entrée en février 2021). Là où on apprend qu'un process n'existe que s'il tient un samedi à 17h.",
    milestones: [
      ['Jalon 01', '7 ans de jobs étudiants au total (2019–2026)'],
      ['Jalon 02', '5 ans en parallèle des études à l’ECAM — bachelier puis master'],
      ['Jalon 03', 'Contact client, travail en équipe, horaires décalés — et des examens en prime'],
    ],
  },
  {
    tab: 'Expert Systech',
    period: '2023',
    tag: 'Expert Systech',
    title: ['Stagiaire', 'cybersécurité'],
    ghost: 'DOCUMENTER 2023',
    desc: "Documentation de bout en bout d'une installation industrielle et bâtiment : switches Cisco, caméras, salle serveur, domotique KNX (ETS). Objectif : qu'une intervention ne dépende plus d'une seule personne.",
    milestones: [
      ['Jalon 01', 'Infrastructure réseau & bâtiment cartographiée de bout en bout'],
      ['Jalon 02', 'Procédures techniques et documentation utilisateurs rédigées'],
      ['Jalon 03', 'Support de première ligne sur le site'],
    ],
  },
  {
    tab: 'ECAM',
    period: 'Jan — Juin 2025',
    tag: 'ECAM Brussels',
    title: ['Superviseur', 'de projets'],
    ghost: 'COORDONNER 2025',
    desc: "Accompagnement d'équipes d'étudiants de 1re année sur un cycle projet complet : cadrage, planning, communication, livraison à date. Le rôle : faire le lien entre le brief et les équipes qui exécutent.",
    milestones: [
      ['Jalon 01', 'Cycle complet suivi : cadrage → planning → livraison'],
      ['Jalon 02', 'Points de suivi réguliers entre le brief et les équipes'],
      ['Jalon 03', 'Coaching communication et travail d’équipe'],
    ],
  },
  {
    tab: 'AYOURIS · DevOps',
    period: 'Jan — Fév 2026',
    tag: 'AYOURIS',
    title: ['Ingénieur', 'DevOps (stage)'],
    ghost: 'BASCULER 2026',
    desc: "Migration de la plateforme SaaS Nawat Prime vers une architecture en cluster haute disponibilité. Chaque maintenance traitée comme une intervention planifiée : préparer, garder le service debout, prévoir le retour arrière.",
    milestones: [
      ['Jalon 01', 'Préparation de la bascule sous contrainte de continuité'],
      ['Jalon 02', 'Tolérance aux pannes et plan de reprise (DR)'],
      ['Jalon 03', 'Maintenances et mises à jour quasi sans interruption'],
    ],
  },
  {
    tab: 'AYOURIS · TFE',
    period: 'Fév — Juin 2026',
    tag: 'AYOURIS · Hand Talk',
    title: ['Ingénieur IA', '(stage · TFE)'],
    ghost: 'MESURER 2026',
    desc: "Preuve de concept : langue des signes française → texte et voix, via webcam (MediaPipe) et un gant instrumenté ESP32. Pas une démo qui marche une fois : une évaluation qu'on peut rejouer et expliquer.",
    milestones: [
      ['Jalon 01', '98,2 % de précision hold-out sur 16 signes'],
      ['Jalon 02', '84 % sur 5 signataires jamais vus — la vraie question'],
      ['Jalon 03', 'Mode replay sans matériel + suite de tests pytest'],
    ],
  },
  {
    tab: 'ORIGO',
    period: '2026',
    tag: 'Indépendant · produit solo',
    title: ['ORIGO —', 'Commande Pro'],
    ghost: 'LIVRER 2026',
    desc: "Un produit pris de bout en bout, seul : besoin client, périmètre, règles métier, mise en ligne, présentation… puis vente à un client B2B. Cadrage, planning et documentation tenus jusqu'à la livraison.",
    milestones: [
      ['Jalon 01', 'Brief recueilli chez le client, périmètre écrit'],
      ['Jalon 02', 'Règles métier & doc de passation livrées'],
      ['Jalon 03', 'Présenté, livré, en production 24/7 — et vendu'],
    ],
  },
];

export const projects = [
  {
    name: 'ORIGO',
    sub: 'Commande Pro · produit solo vendu en B2B',
    tags: ['Cadrage', 'Règles métier', 'Go-live'],
    accent: '#c8ff3e',
    kicker: 'SOLD · B2B',
    url: 'https://github.com/Prota0202/Origo',
  },
  {
    name: 'HAND TALK',
    sub: 'LSF → texte & voix · TFE chez AYOURIS',
    tags: ['PoC', 'Évaluation', 'Hardware'],
    accent: '#ff3b5c',
    kicker: '98.2 % · 84 %',
    url: 'https://github.com/Prota0202/Hand-Talk-Translator',
  },
  {
    name: 'JOB MATCH',
    sub: 'LLM vs modèle simple · mesuré, pas supposé',
    tags: ['Étude', 'ROC / AUC', 'Coût énergie'],
    accent: '#5ec8ff',
    kicker: 'LLM ⇄ ML',
    url: 'https://github.com/Prota0202/IA-and-ML-Tinder-like-for-jobs',
  },
  {
    name: 'NAWAT HA',
    sub: 'Migration haute disponibilité · AYOURIS',
    tags: ['Continuité', 'DR', 'Planification'],
    accent: '#ffb23e',
    kicker: 'ZERO DOWNTIME*',
    url: null,
  },
  {
    name: 'APPL',
    sub: 'Web + mobile · un seul modèle de données',
    tags: ['Produit', 'Web', 'Mobile'],
    accent: '#b28cff',
    kicker: '2 CLIENTS · 1 MODEL',
    url: 'https://github.com/Prota0202/AppL',
  },
  {
    name: 'TALAB',
    sub: 'Déclinaison SaaS grossistes · étude Maroc',
    tags: ['Multi-tenant', 'UML', 'Roadmap'],
    accent: '#3effc0',
    kicker: 'WHITE-LABEL',
    url: 'https://github.com/Prota0202/Talab',
  },
];

export const dossiers = [
  {
    name: 'ORIGO · Cadrer',
    kind: 'orders',
    meta: ['Dossier 01', 'Client : grossiste B2B (BE)', 'Rôle : tout, seul', 'Statut : vendu'],
    problem: 'Commandes pro par téléphone et WhatsApp, catalogues différents par client, stock qui part en négatif.',
    approach: '4 rôles (direction, préparation, livreur, client), machine à états des commandes, stock non survendable, tarifs alignés sur Odoo.',
    result: 'Mis en production 24/7 avec sauvegardes, documenté pour la passation, présenté au client — puis vendu.',
  },
  {
    name: 'Hand Talk · Mesurer',
    kind: 'hand',
    meta: ['Dossier 02', 'Cadre : TFE · AYOURIS', 'Rôle : PoC bout en bout', 'Statut : livré'],
    problem: 'Traduire la LSF en texte et en voix — et savoir si ça marche vraiment ailleurs que sur mon bureau.',
    approach: 'Protocole défini avant : collecte, entraînement, évaluation croisée sur des signataires inconnus, mode replay.',
    result: '98,2 % hold-out, 84 % sur 5 nouvelles personnes. Un écart assumé et expliqué, pas caché.',
  },
  {
    name: 'Job Match · Comparer',
    kind: 'roc',
    meta: ['Dossier 03', 'Cadre : projet académique', 'Rôle : étude & build', 'Statut : benchmarké'],
    problem: '« Mettons un LLM » — d’accord, mais par rapport à quoi, et pour quel coût ?',
    approach: 'Baseline tabulaire vs Mistral API sur un jeu étiqueté à la main, courbes ROC, suivi énergie/carbone.',
    result: 'Une décision argumentée sur le gain réel, chiffres à l’appui. Le genre de slide qu’un comité aime.',
  },
  {
    name: 'Nawat · Basculer',
    kind: 'cluster',
    meta: ['Dossier 04', 'Cadre : stage AYOURIS', 'Rôle : migration HA', 'Statut : en cluster'],
    problem: 'Une plateforme SaaS en production à migrer sans que les clients s’en rendent compte.',
    approach: 'Bascule planifiée, tolérance aux pannes, plan de reprise, retour arrière toujours possible.',
    result: 'Maintenances et mises à jour quasi sans interruption de service.',
  },
  {
    name: 'ECAM · Coordonner',
    kind: 'gantt',
    meta: ['Dossier 05', 'Cadre : ECAM Brussels', 'Rôle : superviseur', 'Statut : 6 mois'],
    problem: 'Des équipes de 1re année, un brief ambitieux, une deadline qui ne bouge pas.',
    approach: 'Découpage, jalons, points de suivi réguliers, coaching sur la communication d’équipe.',
    result: 'Un cycle projet complet mené à terme — et des étudiants qui savent faire un planning.',
  },
  {
    name: 'Systech · Documenter',
    kind: 'network',
    meta: ['Dossier 06', 'Cadre : stage 2023', 'Rôle : doc & support', 'Statut : transmis'],
    problem: 'Une installation (Cisco, caméras, salle serveur, KNX) que seule une personne connaissait vraiment.',
    approach: 'Relevé de bout en bout, schémas, procédures pas à pas, documentation pour non-spécialistes.',
    result: 'Une intervention possible par quelqu’un d’autre. Le meilleur test d’une doc.',
  },
];

export const services = [
  {
    title: 'Cadrage & analyse du besoin',
    desc: "Je pars du métier : interviews, process actuel, contraintes réelles. J'en sors un périmètre clair, des règles écrites et des priorités assumées.",
    deliverables: 'Cahier des charges · user stories · règles métier · UML',
  },
  {
    title: 'Gestion de projet & coordination',
    desc: 'Planning, jalons, suivi entre le brief et les équipes qui exécutent. Je tiens le périmètre, le calendrier et les arbitrages — sans perdre personne en route.',
    deliverables: 'Planning · roadmap · comptes rendus · suivi des risques',
  },
  {
    title: 'Traduction métier ↔ tech',
    desc: "Je parle aux deux côtés de la table. Je comprends ce que veut le métier et ce que coûte la technique — et je reformule jusqu'à ce que tout le monde parle de la même chose.",
    deliverables: 'Specs fonctionnelles · maquettes · vulgarisation · arbitrages',
  },
  {
    title: 'Preuve de concept & mesure',
    desc: "Avant d'investir, on teste. Critères de succès définis avant, prototype rapide, mesure honnête — y compris quand le résultat n'arrange personne.",
    deliverables: 'PoC · protocole d’évaluation · benchmark · rapport',
  },
  {
    title: 'Documentation & passation',
    desc: "Procédures, docs utilisateurs, formation. Pour qu'un projet continue de tourner le jour où son auteur part en vacances.",
    deliverables: 'Procédures · guides utilisateurs · formation · runbooks',
  },
];

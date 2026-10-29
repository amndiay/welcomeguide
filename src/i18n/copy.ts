export type Lang = "fr" | "en";

export interface Copy {
  site: { tagline: string; promise: string; subtitle: string; baseline: string };
  nav: {
    home: string;
    features: string;
    pricing: string;
    example: string;
    login: string;
    create: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    product: string;
    pricing: string;
    faq: string;
    contact: string;
    terms: string;
    privacy: string;
    rights: string;
  };
  hero: { primaryCta: string; secondaryCta: string; note: string };
  mockup: {
    label: string;
    city: string;
    wifi: string;
    arrival: string;
    arrivalValue: string;
    localGuide: string;
    localGuideValue: string;
    departure: string;
    departureValue: string;
    qr: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    description: string;
    questions: string[];
  };
  solution: {
    eyebrow: string;
    title: string;
    description: string;
    points: { title: string; description: string }[];
  };
  features: {
    eyebrow: string;
    homeTitle: string;
    pageTitle: string;
    pageDescription: string;
    items: { title: string; description: string }[];
  };
  steps: {
    eyebrow: string;
    title: string;
    items: { title: string; description: string }[];
  };
  audience: {
    hostEyebrow: string;
    hostTitle: string;
    hostItems: { title: string; description: string }[];
    conciergeEyebrow: string;
    conciergeTitle: string;
    conciergeItems: { title: string; description: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      quote: string;
      name: string;
      role: string;
      city: string;
      initials: string;
    }[];
  };
  sample: { eyebrow: string; title: string; label: string };
  pricing: {
    eyebrow: string;
    homeTitle: string;
    pageTitle: string;
    pageDescription: string;
    badge: string;
    note: string;
    quote: string;
    plans: {
      name: string;
      period: string;
      tagline: string;
      features: string[];
      cta: string;
    }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    pageEyebrow: string;
    pageTitle: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  example: { eyebrow: string; description: string; cta: string };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    emailTitle: string;
    demoTitle: string;
    demoBody: string;
  };
  login: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    hintBefore: string;
    hintLink: string;
  };
  legal: {
    eyebrow: string;
    termsTitle: string;
    privacyTitle: string;
    terms: { heading: string; body: string }[];
    privacy: { heading: string; body: string }[];
  };
  guidebook: {
    welcomePrefix: string;
    hostLabel: string;
    hostAvailable: string;
    close: string;
    madeWith: string;
    toggleToEnglish: string;
    toggleToFrench: string;
  };
}

const fr: Copy = {
  site: {
    tagline: "Le livret d'accueil digital de votre location.",
    promise:
      "Créez en quelques minutes un livret d'accueil digital élégant pour vos voyageurs.",
    subtitle:
      "Centralisez toutes les informations utiles de votre logement et offrez à vos voyageurs une expérience simple, moderne et personnalisée.",
    baseline: "Votre livret d'accueil digital",
  },
  nav: {
    home: "Accueil",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    example: "Exemple",
    login: "Connexion",
    create: "Créer mon livret",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  footer: {
    product: "Produit",
    pricing: "Tarifs",
    faq: "FAQ",
    contact: "Contact",
    terms: "Conditions",
    privacy: "Confidentialité",
    rights: "Tous droits réservés.",
  },
  hero: {
    primaryCta: "Créer mon livret gratuitement",
    secondaryCta: "Voir un exemple",
    note: "Essai gratuit · Aucune application à installer · Vos voyageurs n'ont pas de compte à créer",
  },
  mockup: {
    label: "Livret d'accueil",
    city: "Dakar, Sénégal",
    wifi: "Wi-Fi",
    arrival: "Arrivée",
    arrivalValue: "Boîte à clés — 7702",
    localGuide: "Guide local",
    localGuideValue: "6 adresses testées",
    departure: "Départ",
    departureValue: "Avant 11h00",
    qr: "Scannez le QR Code posé dans le salon pour retrouver ce livret.",
  },
  problem: {
    eyebrow: "Le problème",
    title: "Les mêmes questions, encore et encore.",
    description:
      "Chaque séjour, les mêmes messages à 23h. Un livret d'accueil bien fait y répond une fois pour toutes.",
    questions: [
      "Quel est le Wi-Fi ?",
      "Comment fonctionne la climatisation ?",
      "Où sont les clés ?",
      "À quelle heure faut-il partir ?",
      "Où trouver un bon restaurant ?",
      "Comment rejoindre l'aéroport ?",
    ],
  },
  solution: {
    eyebrow: "La solution",
    title: "Dalal, le guide digital du séjour.",
    description:
      "Pas un logiciel de gestion de plus : simplement le livret d'accueil de votre logement, en version digitale et toujours à jour.",
    points: [
      {
        title: "Un lien, tout le séjour",
        description:
          "De l'arrivée au départ, vos voyageurs suivent un guide clair sur leur téléphone.",
      },
      {
        title: "Disponible 24h/24",
        description:
          "Le livret répond pour vous, même quand vous dormez ou que vous êtes en déplacement.",
      },
      {
        title: "À votre image",
        description:
          "Un rendu soigné et chaleureux qui valorise votre logement dès la première minute.",
      },
    ],
  },
  features: {
    eyebrow: "Fonctionnalités",
    homeTitle: "Un livret complet, sans rien oublier.",
    pageTitle: "Tout ce dont vos voyageurs ont besoin, au même endroit.",
    pageDescription:
      "Chaque rubrique du livret est pensée pour répondre à une question que l'on vous pose déjà.",
    items: [
      {
        title: "Livret digital",
        description:
          "Une page élégante et mobile-first qui regroupe tout le séjour, accessible en un lien.",
      },
      {
        title: "QR Code",
        description:
          "Un QR Code à imprimer et poser dans le logement : vos voyageurs scannent et accèdent au livret.",
      },
      {
        title: "Check-in",
        description:
          "Horaires, accès à l'immeuble, boîte à clés, code d'entrée, instructions pas à pas.",
      },
      {
        title: "Wi-Fi",
        description:
          "Nom du réseau et mot de passe copiables en un geste, sans faute de frappe.",
      },
      {
        title: "Règles de la maison",
        description:
          "Bruit, fumeurs, animaux, fêtes : vos règles présentées clairement et sans ambiguïté.",
      },
      {
        title: "Guide local",
        description:
          "Vos restaurants, plages, marchés et coups de cœur autour du logement.",
      },
      {
        title: "Équipements",
        description:
          "Climatisation, machine à laver, télévision, cuisine : le mode d'emploi de chaque équipement.",
      },
      {
        title: "Check-out",
        description:
          "Heure de départ, clés, déchets, dernières vérifications avant de partir.",
      },
      {
        title: "Contacts utiles",
        description:
          "Vous, votre conciergerie, le taxi de confiance et les numéros d'urgence.",
      },
    ],
  },
  steps: {
    eyebrow: "Comment ça marche",
    title: "Quatre étapes, une quinzaine de minutes.",
    items: [
      {
        title: "Créez votre logement",
        description:
          "Ajoutez le nom, l'adresse et les informations de base de votre location.",
      },
      {
        title: "Personnalisez votre livret",
        description:
          "Wi-Fi, check-in, règles, équipements, bonnes adresses : tout se remplit en quelques clics.",
      },
      {
        title: "Publiez-le",
        description:
          "Votre livret devient une page web élégante, lisible sur tous les téléphones.",
      },
      {
        title: "Partagez le QR Code",
        description:
          "Imprimez-le dans le logement ou envoyez le lien avant l'arrivée de vos voyageurs.",
      },
    ],
  },
  audience: {
    hostEyebrow: "Pour les hôtes",
    hostTitle: "Un accueil digne d'un hôtel, sans effort.",
    hostItems: [
      {
        title: "Simplicité",
        description:
          "Un seul endroit pour toutes les informations du logement, sans document PDF à refaire.",
      },
      {
        title: "Gain de temps",
        description:
          "Fini les messages répétitifs : vos voyageurs trouvent la réponse tout seuls.",
      },
      {
        title: "Meilleure expérience voyageur",
        description:
          "Un séjour fluide dès l'arrivée, et des évaluations plus généreuses.",
      },
      {
        title: "Image professionnelle",
        description:
          "Un livret soigné à vos couleurs qui inspire confiance dès la réservation.",
      },
    ],
    conciergeEyebrow: "Pour les conciergeries",
    conciergeTitle: "Le même niveau de qualité sur tout votre portefeuille.",
    conciergeItems: [
      {
        title: "Multi-logements",
        description:
          "Gérez des dizaines de livrets depuis un seul espace, sans confusion.",
      },
      {
        title: "Duplication",
        description:
          "Copiez un livret existant vers un nouveau logement et ajustez les détails.",
      },
      {
        title: "Modèles",
        description:
          "Créez vos modèles maison pour garder une qualité constante partout.",
      },
      {
        title: "Gestion centralisée",
        description:
          "Mises à jour instantanées : le QR Code imprimé reste toujours valable.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ils accueillent déjà avec Dalal à Dakar, Saly et Somone",
    description:
      "Des hôtes et conciergeries partout au Sénégal utilisent Dalal au quotidien.",
    items: [
      {
        quote:
          "Mes voyageurs arrivent à 2h du matin et ne me réveillent plus : le check-in, le code de la porte et le Wi-Fi sont dans le livret. Mes notes ont grimpé.",
        name: "Awa Diagne",
        role: "Hôte, 2 appartements",
        city: "Dakar — Almadies",
        initials: "AD",
      },
      {
        quote:
          "J'envoyais le même message WhatsApp dix fois par semaine. Maintenant je partage le QR Code et tout est répondu.",
        name: "Cheikh Ndiaye",
        role: "Hôte, villa pieds dans l'eau",
        city: "Saly",
        initials: "CN",
      },
      {
        quote:
          "Ce que les voyageurs préfèrent, ce sont les bonnes adresses : restaurants, excursions, taxis. On dirait une vraie conciergerie.",
        name: "Fatou Sarr",
        role: "Conciergerie, 9 logements",
        city: "Somone",
        initials: "FS",
      },
      {
        quote:
          "La mise en place m'a pris une soirée. Le livret est aussi soigné que celui d'un hôtel, et à mes couleurs.",
        name: "Moussa Ba",
        role: "Hôte, studio",
        city: "Dakar — Ngor",
        initials: "MB",
      },
    ],
  },
  sample: {
    eyebrow: "Exemple",
    title: "Regardez un livret Dalal en vrai.",
    label: "Livret d'accueil",
  },
  pricing: {
    eyebrow: "Tarifs",
    homeTitle: "Commencez gratuitement.",
    pageTitle: "Un prix simple, par nombre de logements.",
    pageDescription:
      "Commencez gratuitement, changez d'offre quand votre portefeuille grandit.",
    badge: "Le plus choisi",
    note: "Tarifs indicatifs, configurables et susceptibles d'évoluer avant le lancement.",
    quote: "Sur devis",
    plans: [
      {
        name: "Free Trial",
        period: "14 jours",
        tagline: "Testez Dalal sur un logement, sans carte bancaire.",
        features: [
          "1 logement",
          "1 livret publié",
          "QR Code inclus",
          "Toutes les rubriques du livret",
        ],
        cta: "Commencer gratuitement",
      },
      {
        name: "Host",
        period: "mois",
        tagline: "Pour les hôtes Airbnb qui veulent un accueil impeccable.",
        features: [
          "Jusqu'à 5 logements",
          "Livrets illimités",
          "QR Code personnalisé",
          "Guide local et équipements",
          "Modifications en temps réel",
        ],
        cta: "Créer mon livret",
      },
      {
        name: "Concierge",
        period: "mois",
        tagline: "Pour les conciergeries et les hôtes professionnels.",
        features: [
          "Logements illimités",
          "Duplication de livrets",
          "Modèles réutilisables",
          "Gestion centralisée",
          "Support prioritaire",
        ],
        cta: "Parler à l'équipe",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Vos questions, nos réponses.",
    pageEyebrow: "Aide",
    pageTitle: "Tout ce qu'il faut savoir avant de commencer.",
    items: [
      {
        question: "Comment fonctionne Dalal ?",
        answer:
          "Vous créez votre logement, vous remplissez les rubriques du livret (check-in, Wi-Fi, règles, équipements, guide local, check-out) puis vous publiez. Dalal génère une page web et un QR Code que vous partagez à vos voyageurs.",
      },
      {
        question: "Est-ce compatible avec Airbnb ?",
        answer:
          "Oui. Dalal est indépendant de la plateforme de réservation : vous collez simplement le lien du livret dans vos messages automatiques Airbnb, Booking ou Abritel.",
      },
      {
        question: "Dois-je installer une application ?",
        answer:
          "Non. Dalal fonctionne directement dans le navigateur, pour vous comme pour vos voyageurs. Rien à installer, rien à mettre à jour.",
      },
      {
        question: "Puis-je utiliser plusieurs logements ?",
        answer:
          "Oui. L'offre Host couvre un petit portefeuille de logements et l'offre Concierge est pensée pour les conciergeries, avec duplication et modèles.",
      },
      {
        question: "Puis-je modifier mon livret ?",
        answer:
          "À tout moment. Vos modifications sont visibles immédiatement et le QR Code déjà imprimé continue de fonctionner.",
      },
      {
        question: "Mes voyageurs doivent-ils créer un compte ?",
        answer:
          "Jamais. Ils ouvrent le lien ou scannent le QR Code et accèdent au livret instantanément.",
      },
    ],
  },
  cta: {
    title: "Créez votre livret d'accueil ce soir.",
    description:
      "Essai gratuit, sans carte bancaire. Vos voyageurs n'ont ni compte à créer, ni application à installer.",
    primary: "Créer mon livret gratuitement",
    secondary: "Voir un exemple",
  },
  example: {
    eyebrow: "Livret de démonstration",
    description:
      "Voici exactement ce que voient vos voyageurs après avoir scanné le QR Code.",
    cta: "Créer le mien gratuitement",
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de vos logements.",
    description:
      "Hôte individuel ou conciergerie multi-logements : dites-nous ce dont vous avez besoin.",
    emailTitle: "Par e-mail",
    demoTitle: "Démonstration",
    demoBody:
      "Nous montrons Dalal en visio en 20 minutes, avec un livret créé sur l'un de vos logements.",
  },
  login: {
    title: "Créer mon livret",
    description:
      "L'authentification arrive à la prochaine étape. Laissez votre e-mail pour être prévenu de l'ouverture.",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    submit: "Bientôt disponible",
    hintBefore: "En attendant,",
    hintLink: "découvrez un livret d'exemple",
  },
  legal: {
    eyebrow: "Légal",
    termsTitle: "Conditions générales d'utilisation",
    privacyTitle: "Politique de confidentialité",
    terms: [
      {
        heading: "1. Objet",
        body: "Dalal fournit un service en ligne permettant de créer, publier et partager des livrets d'accueil digitaux pour des logements de location courte durée.",
      },
      {
        heading: "2. Compte",
        body: "L'accès à l'espace de création nécessite un compte. Vous êtes responsable de l'exactitude des informations fournies et de la confidentialité de vos identifiants.",
      },
      {
        heading: "3. Contenus",
        body: "Vous restez propriétaire des textes, photos et informations que vous publiez dans vos livrets. Vous garantissez disposer des droits nécessaires sur ces contenus.",
      },
      {
        heading: "4. Abonnements",
        body: "Les offres et tarifs en vigueur sont présentés sur la page Tarifs. L'essai gratuit ne nécessite aucun moyen de paiement et s'arrête automatiquement.",
      },
      {
        heading: "5. Responsabilité",
        body: "Dalal met en œuvre les moyens raisonnables pour assurer la disponibilité du service, sans garantie d'absence totale d'interruption.",
      },
    ],
    privacy: [
      {
        heading: "Données collectées",
        body: "Pour les hôtes : e-mail, nom et informations des logements et livrets créés. Pour les voyageurs : aucune inscription, aucune donnée personnelle requise pour consulter un livret.",
      },
      {
        heading: "Finalités",
        body: "Fournir le service de création et de publication des livrets, assurer le support et améliorer le produit.",
      },
      {
        heading: "Conservation",
        body: "Vos données sont conservées le temps de votre utilisation du service, puis supprimées sur demande ou après clôture du compte.",
      },
      {
        heading: "Vos droits",
        body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à notre adresse de contact.",
      },
    ],
  },
  guidebook: {
    welcomePrefix: "Bienvenue à",
    hostLabel: "Votre hôte",
    hostAvailable: "Hôte disponible",
    close: "Fermer",
    madeWith: "Made with",
    toggleToEnglish: "See in English 🇬🇧",
    toggleToFrench: "Voir en français 🇫🇷",
  },
};

const en: Copy = {
  site: {
    tagline: "The digital welcome book for your rental.",
    promise:
      "Create an elegant digital welcome book for your guests in just a few minutes.",
    subtitle:
      "Bring together everything guests need to know about your place and give them a simple, modern and personal experience.",
    baseline: "Your digital welcome book",
  },
  nav: {
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    example: "Example",
    login: "Log in",
    create: "Create my book",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    product: "Product",
    pricing: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    terms: "Terms",
    privacy: "Privacy",
    rights: "All rights reserved.",
  },
  hero: {
    primaryCta: "Create my book for free",
    secondaryCta: "See an example",
    note: "Free trial · No app to install · Your guests never create an account",
  },
  mockup: {
    label: "Welcome book",
    city: "Dakar, Senegal",
    wifi: "Wi-Fi",
    arrival: "Check-in",
    arrivalValue: "Key box — 7702",
    localGuide: "Local guide",
    localGuideValue: "6 tried-and-tested spots",
    departure: "Check-out",
    departureValue: "Before 11:00 am",
    qr: "Scan the QR code in the living room to open this welcome book.",
  },
  problem: {
    eyebrow: "The problem",
    title: "The same questions, over and over.",
    description:
      "Every stay brings the same messages at 11pm. A well-made welcome book answers them once and for all.",
    questions: [
      "What's the Wi-Fi password?",
      "How does the air conditioning work?",
      "Where are the keys?",
      "What time do we have to leave?",
      "Where can we find a good restaurant?",
      "How do we get to the airport?",
    ],
  },
  solution: {
    eyebrow: "The solution",
    title: "Dalal, the digital guide to the stay.",
    description:
      "Not yet another management tool: simply your property's welcome book, digital and always up to date.",
    points: [
      {
        title: "One link, the whole stay",
        description:
          "From arrival to departure, your guests follow a clear guide on their phone.",
      },
      {
        title: "Available 24/7",
        description:
          "The book answers for you, even while you sleep or when you're travelling.",
      },
      {
        title: "In your style",
        description:
          "A polished, warm design that showcases your property from the very first minute.",
      },
    ],
  },
  features: {
    eyebrow: "Features",
    homeTitle: "A complete welcome book, nothing forgotten.",
    pageTitle: "Everything your guests need, all in one place.",
    pageDescription:
      "Every section of the book is designed to answer a question you already get asked.",
    items: [
      {
        title: "Digital book",
        description:
          "An elegant, mobile-first page that covers the whole stay, opened with a single link.",
      },
      {
        title: "QR code",
        description:
          "Print the QR code and place it in the property: guests scan it and open the book.",
      },
      {
        title: "Check-in",
        description:
          "Times, building access, key box, entry code and step-by-step instructions.",
      },
      {
        title: "Wi-Fi",
        description:
          "Network name and password copied in one tap, with no typos.",
      },
      {
        title: "House rules",
        description:
          "Noise, smoking, pets, parties: your rules presented clearly and without ambiguity.",
      },
      {
        title: "Local guide",
        description:
          "Your restaurants, beaches, markets and favourite spots around the property.",
      },
      {
        title: "Amenities",
        description:
          "Air conditioning, washing machine, TV, kitchen: how to use every appliance.",
      },
      {
        title: "Check-out",
        description:
          "Departure time, keys, waste and the last checks before leaving.",
      },
      {
        title: "Useful contacts",
        description:
          "You, your property manager, a trusted taxi driver and emergency numbers.",
      },
    ],
  },
  steps: {
    eyebrow: "How it works",
    title: "Four steps, about fifteen minutes.",
    items: [
      {
        title: "Add your property",
        description:
          "Enter the name, address and basic information about your rental.",
      },
      {
        title: "Personalise your book",
        description:
          "Wi-Fi, check-in, rules, amenities, good addresses: it all fills in within a few clicks.",
      },
      {
        title: "Publish it",
        description:
          "Your book becomes an elegant web page, readable on every phone.",
      },
      {
        title: "Share the QR code",
        description:
          "Print it in the property or send the link before your guests arrive.",
      },
    ],
  },
  audience: {
    hostEyebrow: "For hosts",
    hostTitle: "A hotel-grade welcome, effortlessly.",
    hostItems: [
      {
        title: "Simplicity",
        description:
          "One single place for all property information, with no PDF to redo.",
      },
      {
        title: "Time saved",
        description:
          "No more repetitive messages: guests find the answer on their own.",
      },
      {
        title: "Better guest experience",
        description:
          "A smooth stay from the moment they arrive, and more generous reviews.",
      },
      {
        title: "Professional image",
        description:
          "A polished book in your colours that builds trust from the booking.",
      },
    ],
    conciergeEyebrow: "For property managers",
    conciergeTitle: "The same quality across your whole portfolio.",
    conciergeItems: [
      {
        title: "Multi-property",
        description:
          "Manage dozens of welcome books from a single workspace, without confusion.",
      },
      {
        title: "Duplication",
        description:
          "Copy an existing book to a new property and adjust the details.",
      },
      {
        title: "Templates",
        description:
          "Build your own templates to keep quality consistent everywhere.",
      },
      {
        title: "Central management",
        description:
          "Instant updates: the printed QR code always stays valid.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Hosts in Dakar, Saly and Somone already use Dalal",
    description:
      "Hosts and property managers across Senegal welcome their guests with Dalal.",
    items: [
      {
        quote:
          "My guests land at 2am and no longer wake me up: the check-in, the door code and the Wi-Fi are all in the book. My reviews went up.",
        name: "Awa Diagne",
        role: "Host, 2 apartments",
        city: "Dakar — Almadies",
        initials: "AD",
      },
      {
        quote:
          "I used to send the same WhatsApp message ten times a week. Now I just share the QR code and everything is answered.",
        name: "Cheikh Ndiaye",
        role: "Host, beachfront villa",
        city: "Saly",
        initials: "CN",
      },
      {
        quote:
          "The local recommendations are what guests love most: restaurants, excursions, taxis. It feels like a real concierge service.",
        name: "Fatou Sarr",
        role: "Property manager, 9 properties",
        city: "Somone",
        initials: "FS",
      },
      {
        quote:
          "Setting it up took me one evening. The book looks as polished as a hotel's, and it is in my own colours.",
        name: "Moussa Ba",
        role: "Host, studio flat",
        city: "Dakar — Ngor",
        initials: "MB",
      },
    ],
  },
  sample: {
    eyebrow: "Example",
    title: "See a real Dalal welcome book.",
    label: "Welcome book",
  },
  pricing: {
    eyebrow: "Pricing",
    homeTitle: "Start for free.",
    pageTitle: "Simple pricing, based on your number of properties.",
    pageDescription:
      "Start for free and move up a plan when your portfolio grows.",
    badge: "Most popular",
    note: "Indicative pricing, configurable and subject to change before launch.",
    quote: "On request",
    plans: [
      {
        name: "Free Trial",
        period: "14 days",
        tagline: "Try Dalal on one property, no credit card needed.",
        features: [
          "1 property",
          "1 published book",
          "QR code included",
          "All book sections",
        ],
        cta: "Start for free",
      },
      {
        name: "Host",
        period: "month",
        tagline: "For Airbnb hosts who want a flawless welcome.",
        features: [
          "Up to 5 properties",
          "Unlimited books",
          "Custom QR code",
          "Local guide and amenities",
          "Real-time updates",
        ],
        cta: "Create my book",
      },
      {
        name: "Concierge",
        period: "month",
        tagline: "For property managers and professional hosts.",
        features: [
          "Unlimited properties",
          "Book duplication",
          "Reusable templates",
          "Central management",
          "Priority support",
        ],
        cta: "Talk to the team",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Your questions, our answers.",
    pageEyebrow: "Help",
    pageTitle: "Everything you need to know before you start.",
    items: [
      {
        question: "How does Dalal work?",
        answer:
          "You add your property, fill in the sections of the book (check-in, Wi-Fi, rules, amenities, local guide, check-out) and publish. Dalal generates a web page and a QR code you share with your guests.",
      },
      {
        question: "Does it work with Airbnb?",
        answer:
          "Yes. Dalal is independent of the booking platform: just paste the book link into your automatic messages on Airbnb, Booking or Vrbo.",
      },
      {
        question: "Do I need to install an app?",
        answer:
          "No. Dalal runs directly in the browser, for you and for your guests. Nothing to install, nothing to update.",
      },
      {
        question: "Can I manage several properties?",
        answer:
          "Yes. The Host plan covers a small portfolio and the Concierge plan is built for property managers, with duplication and templates.",
      },
      {
        question: "Can I edit my book?",
        answer:
          "At any time. Your changes are visible immediately and the QR code you already printed keeps working.",
      },
      {
        question: "Do my guests need an account?",
        answer:
          "Never. They open the link or scan the QR code and access the book instantly.",
      },
    ],
  },
  cta: {
    title: "Create your welcome book tonight.",
    description:
      "Free trial, no credit card. Your guests have no account to create and no app to install.",
    primary: "Create my book for free",
    secondary: "See an example",
  },
  example: {
    eyebrow: "Demo welcome book",
    description:
      "This is exactly what your guests see after scanning the QR code.",
    cta: "Create mine for free",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your properties.",
    description:
      "Individual host or multi-property manager: tell us what you need.",
    emailTitle: "By email",
    demoTitle: "Live demo",
    demoBody:
      "We show Dalal over a 20-minute video call, with a book built on one of your properties.",
  },
  login: {
    title: "Create my book",
    description:
      "Authentication is coming in the next step. Leave your email to be notified at launch.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Coming soon",
    hintBefore: "In the meantime,",
    hintLink: "explore a sample welcome book",
  },
  legal: {
    eyebrow: "Legal",
    termsTitle: "Terms of use",
    privacyTitle: "Privacy policy",
    terms: [
      {
        heading: "1. Purpose",
        body: "Dalal provides an online service to create, publish and share digital welcome books for short-term rental properties.",
      },
      {
        heading: "2. Account",
        body: "Access to the editor requires an account. You are responsible for the accuracy of the information provided and for keeping your credentials confidential.",
      },
      {
        heading: "3. Content",
        body: "You remain the owner of the texts, photos and information you publish in your books. You warrant that you hold the necessary rights to that content.",
      },
      {
        heading: "4. Subscriptions",
        body: "Current plans and prices are shown on the Pricing page. The free trial requires no payment method and ends automatically.",
      },
      {
        heading: "5. Liability",
        body: "Dalal takes reasonable measures to keep the service available, without guaranteeing the complete absence of interruptions.",
      },
    ],
    privacy: [
      {
        heading: "Data collected",
        body: "For hosts: email, name and information about the properties and books created. For guests: no sign-up and no personal data required to read a book.",
      },
      {
        heading: "Purposes",
        body: "Provide the service for creating and publishing books, deliver support and improve the product.",
      },
      {
        heading: "Retention",
        body: "Your data is kept for as long as you use the service, then deleted on request or after the account is closed.",
      },
      {
        heading: "Your rights",
        body: "You can request access to, correction of, or deletion of your data by writing to our contact address.",
      },
    ],
  },
  guidebook: {
    welcomePrefix: "Welcome to",
    hostLabel: "Your host",
    hostAvailable: "Host available",
    close: "Close",
    madeWith: "Made with",
    toggleToEnglish: "See in English 🇬🇧",
    toggleToFrench: "Voir en français 🇫🇷",
  },
};

export const copy: Record<Lang, Copy> = { fr, en };

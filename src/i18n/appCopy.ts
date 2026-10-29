import type { Lang } from "@/i18n/copy";

/** Bilingual copy for the authenticated SaaS area (dashboard, onboarding...). */
export interface AppCopy {
  auth: {
    signInTitle: string;
    signInDescription: string;
    signUpTitle: string;
    signUpDescription: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    signIn: string;
    signUp: string;
    google: string;
    or: string;
    noAccount: string;
    haveAccount: string;
    forgot: string;
    resetTitle: string;
    resetDescription: string;
    sendReset: string;
    resetSent: string;
    newPassword: string;
    updatePassword: string;
    passwordUpdated: string;
    checkEmail: string;
    working: string;
  };
  nav: {
    dashboard: string;
    properties: string;
    guides: string;
    places: string;
    settings: string;
    signOut: string;
    backToSite: string;
    account: string;
  };
  onboarding: {
    title: string;
    step: string;
    of: string;
    next: string;
    back: string;
    finish: string;
    skip: string;
    s1Title: string;
    s1Description: string;
    orgName: string;
    s2Title: string;
    s2Description: string;
    typeIndividual: string;
    typeProfessional: string;
    typeConcierge: string;
    s3Title: string;
    s3Description: string;
    propertyName: string;
    city: string;
    country: string;
    propertyType: string;
    s4Title: string;
    s4Description: string;
    s5Title: string;
    s5Description: string;
    done: string;
  };
  dashboard: {
    greeting: string;
    subtitle: string;
    statProperties: string;
    statGuides: string;
    statPublished: string;
    statViews: string;
    quickActions: string;
    addProperty: string;
    createGuide: string;
    browsePlaces: string;
    recentProperties: string;
    empty: string;
    emptyCta: string;
  };
  properties: {
    title: string;
    subtitle: string;
    newTitle: string;
    editTitle: string;
    name: string;
    type: string;
    address: string;
    city: string;
    country: string;
    description: string;
    photo: string;
    photoHint: string;
    phone: string;
    whatsapp: string;
    wifiName: string;
    wifiPassword: string;
    checkin: string;
    checkout: string;
    status: string;
    save: string;
    cancel: string;
    archive: string;
    restore: string;
    delete: string;
    deleteConfirm: string;
    showArchived: string;
    empty: string;
    created: string;
    updated: string;
    archived: string;
    restored: string;
    deleted: string;
    guideCreated: string;
  };
  guides: {
    title: string;
    subtitle: string;
    empty: string;
    publish: string;
    unpublish: string;
    link: string;
    copyLink: string;
    copied: string;
    editorSoon: string;
    edit: string;
    forProperty: string;
  };
  places: {
    title: string;
    subtitle: string;
    all: string;
    empty: string;
    error: string;
    managedInAirtable: string;
  };
  settings: {
    title: string;
    subtitle: string;
    profile: string;
    organization: string;
    orgType: string;
    members: string;
    role: string;
    save: string;
    saved: string;
    plan: string;
    planFree: string;
  };
  status: {
    draft: string;
    active: string;
    archived: string;
    published: string;
  };
  propertyTypes: Record<
    "apartment" | "villa" | "house" | "studio" | "room" | "other",
    string
  >;
  roles: Record<"owner" | "admin" | "editor" | "viewer", string>;
  loading: string;
  errorGeneric: string;
}

const fr: AppCopy = {
  auth: {
    signInTitle: "Connexion",
    signInDescription:
      "Accédez à votre espace Dalal pour gérer vos logements et vos livrets.",
    signUpTitle: "Créer un compte",
    signUpDescription:
      "Quelques secondes suffisent pour créer votre premier livret d'accueil.",
    email: "Adresse e-mail",
    password: "Mot de passe",
    firstName: "Prénom",
    lastName: "Nom",
    signIn: "Se connecter",
    signUp: "Créer mon compte",
    google: "Continuer avec Google",
    or: "ou",
    noAccount: "Pas encore de compte ?",
    haveAccount: "Vous avez déjà un compte ?",
    forgot: "Mot de passe oublié ?",
    resetTitle: "Réinitialiser le mot de passe",
    resetDescription:
      "Indiquez votre e-mail, nous vous envoyons un lien de réinitialisation.",
    sendReset: "Envoyer le lien",
    resetSent: "Lien envoyé, consultez votre boîte mail.",
    newPassword: "Nouveau mot de passe",
    updatePassword: "Mettre à jour",
    passwordUpdated: "Mot de passe mis à jour.",
    checkEmail: "Compte créé. Vérifiez votre boîte mail si une confirmation est demandée.",
    working: "Un instant…",
  },
  nav: {
    dashboard: "Tableau de bord",
    properties: "Logements",
    guides: "Livrets",
    places: "Bonnes adresses",
    settings: "Paramètres",
    signOut: "Se déconnecter",
    backToSite: "Retour au site",
    account: "Mon compte",
  },
  onboarding: {
    title: "Bienvenue sur Dalal",
    step: "Étape",
    of: "sur",
    next: "Continuer",
    back: "Retour",
    finish: "Terminer",
    skip: "Passer cette étape",
    s1Title: "Faisons connaissance",
    s1Description: "Votre nom apparaîtra comme hôte sur vos livrets d'accueil.",
    orgName: "Nom de l'organisation",
    s2Title: "Votre profil d'activité",
    s2Description: "Cela nous aide à adapter les modèles proposés.",
    typeIndividual: "Hôte particulier",
    typeProfessional: "Hôte professionnel",
    typeConcierge: "Conciergerie",
    s3Title: "Votre premier logement",
    s3Description: "Vous pourrez compléter tous les détails ensuite.",
    propertyName: "Nom du logement",
    city: "Ville",
    country: "Pays",
    propertyType: "Type de logement",
    s4Title: "Choisissez un modèle de livret",
    s4Description: "Le modèle définit les rubriques créées automatiquement.",
    s5Title: "Tout est prêt",
    s5Description:
      "Nous créons votre organisation, votre logement et un premier livret en brouillon.",
    done: "Accéder à mon tableau de bord",
  },
  dashboard: {
    greeting: "Bonjour",
    subtitle: "Voici l'état de vos livrets d'accueil.",
    statProperties: "Logements actifs",
    statGuides: "Livrets",
    statPublished: "Livrets publiés",
    statViews: "Vues voyageurs",
    quickActions: "Actions rapides",
    addProperty: "Ajouter un logement",
    createGuide: "Créer un livret",
    browsePlaces: "Explorer les bonnes adresses",
    recentProperties: "Logements récents",
    empty: "Aucun logement pour le moment.",
    emptyCta: "Ajouter mon premier logement",
  },
  properties: {
    title: "Logements",
    subtitle: "Gérez vos logements et les informations partagées aux voyageurs.",
    newTitle: "Nouveau logement",
    editTitle: "Modifier le logement",
    name: "Nom",
    type: "Type",
    address: "Adresse",
    city: "Ville",
    country: "Pays",
    description: "Description",
    photo: "Photo de couverture",
    photoHint: "JPG ou PNG, 10 Mo maximum.",
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    wifiName: "Nom du Wi-Fi",
    wifiPassword: "Mot de passe Wi-Fi",
    checkin: "Heure d'arrivée",
    checkout: "Heure de départ",
    status: "Statut",
    save: "Enregistrer",
    cancel: "Annuler",
    archive: "Archiver",
    restore: "Restaurer",
    delete: "Supprimer",
    deleteConfirm: "Supprimer définitivement ce logement et ses livrets ?",
    showArchived: "Afficher les logements archivés",
    empty: "Aucun logement à afficher.",
    created: "Logement créé.",
    updated: "Modifications enregistrées.",
    archived: "Logement archivé.",
    restored: "Logement restauré.",
    deleted: "Logement supprimé.",
    guideCreated: "Livret créé en brouillon.",
  },
  guides: {
    title: "Livrets",
    subtitle: "Tous les livrets d'accueil de votre organisation.",
    empty: "Aucun livret pour le moment.",
    publish: "Publier",
    unpublish: "Dépublier",
    link: "Lien du livret",
    copyLink: "Copier le lien",
    copied: "Lien copié.",
    editorSoon: "",
    edit: "Éditer",
    forProperty: "Logement",
  },
  places: {
    title: "Bonnes adresses",
    subtitle:
      "Sélection de lieux préparée par l'équipe Dalal, prête à être ajoutée à vos livrets.",
    all: "Toutes",
    empty: "Aucune adresse pour ce filtre.",
    error: "Impossible de charger les adresses pour le moment.",
    managedInAirtable: "Contenus gérés par l'équipe Dalal",
  },
  settings: {
    title: "Paramètres",
    subtitle: "Votre profil, votre organisation et votre équipe.",
    profile: "Profil",
    organization: "Organisation",
    orgType: "Type d'activité",
    members: "Membres",
    role: "Rôle",
    save: "Enregistrer",
    saved: "Enregistré.",
    plan: "Formule",
    planFree: "Découverte",
  },
  status: {
    draft: "Brouillon",
    active: "Actif",
    archived: "Archivé",
    published: "Publié",
  },
  propertyTypes: {
    apartment: "Appartement",
    villa: "Villa",
    house: "Maison",
    studio: "Studio",
    room: "Chambre",
    other: "Autre",
  },
  roles: {
    owner: "Propriétaire",
    admin: "Administrateur",
    editor: "Éditeur",
    viewer: "Lecteur",
  },
  loading: "Chargement…",
  errorGeneric: "Une erreur est survenue.",
};

const en: AppCopy = {
  auth: {
    signInTitle: "Sign in",
    signInDescription: "Access your Dalal space to manage stays and guidebooks.",
    signUpTitle: "Create an account",
    signUpDescription: "It only takes a moment to build your first guidebook.",
    email: "Email address",
    password: "Password",
    firstName: "First name",
    lastName: "Last name",
    signIn: "Sign in",
    signUp: "Create my account",
    google: "Continue with Google",
    or: "or",
    noAccount: "No account yet?",
    haveAccount: "Already have an account?",
    forgot: "Forgot your password?",
    resetTitle: "Reset your password",
    resetDescription: "Enter your email and we'll send you a reset link.",
    sendReset: "Send the link",
    resetSent: "Link sent, check your inbox.",
    newPassword: "New password",
    updatePassword: "Update",
    passwordUpdated: "Password updated.",
    checkEmail: "Account created. Check your inbox if confirmation is required.",
    working: "One moment…",
  },
  nav: {
    dashboard: "Dashboard",
    properties: "Properties",
    guides: "Guidebooks",
    places: "Local picks",
    settings: "Settings",
    signOut: "Sign out",
    backToSite: "Back to site",
    account: "My account",
  },
  onboarding: {
    title: "Welcome to Dalal",
    step: "Step",
    of: "of",
    next: "Continue",
    back: "Back",
    finish: "Finish",
    skip: "Skip this step",
    s1Title: "Let's get to know you",
    s1Description: "Your name appears as the host on your guidebooks.",
    orgName: "Organisation name",
    s2Title: "Your activity",
    s2Description: "This helps us tailor the templates we suggest.",
    typeIndividual: "Individual host",
    typeProfessional: "Professional host",
    typeConcierge: "Property manager",
    s3Title: "Your first property",
    s3Description: "You can complete every detail afterwards.",
    propertyName: "Property name",
    city: "City",
    country: "Country",
    propertyType: "Property type",
    s4Title: "Pick a guidebook template",
    s4Description: "The template defines the sections created for you.",
    s5Title: "You're all set",
    s5Description:
      "We'll create your organisation, your property and a first draft guidebook.",
    done: "Go to my dashboard",
  },
  dashboard: {
    greeting: "Hello",
    subtitle: "Here's how your guidebooks are doing.",
    statProperties: "Active properties",
    statGuides: "Guidebooks",
    statPublished: "Published guidebooks",
    statViews: "Guest views",
    quickActions: "Quick actions",
    addProperty: "Add a property",
    createGuide: "Create a guidebook",
    browsePlaces: "Browse local picks",
    recentProperties: "Recent properties",
    empty: "No property yet.",
    emptyCta: "Add my first property",
  },
  properties: {
    title: "Properties",
    subtitle: "Manage your properties and the details shared with guests.",
    newTitle: "New property",
    editTitle: "Edit property",
    name: "Name",
    type: "Type",
    address: "Address",
    city: "City",
    country: "Country",
    description: "Description",
    photo: "Cover photo",
    photoHint: "JPG or PNG, 10 MB max.",
    phone: "Phone",
    whatsapp: "WhatsApp",
    wifiName: "Wi-Fi name",
    wifiPassword: "Wi-Fi password",
    checkin: "Check-in time",
    checkout: "Check-out time",
    status: "Status",
    save: "Save",
    cancel: "Cancel",
    archive: "Archive",
    restore: "Restore",
    delete: "Delete",
    deleteConfirm: "Permanently delete this property and its guidebooks?",
    showArchived: "Show archived properties",
    empty: "No property to display.",
    created: "Property created.",
    updated: "Changes saved.",
    archived: "Property archived.",
    restored: "Property restored.",
    deleted: "Property deleted.",
    guideCreated: "Draft guidebook created.",
  },
  guides: {
    title: "Guidebooks",
    subtitle: "Every guidebook in your organisation.",
    empty: "No guidebook yet.",
    publish: "Publish",
    unpublish: "Unpublish",
    link: "Guidebook link",
    copyLink: "Copy link",
    copied: "Link copied.",
    editorSoon: "",
    edit: "Edit",
    forProperty: "Property",
  },
  places: {
    title: "Local picks",
    subtitle:
      "A curated selection from the Dalal team, ready to drop into your guidebooks.",
    all: "All",
    empty: "No place for this filter.",
    error: "We couldn't load the places right now.",
    managedInAirtable: "Content curated by the Dalal team",
  },
  settings: {
    title: "Settings",
    subtitle: "Your profile, your organisation and your team.",
    profile: "Profile",
    organization: "Organisation",
    orgType: "Activity type",
    members: "Members",
    role: "Role",
    save: "Save",
    saved: "Saved.",
    plan: "Plan",
    planFree: "Starter",
  },
  status: {
    draft: "Draft",
    active: "Active",
    archived: "Archived",
    published: "Published",
  },
  propertyTypes: {
    apartment: "Apartment",
    villa: "Villa",
    house: "House",
    studio: "Studio",
    room: "Room",
    other: "Other",
  },
  roles: {
    owner: "Owner",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
  },
  loading: "Loading…",
  errorGeneric: "Something went wrong.",
};

export const appCopy: Record<Lang, AppCopy> = { fr, en };

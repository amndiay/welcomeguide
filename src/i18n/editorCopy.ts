import type { Lang } from "@/i18n/copy";

export interface EditorCopy {
  back: string;
  sections: string;
  addSection: string;
  content: string;
  design: string;
  preview: string;
  saved: string;
  saving: string;
  publish: string;
  unpublish: string;
  published: string;
  draft: string;
  copyLink: string;
  copied: string;
  addBlock: string;
  duplicate: string;
  delete: string;
  hide: string;
  show: string;
  hidden: string;
  sectionTitle: string;
  deleteSection: string;
  emptySection: string;
  dragHint: string;
  guideTitle: string;
  coverImage: string;
  logo: string;
  welcomeMessage: string;
  hostName: string;
  hostAvatar: string;
  template: string;
  colors: string;
  primary: string;
  accent: string;
  background: string;
  cardStyle: string;
  buttonStyle: string;
  coverStyle: string;
  navStyle: string;
  fonts: string;
  recommendations: string;
  addRecommendation: string;
  category: string;
  name: string;
  save: string;
  cancel: string;
  noRecommendations: string;
  openGuide: string;
  addItem: string;
  editorTab: string;
  previewTab: string;
  call: string;
  itinerary: string;
  website: string;
  copyPassword: string;
  passwordCopied: string;
}

export const editorCopy: Record<Lang, EditorCopy> = {
  fr: {
    back: "Retour aux livrets",
    sections: "Sections",
    addSection: "Ajouter une section",
    content: "Contenu",
    design: "Design",
    preview: "Aperçu",
    saved: "Enregistré",
    saving: "Enregistrement...",
    publish: "Publier",
    unpublish: "Dépublier",
    published: "Publié",
    draft: "Brouillon",
    copyLink: "Copier le lien",
    copied: "Lien copié.",
    addBlock: "Ajouter un bloc",
    duplicate: "Dupliquer",
    delete: "Supprimer",
    hide: "Masquer",
    show: "Afficher",
    hidden: "Masqué",
    sectionTitle: "Titre de la section",
    deleteSection: "Supprimer la section",
    emptySection: "Cette section est vide. Ajoutez un premier bloc.",
    dragHint: "Glissez pour réorganiser",
    guideTitle: "Nom du livret",
    coverImage: "Photo de couverture (URL)",
    logo: "Logo (URL)",
    welcomeMessage: "Message de bienvenue",
    hostName: "Nom de l'hôte",
    hostAvatar: "Photo de l'hôte (URL)",
    template: "Modèle",
    colors: "Couleurs",
    primary: "Couleur principale",
    accent: "Couleur d'accent",
    background: "Fond",
    cardStyle: "Style des cartes",
    buttonStyle: "Style des boutons",
    coverStyle: "Couverture",
    navStyle: "Navigation",
    fonts: "Typographies",
    recommendations: "Recommandations",
    addRecommendation: "Ajouter une adresse",
    category: "Catégorie",
    name: "Nom",
    save: "Enregistrer",
    cancel: "Annuler",
    noRecommendations: "Aucune adresse pour ce logement.",
    openGuide: "Voir le livret",
    addItem: "Ajouter",
    editorTab: "Éditeur",
    previewTab: "Aperçu",
    call: "Appeler",
    itinerary: "Itinéraire",
    website: "Site web",
    copyPassword: "Copier le mot de passe",
    passwordCopied: "Mot de passe copié.",
  },
  en: {
    back: "Back to guidebooks",
    sections: "Sections",
    addSection: "Add a section",
    content: "Content",
    design: "Design",
    preview: "Preview",
    saved: "Saved",
    saving: "Saving...",
    publish: "Publish",
    unpublish: "Unpublish",
    published: "Published",
    draft: "Draft",
    copyLink: "Copy link",
    copied: "Link copied.",
    addBlock: "Add a block",
    duplicate: "Duplicate",
    delete: "Delete",
    hide: "Hide",
    show: "Show",
    hidden: "Hidden",
    sectionTitle: "Section title",
    deleteSection: "Delete section",
    emptySection: "This section is empty. Add your first block.",
    dragHint: "Drag to reorder",
    guideTitle: "Guidebook name",
    coverImage: "Cover photo (URL)",
    logo: "Logo (URL)",
    welcomeMessage: "Welcome message",
    hostName: "Host name",
    hostAvatar: "Host photo (URL)",
    template: "Template",
    colors: "Colors",
    primary: "Primary color",
    accent: "Accent color",
    background: "Background",
    cardStyle: "Card style",
    buttonStyle: "Button style",
    coverStyle: "Cover",
    navStyle: "Navigation",
    fonts: "Fonts",
    recommendations: "Recommendations",
    addRecommendation: "Add a place",
    category: "Category",
    name: "Name",
    save: "Save",
    cancel: "Cancel",
    noRecommendations: "No place for this property yet.",
    openGuide: "View guidebook",
    addItem: "Add",
    editorTab: "Editor",
    previewTab: "Preview",
    call: "Call",
    itinerary: "Directions",
    website: "Website",
    copyPassword: "Copy password",
    passwordCopied: "Password copied.",
  },
};

export function useEditorCopyFor(lang: Lang): EditorCopy {
  return editorCopy[lang];
}

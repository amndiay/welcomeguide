import type { Lang } from "@/i18n/copy";

export interface GuestCopy {
  quickActions: string;
  directions: string;
  whatsapp: string;
  call: string;
  wifi: string;
  checkin: string;
  sections: string;
  back: string;
  copy: string;
  copied: string;
  wifiNetwork: string;
  wifiPassword: string;
  checkinTime: string;
  checkoutTime: string;
  address: string;
  hostLabel: string;
  notFoundTitle: string;
  notFoundBody: string;
  backHome: string;
  poweredBy: string;
  whatsappMessage: string;
  share: string;
  shareLink: string;
  shareEmail: string;
  loading: string;
}

export const guestCopy: Record<Lang, GuestCopy> = {
  fr: {
    quickActions: "Accès rapide",
    directions: "Itinéraire",
    whatsapp: "WhatsApp",
    call: "Appeler",
    wifi: "Wi-Fi",
    checkin: "Check-in",
    sections: "Votre livret",
    back: "Retour",
    copy: "Copier",
    copied: "Copié !",
    wifiNetwork: "Réseau",
    wifiPassword: "Mot de passe",
    checkinTime: "Heure d'arrivée",
    checkoutTime: "Heure de départ",
    address: "Adresse",
    hostLabel: "Votre hôte",
    notFoundTitle: "Livret introuvable",
    notFoundBody:
      "Ce livret n'existe pas ou n'est pas encore publié. Demandez le lien à jour à votre hôte.",
    backHome: "Découvrir Dalal",
    poweredBy: "Livret propulsé par Dalal",
    whatsappMessage: "Bonjour, je séjourne chez vous et j'ai une question.",
    share: "Partager",
    shareLink: "Copier le lien",
    shareEmail: "Email",
    loading: "Chargement…",
  },
  en: {
    quickActions: "Quick access",
    directions: "Directions",
    whatsapp: "WhatsApp",
    call: "Call",
    wifi: "Wi-Fi",
    checkin: "Check-in",
    sections: "Your guidebook",
    back: "Back",
    copy: "Copy",
    copied: "Copied!",
    wifiNetwork: "Network",
    wifiPassword: "Password",
    checkinTime: "Check-in time",
    checkoutTime: "Check-out time",
    address: "Address",
    hostLabel: "Your host",
    notFoundTitle: "Guidebook not found",
    notFoundBody:
      "This guidebook does not exist or is not published yet. Ask your host for the latest link.",
    backHome: "Discover Dalal",
    poweredBy: "Guidebook powered by Dalal",
    whatsappMessage: "Hello, I am staying at your place and I have a question.",
    share: "Share",
    shareLink: "Copy link",
    shareEmail: "Email",
    loading: "Loading…",
  },
};

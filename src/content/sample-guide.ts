import type { Guidebook } from "@/types/guidebook";
import type { Lang } from "@/i18n/copy";
import coverImage from "@/assets/gare.jpg.asset.json";
import hostAvatar from "@/assets/host-awa.jpg";

const property = {
  id: "sample-property-teranga",
  name: "Villa Teranga",
  city: "Dakar",
  type: "villa" as const,
  coverImageUrl: coverImage.url,
  host: { name: "Awa", avatarUrl: hostAvatar },
};

export const sampleGuidebook: Guidebook = {
  id: "sample-villa-teranga",
  propertyId: "sample-property-teranga",
  slug: "villa-teranga-dakar",
  status: "published",
  language: "fr",
  property: {
    ...property,
    country: "Sénégal",
    tagline:
      "Profitez d’un séjour où l’élégance locale rencontre le confort moderne",
  },
  sections: [
    {
      id: "welcome",
      kind: "welcome",
      title: "Bienvenue",
      summary: "Un mot de votre hôte",
      items: [
        {
          label: "Teranga",
          value:
            "Bienvenue à la Villa Teranga, à 5 minutes de la plage des Almadies. Faites comme chez vous.",
        },
        { label: "Votre hôte", value: "Awa, disponible de 8h à 22h" },
      ],
    },
    {
      id: "checkin",
      kind: "checkin",
      title: "Arrivée",
      summary: "Accès et clés",
      items: [
        { label: "Heure d'arrivée", value: "À partir de 15h00" },
        { label: "Portail", value: "Code 4821#", hint: "Puis tournez à droite" },
        {
          label: "Clés",
          value: "Boîte à clés blanche à gauche de la porte — code 7702",
        },
      ],
    },
    {
      id: "wifi",
      kind: "wifi",
      title: "Wi-Fi",
      summary: "Réseau et mot de passe",
      items: [
        { label: "Réseau", value: "Villa-Teranga-5G" },
        { label: "Mot de passe", value: "teranga2026" },
      ],
    },
    {
      id: "amenities",
      kind: "amenities",
      title: "Équipements",
      summary: "Mode d'emploi",
      items: [
        {
          label: "Climatisation",
          value: "Télécommande sur le mur, mode COOL, 24°C recommandé",
        },
        { label: "Machine à laver", value: "Programme 3 — 40°C, 45 minutes" },
        { label: "Cuisine", value: "Plaque à induction, cafetière italienne" },
      ],
    },
    {
      id: "rules",
      kind: "house_rules",
      title: "Règles de la maison",
      summary: "Le nécessaire",
      items: [
        { label: "Calme", value: "Pas de bruit après 22h30" },
        { label: "Fumeurs", value: "Uniquement sur la terrasse" },
        { label: "Fêtes", value: "Non autorisées" },
      ],
    },
    {
      id: "local",
      kind: "local_guide",
      title: "Guide local",
      summary: "Nos coups de cœur",
      items: [
        { label: "Chez Loutcha", value: "Cuisine sénégalaise — 10 min à pied" },
        { label: "Plage de Ngor", value: "Pirogue depuis l'embarcadère, 5 min" },
        { label: "Marché Kermel", value: "Fruits, épices et tissus" },
      ],
    },
    {
      id: "checkout",
      kind: "checkout",
      title: "Départ",
      summary: "Avant de partir",
      items: [
        { label: "Heure de départ", value: "Avant 11h00" },
        { label: "Clés", value: "À remettre dans la boîte à clés" },
        { label: "Déchets", value: "Conteneur vert au bout de la rue" },
      ],
    },
    {
      id: "contacts",
      kind: "contacts",
      title: "Contacts utiles",
      summary: "En cas de besoin",
      items: [
        { label: "Awa (hôte)", value: "+221 77 000 00 00" },
        { label: "Taxi de confiance", value: "+221 77 111 11 11" },
        { label: "Urgences", value: "17 — Police · 18 — Pompiers" },
      ],
    },
  ],
  updatedAt: "2026-08-20",
};

const sampleGuidebookEn: Guidebook = {
  ...sampleGuidebook,
  language: "en",
  property: {
    ...property,
    country: "Senegal",
    tagline: "Enjoy a stay where local elegance meets modern comfort",
  },
  sections: [
    {
      id: "welcome",
      kind: "welcome",
      title: "Welcome",
      summary: "A word from your host",
      items: [
        {
          label: "Teranga",
          value:
            "Welcome to Villa Teranga, 5 minutes from Almadies beach. Please make yourself at home.",
        },
        { label: "Your host", value: "Awa, available from 8am to 10pm" },
      ],
    },
    {
      id: "checkin",
      kind: "checkin",
      title: "Check-in",
      summary: "Access and keys",
      items: [
        { label: "Check-in time", value: "From 3:00 pm" },
        { label: "Gate", value: "Code 4821#", hint: "Then turn right" },
        {
          label: "Keys",
          value: "White key box to the left of the door — code 7702",
        },
      ],
    },
    {
      id: "wifi",
      kind: "wifi",
      title: "Wi-Fi",
      summary: "Network and password",
      items: [
        { label: "Network", value: "Villa-Teranga-5G" },
        { label: "Password", value: "teranga2026" },
      ],
    },
    {
      id: "amenities",
      kind: "amenities",
      title: "Amenities",
      summary: "How things work",
      items: [
        {
          label: "Air conditioning",
          value: "Remote on the wall, COOL mode, 24°C recommended",
        },
        { label: "Washing machine", value: "Programme 3 — 40°C, 45 minutes" },
        { label: "Kitchen", value: "Induction hob, Italian coffee maker" },
      ],
    },
    {
      id: "rules",
      kind: "house_rules",
      title: "House rules",
      summary: "The essentials",
      items: [
        { label: "Quiet hours", value: "No noise after 10:30 pm" },
        { label: "Smoking", value: "On the terrace only" },
        { label: "Parties", value: "Not allowed" },
      ],
    },
    {
      id: "local",
      kind: "local_guide",
      title: "Local guide",
      summary: "Our favourites",
      items: [
        { label: "Chez Loutcha", value: "Senegalese cuisine — 10 min walk" },
        { label: "Ngor beach", value: "Pirogue from the pier, 5 min" },
        { label: "Kermel market", value: "Fruit, spices and fabrics" },
      ],
    },
    {
      id: "checkout",
      kind: "checkout",
      title: "Check-out",
      summary: "Before you leave",
      items: [
        { label: "Check-out time", value: "Before 11:00 am" },
        { label: "Keys", value: "Please put them back in the key box" },
        { label: "Waste", value: "Green container at the end of the street" },
      ],
    },
    {
      id: "contacts",
      kind: "contacts",
      title: "Useful contacts",
      summary: "If you need anything",
      items: [
        { label: "Awa (host)", value: "+221 77 000 00 00" },
        { label: "Trusted taxi", value: "+221 77 111 11 11" },
        { label: "Emergencies", value: "17 — Police · 18 — Fire brigade" },
      ],
    },
  ],
};

export const sampleGuidebooks: Record<Lang, Guidebook> = {
  fr: sampleGuidebook,
  en: sampleGuidebookEn,
};

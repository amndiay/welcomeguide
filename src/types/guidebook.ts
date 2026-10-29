/**
 * Core domain types for Dalal.
 * These shapes mirror the future Lovable Cloud tables so the marketing site,
 * the dashboard and the guidebook editor can share one contract.
 */

export type PropertyType = "apartment" | "house" | "villa" | "studio" | "room";

export interface PropertyHost {
  name: string;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  ownerId?: string;
  name: string;
  city: string;
  country: string;
  type: PropertyType;
  coverImageUrl?: string;
  /** One-line welcome sentence shown over the cover photo. */
  tagline?: string;
  host?: PropertyHost;
}

export type GuidebookSectionKind =
  | "welcome"
  | "checkin"
  | "wifi"
  | "house_rules"
  | "amenities"
  | "local_guide"
  | "checkout"
  | "contacts";

export interface GuidebookSection {
  id: string;
  kind: GuidebookSectionKind;
  title: string;
  /** Short summary shown in the guest navigation. */
  summary?: string;
  items: GuidebookItem[];
}

export interface GuidebookItem {
  label: string;
  value: string;
  hint?: string;
}

export interface Guidebook {
  id: string;
  propertyId: string;
  slug: string;
  status: "draft" | "published";
  language: string;
  property: Property;
  sections: GuidebookSection[];
  updatedAt?: string;
}

import {
  AlertTriangle,
  AlignLeft,
  Clock,
  HelpCircle,
  Home,
  Image,
  Images,
  Info,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Phone,
  ScrollText,
  Sofa,
  Sparkles,
  Star,
  Video,
  Wifi,
} from "lucide-react";

const icons = {
  AlertTriangle,
  AlignLeft,
  Clock,
  HelpCircle,
  Home,
  Image,
  Images,
  Info,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Phone,
  ScrollText,
  Sofa,
  Sparkles,
  Star,
  Video,
  Wifi,
} as const;

/** Resolves an icon name coming from the guidebook schema. */
export function SectionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name as keyof typeof icons] ?? Info;
  return <Icon className={className} />;
}

"use client";

import {
  Server,
  Shield,
  ShieldCheck,
  Code2,
  RefreshCw,
  Network,
  Camera,
  Sun,
  GraduationCap,
  PenTool,
  ShoppingCart,
  FolderCheck,
  Users,
  Layers,
  Award,
  Zap,
  UserCheck,
  Headphones,
  Lightbulb,
  MapPin,
  ArrowRight,
  HeartPulse,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Send,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Menu,
  Check,
  Building2,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const icons: Record<string, LucideIcon> = {
  server: Server,
  shield: Shield,
  "shield-check": ShieldCheck,
  "code-2": Code2,
  "refresh-cw": RefreshCw,
  network: Network,
  camera: Camera,
  sun: Sun,
  "graduation-cap": GraduationCap,
  "pen-tool": PenTool,
  "shopping-cart": ShoppingCart,
  "folder-check": FolderCheck,
  users: Users,
  layers: Layers,
  award: Award,
  zap: Zap,
  "user-check": UserCheck,
  headphones: Headphones,
  lightbulb: Lightbulb,
  "map-pin": MapPin,
  "arrow-right": ArrowRight,
  "heart-pulse": HeartPulse,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  send: Send,
  phone: Phone,
  mail: Mail,
  "message-circle": MessageCircle,
  clock: Clock,
  menu: Menu,
  check: Check,
  building: Building2,
  "layout-dashboard": LayoutDashboard,
  "chart-bar": BarChart3,
};

export default function Icon({
  i,
  size = 20,
  className = "",
}: {
  i: string;
  size?: number;
  className?: string;
}) {
  const Cmp = icons[i] ?? Layers;
  return <Cmp size={size} className={className} />;
}

// ponytail: images placeholders picsum tant qu'aucune URL n'est définie dans l'admin.
export function Img({
  seed,
  w = 800,
  h = 600,
  alt = "",
  className = "",
  imageUrl,
}: {
  seed: string;
  w?: number;
  h?: number;
  alt?: string;
  className?: string;
  imageUrl?: string | null;
}) {
  // Fondu à l'affichage : évite le « pop » des images distantes (picsum/blob).
  const [chargee, setChargee] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // image déjà en cache au moment de l'hydratation -> onLoad ne repassera pas
    if (ref.current?.complete) setChargee(true);
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={imageUrl || `https://picsum.photos/seed/${seed}/${w}/${h}`}
      alt={alt}
      onLoad={() => setChargee(true)}
      className={`${className} transition-opacity duration-500 ${chargee ? "opacity-100" : "opacity-0"}`}
      loading="lazy"
    />
  );
}

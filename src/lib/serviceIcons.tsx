import {
  Flame,
  Sun,
  Home,
  Droplets,
  Zap,
  Hammer,
  Warehouse,
  Thermometer,
  Snowflake,
  ClipboardList,
  LucideIcon
} from "lucide-react";

// Icon mapping for all 9 services
export const iconMap: Record<string, LucideIcon> = {
  'home': Home,                    // Allgemeine Renovierung
  'warehouse': Warehouse,          // Dachdecker (Roofing)
  'zap': Zap,                      // Elektriker
  'flame': Flame,                  // Heizung & HVAC
  'thermometer': Thermometer,      // Wärmepumpe (Heat Pump)
  'droplets': Droplets,            // Klempner & Sanitär
  'sun': Sun,                      // Solar & Photovoltaik
  'snowflake': Snowflake,          // Klimatechnik (Air Conditioning)
  'clipboard': ClipboardList,      // Service & Beratung
  'hammer': Hammer,                // Default/fallback
};

export function getIconComponent(iconKey: string): LucideIcon {
  return iconMap[iconKey.toLowerCase()] || Hammer;
}

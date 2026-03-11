// ============================================
// SERVICES DATA WITH SUBCATEGORIES
// ============================================

export type ServiceSubcategory = {
  id: string;
  nameDe: string;
  nameEn: string;
  icon?: string;
};

export type ServiceWithSubcategories = {
  id: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  titleDe: string;
  titleEn: string;
  icon: string;
  descriptionDe: string;
  descriptionEn: string;
  imagePath: string;
  subcategories: ServiceSubcategory[];
};

export const servicesData: ServiceWithSubcategories[] = [
  {
    id: "sanitaer",
    slug: "sanitaer",
    nameDe: "Sanitär",
    nameEn: "Sanitary",
    titleDe: "Sanitär",
    titleEn: "Sanitary",
    icon: "home",
    descriptionDe: "Finden Sie qualifizierte Fachbetriebe für Sanitärinstallationen und Badezimmerrenovierungen. Komplette Badsanierung, barrierefreie Badlösungen und moderne Sanitärtechnik. Von der Planung bis zur Ausführung für Ihr neues Bad.",
    descriptionEn: "Find qualified contractors for sanitary installations and bathroom renovations. Complete bathroom remodeling, accessible bathroom solutions, and modern sanitary systems. From planning to completion for your new bathroom.",
    imagePath: "/blog-renovation.jpg",
    subcategories: [
      {
        id: "bathroom",
        nameDe: "Badzimmer",
        nameEn: "Bathroom Renovation"
      },
      {
        id: "kitchen",
        nameDe: "Küche",
        nameEn: "Kitchen Renovation"
      },
      {
        id: "windows-doors",
        nameDe: "Fenster & Türen",
        nameEn: "Windows & Doors"
      },
      {
        id: "painting",
        nameDe: "Malerarbeiten",
        nameEn: "Painting"
      },
      {
        id: "flooring",
        nameDe: "Bodenbeläge",
        nameEn: "Flooring"
      }
    ]
  },
  {
    id: "dachdecker",
    slug: "dachdecker",
    nameDe: "Dachdecker",
    nameEn: "Roofing",
    titleDe: "Dachdecker",
    titleEn: "Roofing",
    icon: "warehouse",
    descriptionDe: "Finden Sie erfahrene Dachdeckerbetriebe für Reparaturen, Sanierungen und Neueindeckungen. Schnelle Reaktion bei Sturmschäden und zuverlässige Lösungen für Steildach und Flachdach.",
    descriptionEn: "Find experienced roofing specialists for repairs, renovations, and reroofing. Fast response for storm damage and reliable solutions for pitched and flat roofs.",
    imagePath: "/blog-roofing.jpg",
    subcategories: [
      {
        id: "repair",
        nameDe: "Reparatur",
        nameEn: "Repairs"
      },
      {
        id: "renovation",
        nameDe: "Sanierung",
        nameEn: "Renovation"
      },
      {
        id: "re-roofing",
        nameDe: "Neueindeckung",
        nameEn: "Re-roofing"
      },
      {
        id: "storm-damage",
        nameDe: "Sturmschaden",
        nameEn: "Storm Damage"
      }
    ]
  },
  {
    id: "elektriker",
    slug: "elektriker",
    nameDe: "Elektriker",
    nameEn: "Electrician",
    titleDe: "Elektriker",
    titleEn: "Electrician",
    icon: "zap",
    descriptionDe: "Finden Sie zertifizierte Elektriker für alle Elektroarbeiten. Von Grundinstallationen über Smart Home Systeme bis zu Ladestationen für Elektroautos. Energieeffiziente Beleuchtung und sichere Stromversorgung für Ihr Zuhause.",
    descriptionEn: "Find certified electricians for all electrical work. From basic installations to smart home systems and EV charging stations. Energy efficient lighting and safe power supply for your home.",
    imagePath: "/blog-electrician.jpg",
    subcategories: [
      {
        id: "electrical-installation",
        nameDe: "Elektrische Installation",
        nameEn: "Electrical Installation"
      },
      {
        id: "customer-service-repairs",
        nameDe: "Kundendienst und Reparaturen",
        nameEn: "Customer Service & Repairs"
      },
      {
        id: "lighting-technology",
        nameDe: "Lichttechnik",
        nameEn: "Lighting Technology"
      },
      {
        id: "smart-home",
        nameDe: "Smart Home",
        nameEn: "Smart Home Systems"
      },
      {
        id: "ev-charging",
        nameDe: "Elektroauto-Ladestation",
        nameEn: "EV Charging Station"
      }
    ]
  },
  {
    id: "heizung",
    slug: "heizung",
    nameDe: "Heizung",
    nameEn: "Heating",
    titleDe: "Heizung",
    titleEn: "Heating",
    icon: "flame",
    descriptionDe: "Finden Sie Heizungsspezialisten mit 24 Stunden Notdienst unter 0163/3293127. Professionelle Installation, Wartung und Reparatur aller Heizungssysteme. Schneller und zuverlässiger Service für alle Heizungsanforderungen.",
    descriptionEn: "Find heating specialists available 24 hours at 0163/3293127. Professional installation, maintenance, and repair for all heating systems. Fast and reliable service for all your heating needs.",
    imagePath: "/blog-heating.jpg",
    subcategories: [
      {
        id: "solar-thermal",
        nameDe: "Solaranlagen und Solartechnik",
        nameEn: "Solar Thermal Systems"
      },
      {
        id: "gas-oil-heating",
        nameDe: "Gas-/Ölheizung",
        nameEn: "Gas/Oil Heating"
      },
      {
        id: "ventilation",
        nameDe: "Kontrollierte Wohnraumlüftung",
        nameEn: "Controlled Residential Ventilation"
      }
    ]
  },
  {
    id: "waermepumpe",
    slug: "waermepumpe",
    nameDe: "Wärmepumpe",
    nameEn: "Heat Pump Systems",
    titleDe: "Wärmepumpe",
    titleEn: "Heat Pump Systems",
    icon: "thermometer",
    descriptionDe: "Finden Sie Spezialisten für Wärmepumpeninstallationen. Luft, Erd oder Wasserwärmepumpen für umweltfreundliches Heizen. Unterstützung bei staatlichen Förderungen und Beratung zu Brennstoffzellen und BHKW Systemen.",
    descriptionEn: "Find specialists for heat pump installations. Air, ground, or water heat pumps for environmentally friendly heating. Support for government subsidies and consultation on fuel cell and CHP systems.",
    imagePath: "/service-heat-pump.jpg",
    subcategories: [
      {
        id: "air-water-heat-pump",
        nameDe: "Luft-Wasser-Wärmepumpe",
        nameEn: "Air-Water Heat Pump"
      },
      {
        id: "ground-water-heat-pump",
        nameDe: "Sole-Wasser-Wärmepumpe",
        nameEn: "Ground-Water Heat Pump"
      },
      {
        id: "water-water-heat-pump",
        nameDe: "Wasser-Wasser-Wärmepumpe",
        nameEn: "Water-Water Heat Pump"
      },
      {
        id: "fuel-cell-chp",
        nameDe: "Brennstoffzelle/BHKW",
        nameEn: "Fuel Cell/CHP"
      },
      {
        id: "wood-pellet",
        nameDe: "Holzpellettechnik",
        nameEn: "Wood Pellet Heating"
      }
    ]
  },
  {
    id: "klempner",
    slug: "klempner",
    nameDe: "Klempner",
    nameEn: "Plumbing",
    titleDe: "Klempner",
    titleEn: "Plumbing",
    icon: "droplets",
    descriptionDe: "Finden Sie professionelle Klempner für alle Anforderungen. Rohrbruchreparaturen mit Thermografie zur Leckortung, Rohrreinigung und Neuinstallationen. Schnelle Hilfe bei Rohrbrüchen, feuchten Stellen und Schimmelbefall.",
    descriptionEn: "Find professional plumbers for all plumbing needs. Pipe burst repairs with thermal imaging for leak detection, drain cleaning, and new installations. Fast response for burst pipes, damp areas, and mold issues.",
    imagePath: "/blog-plumbing.png",
    subcategories: [
      {
        id: "bathroom-renovation-construction",
        nameDe: "Badsanierung und Badbau",
        nameEn: "Bathroom Renovation & Construction"
      },
      {
        id: "accessible-bathroom",
        nameDe: "Barrierefreies Bad",
        nameEn: "Accessible Bathroom"
      },
      {
        id: "rainwater-harvesting",
        nameDe: "Regenwassernutzung",
        nameEn: "Rainwater Harvesting"
      },
      {
        id: "drinking-water-hygiene",
        nameDe: "Trinkwasserhygiene",
        nameEn: "Drinking Water Hygiene"
      },
      {
        id: "pipe-burst-repair",
        nameDe: "Rohrbruch-Reparatur",
        nameEn: "Pipe Burst Repair"
      }
    ]
  },
  {
    id: "solar-photovoltaik",
    slug: "solar",
    nameDe: "Solar & Photovoltaik",
    nameEn: "Solar & Photovoltaic",
    titleDe: "Solar & Photovoltaik",
    titleEn: "Solar & Photovoltaic",
    icon: "sun",
    descriptionDe: "Finden Sie Solarspezialisten für Photovoltaik Anlagen. Unterstützung bei bis zu 70% staatlicher Förderung. Kompletter Service von Beratung über Installation bis Wartung, inklusive Energiespeichersystemen.",
    descriptionEn: "Find solar specialists for photovoltaic system installations. Support for up to 70% government subsidies. Complete service from consultation to installation and maintenance, including energy storage systems.",
    imagePath: "/blog-solar.jpg",
    subcategories: [
      {
        id: "photovoltaic",
        nameDe: "Photovoltaik",
        nameEn: "Photovoltaic Systems"
      },
      {
        id: "energy-storage",
        nameDe: "Energiespeichersysteme",
        nameEn: "Energy Storage Systems"
      },
      {
        id: "subsidies",
        nameDe: "Förderung",
        nameEn: "Subsidies & Incentives"
      }
    ]
  },
  {
    id: "klimatechnik-lueftung",
    slug: "klimatechnik",
    nameDe: "Klimatechnik & Lüftung",
    nameEn: "Air Conditioning & Ventilation",
    titleDe: "Klimatechnik & Lüftung",
    titleEn: "Air Conditioning & Ventilation",
    icon: "snowflake",
    descriptionDe: "Finden Sie Spezialisten für Klimaanlagen und Lüftungssysteme. Optimale Klimalösungen für Wohnbereiche, Büros und Industrieanlagen. Inklusive Kühlzellen und Serverraumkühlung für spezielle Anforderungen.",
    descriptionEn: "Find specialists for air conditioning and ventilation systems. Optimal climate solutions for residential, office, and industrial spaces. Including cold storage rooms and server room cooling for specialized needs.",
    imagePath: "/service-air-conditioning.jpg",
    subcategories: [
      {
        id: "residential-ac",
        nameDe: "Klimaanlagen im Wohnbereich",
        nameEn: "Residential AC"
      },
      {
        id: "office-ac",
        nameDe: "Klimatechnik für Büros",
        nameEn: "Office AC"
      },
      {
        id: "industrial-ac",
        nameDe: "Klimatechnik für Industrie",
        nameEn: "Industrial AC"
      },
      {
        id: "cold-storage",
        nameDe: "Kühlzellen",
        nameEn: "Cold Storage Rooms"
      },
      {
        id: "server-room-cooling",
        nameDe: "Serverraumkühlung",
        nameEn: "Server Room Cooling"
      }
    ]
  },
  {
    id: "service-beratung",
    slug: "service-beratung",
    nameDe: "Service & Beratung",
    nameEn: "Service & Consultation",
    titleDe: "Service & Beratung",
    titleEn: "Service & Consultation",
    icon: "clipboard",
    descriptionDe: "Finden Sie Spezialisten für alle Gebäudetechnik Services. Verfügbar 24 Stunden unter 0163/3293127 für Notfälle. Von Energieberatung über Thermografie bis zur Förderberatung für Ihre Immobilie.",
    descriptionEn: "Find specialists for all building technology services. Available 24 hours at 0163/3293127 for emergencies. From energy consulting to thermography and subsidy advice for your property.",
    imagePath: "/service-consultation.jpg",
    subcategories: [
      {
        id: "energy-consulting",
        nameDe: "Energieberatung",
        nameEn: "Energy Consulting"
      },
      {
        id: "pipe-burst-repair-service",
        nameDe: "Rohrbruch-Reparatur",
        nameEn: "Pipe Burst Repair"
      },
      {
        id: "heating-building-check",
        nameDe: "Heizungs- und Gebäudecheck",
        nameEn: "Heating & Building Check"
      },
      {
        id: "gas-check",
        nameDe: "Gascheck",
        nameEn: "Gas Check"
      },
      {
        id: "sewer-camera-inspection",
        nameDe: "Kanal-Kamerainspektion",
        nameEn: "Sewer Camera Inspection"
      },
      {
        id: "funding",
        nameDe: "Förderung",
        nameEn: "Funding/Subsidies"
      },
      {
        id: "thermography-leak-detection",
        nameDe: "Thermografie/Leckortung",
        nameEn: "Thermography/Leak Detection"
      },
      {
        id: "hydraulic-balancing",
        nameDe: "Hydraulischer Abgleich",
        nameEn: "Hydraulic Balancing"
      },
      {
        id: "mobile-heating-units",
        nameDe: "Mobile Heizgeräte",
        nameEn: "Mobile Heating Units"
      },
      {
        id: "emergency-service",
        nameDe: "Notdienst",
        nameEn: "Emergency Service"
      }
    ]
  }
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): ServiceWithSubcategories | undefined {
  return servicesData.find(service => service.slug === slug);
}

// Helper function to get all service slugs for routing
export function getAllServiceSlugs(): string[] {
  return servicesData.map(service => service.slug);
}

// Helper function to get subcategories for a service
export function getSubcategoriesForService(serviceSlug: string): ServiceSubcategory[] {
  const service = getServiceBySlug(serviceSlug);
  return service?.subcategories || [];
}

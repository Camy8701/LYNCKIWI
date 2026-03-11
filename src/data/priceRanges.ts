/**
 * Typical Price Ranges for Services
 *
 * Based on market research for German handwerker services (2024)
 * Prices may vary by region, complexity, and materials
 */

export type PriceRange = {
  serviceId: string;
  serviceName: {
    de: string;
    en: string;
  };
  icon: string;
  minPrice: number;
  maxPrice: number;
  unit: 'job' | 'hour' | 'sqm'; // per job, per hour, or per square meter
  description: {
    de: string;
    en: string;
  };
  factors: {
    de: string[];
    en: string[];
  };
};

export const priceRanges: PriceRange[] = [
  {
    serviceId: 'heizung',
    serviceName: {
      de: 'Heizungswartung',
      en: 'Heating Maintenance',
    },
    icon: '🔥',
    minPrice: 120,
    maxPrice: 200,
    unit: 'job',
    description: {
      de: 'Jahresservice inkl. Reinigung und Inspektion',
      en: 'Annual service incl. cleaning and inspection',
    },
    factors: {
      de: ['Heizungstyp', 'Alter der Anlage', 'Anzahl der Heizkörper'],
      en: ['Heating type', 'System age', 'Number of radiators'],
    },
  },
  {
    serviceId: 'heizung-installation',
    serviceName: {
      de: 'Heizung Installation',
      en: 'Heating Installation',
    },
    icon: '🔥',
    minPrice: 5000,
    maxPrice: 15000,
    unit: 'job',
    description: {
      de: 'Neue Heizungsanlage inkl. Montage',
      en: 'New heating system incl. installation',
    },
    factors: {
      de: ['Heizungstyp (Gas, Öl, Pellets)', 'Gebäudegröße', 'Anzahl Heizkörper'],
      en: ['Heating type (gas, oil, pellets)', 'Building size', 'Number of radiators'],
    },
  },
  {
    serviceId: 'klempner-notfall',
    serviceName: {
      de: 'Rohrreparatur (Notfall)',
      en: 'Emergency Pipe Repair',
    },
    icon: '🚨',
    minPrice: 80,
    maxPrice: 350,
    unit: 'job',
    description: {
      de: 'Notdienst bei Rohrbruch oder Leckage',
      en: 'Emergency service for burst pipe or leak',
    },
    factors: {
      de: ['Tageszeit (Notdienst teurer)', 'Zugänglichkeit', 'Materialkosten'],
      en: ['Time of day (emergency more expensive)', 'Accessibility', 'Material costs'],
    },
  },
  {
    serviceId: 'klempner-bad',
    serviceName: {
      de: 'Badinstallation',
      en: 'Bathroom Installation',
    },
    icon: '🚿',
    minPrice: 2500,
    maxPrice: 8000,
    unit: 'job',
    description: {
      de: 'Komplette Badsanierung',
      en: 'Complete bathroom renovation',
    },
    factors: {
      de: ['Badgröße', 'Materialauswahl', 'Fliesenarbeiten', 'Elektrik'],
      en: ['Bathroom size', 'Material selection', 'Tiling work', 'Electrical work'],
    },
  },
  {
    serviceId: 'elektriker-standard',
    serviceName: {
      de: 'Elektriker Standardarbeit',
      en: 'Electrician Standard Work',
    },
    icon: '⚡',
    minPrice: 50,
    maxPrice: 80,
    unit: 'hour',
    description: {
      de: 'Stundensatz für Elektroarbeiten',
      en: 'Hourly rate for electrical work',
    },
    factors: {
      de: ['Komplexität', 'Materialkosten', 'Anfahrt'],
      en: ['Complexity', 'Material costs', 'Travel'],
    },
  },
  {
    serviceId: 'elektriker-installation',
    serviceName: {
      de: 'Elektroinstallation',
      en: 'Electrical Installation',
    },
    icon: '⚡',
    minPrice: 1500,
    maxPrice: 5000,
    unit: 'job',
    description: {
      de: 'Neuinstallation oder Sanierung',
      en: 'New installation or renovation',
    },
    factors: {
      de: ['Anzahl Steckdosen/Schalter', 'Gebäudegröße', 'Smart-Home Integration'],
      en: ['Number of outlets/switches', 'Building size', 'Smart home integration'],
    },
  },
  {
    serviceId: 'solar-beratung',
    serviceName: {
      de: 'Solar-Beratung',
      en: 'Solar Consultation',
    },
    icon: '☀️',
    minPrice: 0,
    maxPrice: 150,
    unit: 'job',
    description: {
      de: 'Erstberatung (oft kostenlos)',
      en: 'Initial consultation (often free)',
    },
    factors: {
      de: ['Dachgröße', 'Ausrichtung', 'Stromverbrauch'],
      en: ['Roof size', 'Orientation', 'Power consumption'],
    },
  },
  {
    serviceId: 'solar-installation',
    serviceName: {
      de: 'Photovoltaik-Anlage',
      en: 'Photovoltaic System',
    },
    icon: '☀️',
    minPrice: 8000,
    maxPrice: 25000,
    unit: 'job',
    description: {
      de: 'Komplett-Installation inkl. Speicher',
      en: 'Complete installation incl. battery',
    },
    factors: {
      de: ['Anlagengröße (kWp)', 'Speicherkapazität', 'Dachtyp', 'Förderungen'],
      en: ['System size (kWp)', 'Battery capacity', 'Roof type', 'Subsidies'],
    },
  },
  {
    serviceId: 'dachdecker-reparatur',
    serviceName: {
      de: 'Dachreparatur',
      en: 'Roof Repair',
    },
    icon: '🏠',
    minPrice: 200,
    maxPrice: 1500,
    unit: 'job',
    description: {
      de: 'Kleinere Reparaturen und Abdichtung',
      en: 'Minor repairs and waterproofing',
    },
    factors: {
      de: ['Schadensgröße', 'Dachzugang', 'Materialkosten'],
      en: ['Damage size', 'Roof access', 'Material costs'],
    },
  },
  {
    serviceId: 'dachdecker-neu',
    serviceName: {
      de: 'Dacheindeckung (Neubau)',
      en: 'New Roof Installation',
    },
    icon: '🏠',
    minPrice: 80,
    maxPrice: 150,
    unit: 'sqm',
    description: {
      de: 'Pro Quadratmeter Dachfläche',
      en: 'Per square meter of roof area',
    },
    factors: {
      de: ['Dachform', 'Material (Ziegel, Schiefer)', 'Dämmung', 'Dachfenster'],
      en: ['Roof shape', 'Material (tiles, slate)', 'Insulation', 'Skylights'],
    },
  },
  {
    serviceId: 'waermepumpe',
    serviceName: {
      de: 'Wärmepumpe Installation',
      en: 'Heat Pump Installation',
    },
    icon: '♨️',
    minPrice: 12000,
    maxPrice: 30000,
    unit: 'job',
    description: {
      de: 'Luft- oder Erdwärmepumpe inkl. Montage',
      en: 'Air or ground source heat pump incl. installation',
    },
    factors: {
      de: ['Pumpentyp', 'Gebäudegröße', 'Erschließung', 'Förderungen'],
      en: ['Pump type', 'Building size', 'Ground work', 'Subsidies'],
    },
  },
  {
    serviceId: 'klimatechnik',
    serviceName: {
      de: 'Klimaanlage Installation',
      en: 'Air Conditioning Installation',
    },
    icon: '❄️',
    minPrice: 1500,
    maxPrice: 5000,
    unit: 'job',
    description: {
      de: 'Split-Klimaanlage inkl. Montage',
      en: 'Split AC system incl. installation',
    },
    factors: {
      de: ['Anzahl Innengeräte', 'Raumgröße', 'Leitungslänge'],
      en: ['Number of indoor units', 'Room size', 'Pipe length'],
    },
  },
];

/**
 * Get price range by service ID
 */
export function getPriceRangeByService(serviceId: string): PriceRange | undefined {
  return priceRanges.find(pr => pr.serviceId === serviceId);
}

/**
 * Get featured price ranges (for homepage display)
 */
export function getFeaturedPriceRanges(limit: number = 6): PriceRange[] {
  const featured = [
    'klempner-notfall',
    'klempner-bad',
    'heizung',
    'elektriker-standard',
    'solar-installation',
    'waermepumpe',
  ];

  return priceRanges
    .filter(pr => featured.includes(pr.serviceId))
    .slice(0, limit);
}

/**
 * Format price range for display
 */
export function formatPriceRange(range: PriceRange, language: 'de' | 'en' = 'de'): string {
  const unitText = {
    job: { de: '', en: '' },
    hour: { de: '/Std.', en: '/hr' },
    sqm: { de: '/m²', en: '/sqm' },
  };

  return `€${range.minPrice.toLocaleString()} - €${range.maxPrice.toLocaleString()}${unitText[range.unit][language]}`;
}

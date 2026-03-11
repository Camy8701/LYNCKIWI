/**
 * Partner Company Logos & Information
 *
 * TODO: Replace with real partner data before launch
 * These are placeholder companies for design/demo purposes
 */

export type PartnerCompany = {
  id: string;
  name: string;
  initials: string;
  color: string; // Hex color for logo background
  city: string;
  services: string[]; // Service types they offer
  rating: number;
};

export const partnerCompanies: PartnerCompany[] = [
  {
    id: '1',
    name: 'Müller Heizungstechnik GmbH',
    initials: 'MH',
    color: '#EF4444', // Red
    city: 'Frankfurt am Main',
    services: ['heizung', 'waermepumpe'],
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Schmidt Solar & Sanitär',
    initials: 'SS',
    color: '#3B82F6', // Blue
    city: 'Köln',
    services: ['solar', 'klempner'],
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Wagner Elektrotechnik',
    initials: 'WE',
    color: '#F59E0B', // Amber
    city: 'Düsseldorf',
    services: ['elektriker'],
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Becker Dachdeckerei',
    initials: 'BD',
    color: '#10B981', // Green
    city: 'Wiesbaden',
    services: ['dachdecker'],
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Fischer Klimatechnik',
    initials: 'FK',
    color: '#8B5CF6', // Purple
    city: 'Dortmund',
    services: ['klimatechnik', 'heizung'],
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Hoffmann Haustechnik',
    initials: 'HH',
    color: '#EC4899', // Pink
    city: 'Mainz',
    services: ['heizung', 'klempner', 'elektriker'],
    rating: 4.7,
  },
  {
    id: '7',
    name: 'Klein Solar Solutions',
    initials: 'KS',
    color: '#14B8A6', // Teal
    city: 'Essen',
    services: ['solar', 'waermepumpe'],
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Richter Renovierungen',
    initials: 'RR',
    color: '#F97316', // Orange
    city: 'Kassel',
    services: ['service'],
    rating: 4.6,
  },
];

/**
 * Get featured partners (for homepage display)
 * Returns 5-6 top-rated partners
 */
export function getFeaturedPartners(limit: number = 6): PartnerCompany[] {
  return partnerCompanies
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Get partners by city
 */
export function getPartnersByCity(city: string): PartnerCompany[] {
  return partnerCompanies.filter(p => p.city === city);
}

/**
 * Get partners by service
 */
export function getPartnersByService(service: string): PartnerCompany[] {
  return partnerCompanies.filter(p => p.services.includes(service));
}

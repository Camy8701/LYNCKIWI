/**
 * Network Performance Metrics
 *
 * TODO: Replace with real data from analytics before launch
 * These are realistic placeholder metrics for design/demo purposes
 */

export type NetworkMetrics = {
  totalLeadsMatched: number;
  totalLeadsMatchedThisYear: number;
  activePartners: number;
  averageRating: number;
  averageResponseTimeMinutes: number;
  citiesCovered: number;
  servicesCovered: number;
  customerSatisfaction: number; // Percentage
};

/**
 * Main network statistics (displayed on homepage)
 */
export const networkMetrics: NetworkMetrics = {
  totalLeadsMatched: 2847, // All-time
  totalLeadsMatchedThisYear: 1243, // 2024
  activePartners: 0, // Hidden from public display
  averageRating: 4.8,
  averageResponseTimeMinutes: 32,
  citiesCovered: 35, // Hessen (10) + NRW (10) + RLP (15)
  servicesCovered: 9,
  customerSatisfaction: 94, // 94%
};

/**
 * Recent activity feed items (for live feed)
 * These rotate to show "real-time" activity
 */
export const recentActivityFeed = [
  {
    id: '1',
    timeAgo: '3 Minuten',
    service: 'Heizungsreparatur',
    city: 'Köln',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '2',
    timeAgo: '12 Minuten',
    service: 'Sanitärinstallation',
    city: 'Frankfurt am Main',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: '3',
    timeAgo: '28 Minuten',
    service: 'Solar-Beratung',
    city: 'Düsseldorf',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
  },
  {
    id: '4',
    timeAgo: '1 Stunde',
    service: 'Dachreparatur',
    city: 'Mainz',
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
  },
  {
    id: '5',
    timeAgo: '2 Stunden',
    service: 'Elektriker-Notdienst',
    city: 'Wiesbaden',
    timestamp: new Date(Date.now() - 125 * 60 * 1000),
  },
  {
    id: '6',
    timeAgo: '3 Stunden',
    service: 'Wärmepumpe Installation',
    city: 'Dortmund',
    timestamp: new Date(Date.now() - 180 * 60 * 1000),
  },
];

/**
 * Monthly statistics (for admin analytics)
 */
export const monthlyStats = {
  december2024: {
    leads: 127,
    revenue: 6350, // EUR
    newPartners: 8,
    averageResponseTime: 28, // minutes
  },
  november2024: {
    leads: 142,
    revenue: 7100,
    newPartners: 12,
    averageResponseTime: 35,
  },
  october2024: {
    leads: 156,
    revenue: 7800,
    newPartners: 9,
    averageResponseTime: 31,
  },
};

/**
 * Service-specific conversion rates
 */
export const serviceConversionRates = {
  heizung: { total: 287, converted: 251, rate: 87 },
  solar: { total: 198, converted: 162, rate: 82 },
  klempner: { total: 342, converted: 298, rate: 87 },
  elektriker: { total: 219, converted: 186, rate: 85 },
  dachdecker: { total: 97, converted: 79, rate: 81 },
  waermepumpe: { total: 134, converted: 112, rate: 84 },
  klimatechnik: { total: 76, converted: 61, rate: 80 },
  service: { total: 123, converted: 98, rate: 80 },
};

/**
 * City performance data
 */
export const cityPerformance = [
  { city: 'Frankfurt am Main', leads: 187, revenue: 9350 },
  { city: 'Köln', leads: 164, revenue: 8200 },
  { city: 'Düsseldorf', leads: 142, revenue: 7100 },
  { city: 'Wiesbaden', leads: 98, revenue: 4900 },
  { city: 'Mainz', leads: 89, revenue: 4450 },
  { city: 'Dortmund', leads: 112, revenue: 5600 },
  { city: 'Essen', leads: 87, revenue: 4350 },
  { city: 'Kassel', leads: 76, revenue: 3800 },
  { city: 'Darmstadt', leads: 71, revenue: 3550 },
  { city: 'Bonn', leads: 69, revenue: 3450 },
];

/**
 * Get random recent activity (for rotating feed)
 */
export function getRandomRecentActivity(count: number = 3) {
  const shuffled = [...recentActivityFeed].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Format metrics for display
 */
export function formatMetricNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k+`.replace('.0', '');
  }
  return num.toString();
}

// ============================================================
// KYSS Vision — Regions Data
// US-014
// ============================================================

export interface Region {
  value: string
  label: string
  country: 'NZ' | 'AU'
}

export const nzRegions: Region[] = [
  { value: 'northland', label: 'Northland', country: 'NZ' },
  { value: 'auckland', label: 'Auckland', country: 'NZ' },
  { value: 'waikato', label: 'Waikato', country: 'NZ' },
  { value: 'bay-of-plenty', label: 'Bay of Plenty', country: 'NZ' },
  { value: 'gisborne', label: 'Gisborne', country: 'NZ' },
  { value: 'hawkes-bay', label: "Hawke's Bay", country: 'NZ' },
  { value: 'taranaki', label: 'Taranaki', country: 'NZ' },
  { value: 'manawatu-whanganui', label: 'Manawatū-Whanganui', country: 'NZ' },
  { value: 'wellington', label: 'Wellington', country: 'NZ' },
  { value: 'tasman', label: 'Tasman', country: 'NZ' },
  { value: 'nelson', label: 'Nelson', country: 'NZ' },
  { value: 'marlborough', label: 'Marlborough', country: 'NZ' },
  { value: 'west-coast', label: 'West Coast', country: 'NZ' },
  { value: 'canterbury', label: 'Canterbury', country: 'NZ' },
  { value: 'otago', label: 'Otago', country: 'NZ' },
  { value: 'southland', label: 'Southland', country: 'NZ' },
]

export const auRegions: Region[] = [
  { value: 'nsw', label: 'New South Wales', country: 'AU' },
  { value: 'vic', label: 'Victoria', country: 'AU' },
  { value: 'qld', label: 'Queensland', country: 'AU' },
  { value: 'wa', label: 'Western Australia', country: 'AU' },
  { value: 'sa', label: 'South Australia', country: 'AU' },
  { value: 'tas', label: 'Tasmania', country: 'AU' },
  { value: 'act', label: 'Australian Capital Territory', country: 'AU' },
  { value: 'nt', label: 'Northern Territory', country: 'AU' },
]

export const allRegions: Region[] = [...nzRegions, ...auRegions]

export const getRegionsByCountry = (country: 'NZ' | 'AU'): Region[] =>
  allRegions.filter((r) => r.country === country)

export const getRegionLabel = (value: string): string =>
  allRegions.find((r) => r.value === value)?.label ?? value

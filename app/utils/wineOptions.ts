export const tasteOptions = [
  { label: 'Trocken', value: 'DRY' },
  { label: 'Halbtrocken', value: 'SEMI_DRY' },
  { label: 'Lieblich', value: 'SEMI_SWEET' },
  { label: 'Süß', value: 'SWEET' },
]

export function getTasteLabel(value: string): string {
  const option = tasteOptions.find(o => o.value === value)
  return option?.label || value
}

export const artOptions = [
  { label: 'Rot', value: 'RED' },
  { label: 'Weiß', value: 'WHITE' },
  { label: 'Rosé', value: 'ROSE' },
  { label: 'Orange', value: 'ORANGE' },
  { label: 'Schaumwein', value: 'SPARKLING' },
  { label: 'Dessertwein', value: 'DESSERT' },
]

export function getArtLabel(value: string): string {
  const option = artOptions.find(o => o.value === value)
  return option?.label || value
}

export function getWineIconColor(art: string): string {
  switch (art) {
    case 'RED':
      return 'text-red-600'
    case 'WHITE':
      return 'text-yellow-400'
    case 'ROSE':
      return 'text-pink-400'
    case 'ORANGE':
      return 'text-orange-500'
    case 'SPARKLING':
      return 'text-amber-500'
    case 'DESSERT':
      return 'text-yellow-600'
    default:
      return 'text-muted'
  }
}

// Unified country options: single source of truth
export const countryOptions = [
  { value: 'AT_ST', label: 'Österreich - Steiermark', flag: '/flags/austria.png' },
  { value: 'AT_BU', label: 'Österreich - Burgenland', flag: '/flags/austria.png' },
  { value: 'AT_NO', label: 'Österreich - Niederösterreich', flag: '/flags/austria.png' },
  { value: 'IT', label: 'Italien', flag: '/flags/italy.png' },
  { value: 'ES', label: 'Spanien', flag: '/flags/spain.png' },
  { value: 'FR', label: 'Frankreich', flag: '/flags/france.png' },
  { value: 'PT', label: 'Portugal', flag: '/flags/portugal.png' },
  { value: 'SI', label: 'Slowenien', flag: '/flags/slovenia.png' },
  { value: 'HR', label: 'Kroatien', flag: '/flags/croatia.png' },
  { value: 'RS', label: 'Serbien', flag: '/flags/serbia.png' },
  { value: 'AR', label: 'Argentinien', flag: '/flags/argentina.png' },
  { value: 'AU', label: 'Australien', flag: '/flags/australia.png' },
  { value: 'US', label: 'USA', flag: '/flags/usa.png' },
  { value: 'MX', label: 'Mexiko', flag: '/flags/mexico.png' },
  { value: 'CL', label: 'Chile', flag: '/flags/chile.png' },
  { value: 'ZA', label: 'Südafrika', flag: '/flags/south_africa.png' },
  { value: 'DE', label: 'Deutschland', flag: '/flags/germany.png' },
]

export function getCountryLabel(value: string | null | undefined): string {
  if (!value) return '-'
  const option = countryOptions.find(o => o.value === value)
  return option?.label || value
}

export function getCountryFlag(value: string | null | undefined): string | null {
  if (!value) return null
  const option = countryOptions.find(o => o.value === value)
  return option?.flag || null
}

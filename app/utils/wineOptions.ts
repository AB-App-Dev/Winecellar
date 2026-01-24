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

export function getCountryFlag(value: string | null | undefined): string | null {
  if (!value) return null
  const flagMap: Record<string, string> = {
    '0': '/flags/austria.png',
    '1': '/flags/austria.png',
    '2': '/flags/austria.png',
    '3': '/flags/italy.png',
    '4': '/flags/spain.png',
    '5': '/flags/france.png',
    '6': '/flags/portugal.png',
    '7': '/flags/slovenia.png',
    '8': '/flags/croatia.png',
    '9': '/flags/serbia.png',
    '10': '/flags/argentina.png',
    '11': '/flags/australia.png',
    '12': '/flags/usa.png',
    '13': '/flags/mexico.png',
    '14': '/flags/chile.png',
    '15': '/flags/south_africa.png',
    '16': '/flags/germany.png',
  }
  return flagMap[value] || null
}

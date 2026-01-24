// Wine Art enum values
export type WineArt = 'red' | 'white' | 'rose' | 'sparkling' | 'dessert'

// Wine Taste enum values
export type WineTaste = 'dry' | 'semi-dry' | 'semi-sweet' | 'sweet'

// Wine entity
export interface Wine {
  id: string
  name: string
  wineryId?: string
  winery?: WineGrower
  art: WineArt
  taste: WineTaste
  year: number
  barrelType?: string
  alcoholPercentage?: number
  amount?: string
  wineVariety?: string
  varieties?: string
  land: string
  region?: string
  price: number
  bottlesAmount: number
  availableAtYear?: number
  imageUrl?: string
  description?: string
  hiddenForGuests: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Wine Grower (Winery) entity
export interface WineGrower {
  id: string
  name: string
  address?: string
  post?: string
  city?: string
  land?: string
  phone?: string
  email?: string
  website?: string
  createdAt?: Date
  updatedAt?: Date
  wines?: Wine[]
}

// Supplier entity
export interface Supplier {
  id: string
  name: string
  address?: string
  post?: string
  city?: string
  land?: string
  phone?: string
  email?: string
  website?: string
  createdAt?: Date
  updatedAt?: Date
}

// User entity (Admin) - matches better-auth schema
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

// Favorite entity
export interface Favorite {
  id: string
  guestKey: string
  wineId: string
  wine?: Wine
  createdAt: Date
  updatedAt?: Date
}

// Filter state for wines
export interface WineFilters {
  art: WineArt[]
  land: string[]
  taste: WineTaste[]
}

// Sort options
export type WineSortField = 'name' | 'price' | 'year' | 'bottlesAmount'
export type SortDirection = 'asc' | 'desc'

export interface WineSort {
  field: WineSortField
  direction: SortDirection
}

// Layout view type
export type LayoutView = 'grid' | 'list'

// Theme type
export type Theme = 'light' | 'dark' | 'system'

// Wine Art enum values
export type WineArt = 'red' | 'white' | 'rose' | 'sparkling' | 'dessert'

// Wine Taste enum values
export type WineTaste = 'dry' | 'semi-dry' | 'semi-sweet' | 'sweet'

// Wine entity
export interface Wine {
  id: number
  name: string
  growerId: number
  grower?: WineGrower
  art: WineArt
  taste: WineTaste
  year: number
  barrelType?: string
  alcoholPercentage?: number
  amount?: string
  wineVariety?: string
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
  id: number
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
  id: number
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
  id: number
  guestKey: string
  wineId: number
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

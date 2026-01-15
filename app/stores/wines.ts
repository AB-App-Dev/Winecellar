import { defineStore } from 'pinia'
import type { Wine, WineFilters, WineSort, WineArt, WineTaste } from '~/types'

interface WinesState {
  wines: Wine[]
  isLoading: boolean
  error: string | null
  filters: WineFilters
  sort: WineSort
}

export const useWinesStore = defineStore('wines', {
  state: (): WinesState => ({
    wines: [],
    isLoading: false,
    error: null,
    filters: {
      art: [],
      land: [],
      taste: []
    },
    sort: {
      field: 'price',
      direction: 'asc'
    }
  }),

  getters: {
    // Get wines visible to guests (not hidden, sorted by price)
    guestWines: (state): Wine[] => {
      return state.wines
        .filter(wine => !wine.hiddenForGuests)
        .sort((a, b) => {
          if (state.sort.direction === 'asc') {
            return a.price - b.price
          }
          return b.price - a.price
        })
    },

    // Get filtered wines
    filteredWines: (state): Wine[] => {
      let result = state.wines

      // Apply art filter
      if (state.filters.art.length > 0) {
        result = result.filter(wine => state.filters.art.includes(wine.art))
      }

      // Apply land filter
      if (state.filters.land.length > 0) {
        result = result.filter(wine => state.filters.land.includes(wine.land))
      }

      // Apply taste filter
      if (state.filters.taste.length > 0) {
        result = result.filter(wine => state.filters.taste.includes(wine.taste))
      }

      return result
    },

    // Get unique countries from wines
    availableLands: (state): string[] => {
      return [...new Set(state.wines.map(wine => wine.land))].sort()
    },

    // Check if wine is coming soon
    isComingSoon: () => (wine: Wine): boolean => {
      if (!wine.availableAtYear) return false
      return wine.availableAtYear > new Date().getFullYear()
    }
  },

  actions: {
    async fetchWines() {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/wines')
        // this.wines = response
      } catch (e) {
        this.error = 'Failed to fetch wines'
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters: Partial<WineFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        art: [],
        land: [],
        taste: []
      }
    },

    setSort(sort: WineSort) {
      this.sort = sort
    }
  }
})

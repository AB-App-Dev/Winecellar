import { defineStore } from 'pinia'
import type { Favorite, Wine } from '~/types'

interface FavoritesState {
  favorites: Favorite[]
  guestKey: string | null
  isLoading: boolean
  error: string | null
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    favorites: [],
    guestKey: null,
    isLoading: false,
    error: null
  }),

  getters: {
    favoriteWineIds: (state): number[] => {
      return state.favorites.map(f => f.wineId)
    },

    isFavorite: (state) => (wineId: number): boolean => {
      return state.favorites.some(f => f.wineId === wineId)
    }
  },

  actions: {
    initGuestKey() {
      if (import.meta.client) {
        let key = localStorage.getItem('guestKey')
        if (!key) {
          key = crypto.randomUUID()
          localStorage.setItem('guestKey', key)
        }
        this.guestKey = key
      }
    },

    async fetchFavorites() {
      if (!this.guestKey) {
        this.initGuestKey()
      }

      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/favorites', {
        //   headers: { 'X-Guest-Key': this.guestKey! }
        // })
        // this.favorites = response
      } catch (e) {
        this.error = 'Failed to fetch favorites'
      } finally {
        this.isLoading = false
      }
    },

    async addFavorite(wineId: number) {
      if (!this.guestKey) {
        this.initGuestKey()
      }

      try {
        // TODO: Implement actual API call
        // await $fetch('/api/favorites', {
        //   method: 'POST',
        //   headers: { 'X-Guest-Key': this.guestKey! },
        //   body: { wineId }
        // })

        // Optimistic update
        this.favorites.push({
          id: Date.now(),
          guestKey: this.guestKey!,
          wineId,
          createdAt: new Date()
        })
      } catch (e) {
        this.error = 'Failed to add favorite'
      }
    },

    async removeFavorite(wineId: number) {
      if (!this.guestKey) return

      try {
        // TODO: Implement actual API call
        // await $fetch(`/api/favorites/${wineId}`, {
        //   method: 'DELETE',
        //   headers: { 'X-Guest-Key': this.guestKey }
        // })

        // Optimistic update
        this.favorites = this.favorites.filter(f => f.wineId !== wineId)
      } catch (e) {
        this.error = 'Failed to remove favorite'
      }
    },

    async toggleFavorite(wine: Wine) {
      // Cannot favorite hidden or coming soon wines
      if (wine.hiddenForGuests) return
      if (wine.availableAtYear && wine.availableAtYear > new Date().getFullYear()) return

      if (this.isFavorite(wine.id)) {
        await this.removeFavorite(wine.id)
      } else {
        await this.addFavorite(wine.id)
      }
    }
  }
})

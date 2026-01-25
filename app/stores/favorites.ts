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
    favoriteWineIds: (state): string[] => {
      return state.favorites.map(f => f.wineId)
    },

    isFavorite: (state) => (wineId: string): boolean => {
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

      if (!this.guestKey) return

      this.isLoading = true
      this.error = null
      try {
        const response = await $fetch<Favorite[]>('/api/favorites', {
          headers: { 'X-Guest-Key': this.guestKey }
        })
        this.favorites = response
      } catch (e) {
        this.error = 'Failed to fetch favorites'
        console.error('Failed to fetch favorites:', e)
      } finally {
        this.isLoading = false
      }
    },

    async addFavorite(wineId: string) {
      if (!this.guestKey) {
        this.initGuestKey()
      }

      if (!this.guestKey) return

      // Optimistic update
      const tempFavorite: Favorite = {
        id: crypto.randomUUID(),
        guestKey: this.guestKey,
        wineId,
        createdAt: new Date()
      }
      this.favorites.push(tempFavorite)

      try {
        const response = await $fetch<Favorite>('/api/favorites', {
          method: 'POST',
          headers: { 'X-Guest-Key': this.guestKey },
          body: { wineId }
        })

        // Replace temp favorite with actual response
        const index = this.favorites.findIndex(f => f.id === tempFavorite.id)
        if (index !== -1) {
          this.favorites[index] = response
        }
      } catch (e) {
        // Rollback on error
        this.favorites = this.favorites.filter(f => f.id !== tempFavorite.id)
        this.error = 'Failed to add favorite'
        console.error('Failed to add favorite:', e)
      }
    },

    async removeFavorite(wineId: string) {
      if (!this.guestKey) return

      // Store for rollback
      const removedFavorite = this.favorites.find(f => f.wineId === wineId)

      // Optimistic update
      this.favorites = this.favorites.filter(f => f.wineId !== wineId)

      try {
        await $fetch(`/api/favorites/${wineId}`, {
          method: 'DELETE',
          headers: { 'X-Guest-Key': this.guestKey }
        })
      } catch (e) {
        // Rollback on error
        if (removedFavorite) {
          this.favorites.push(removedFavorite)
        }
        this.error = 'Failed to remove favorite'
        console.error('Failed to remove favorite:', e)
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
    },

    async removeAllFavorites() {
      if (!this.guestKey) return

      const removedFavorites = [...this.favorites]
      this.favorites = []

      try {
        await Promise.all(
          removedFavorites.map(f =>
            $fetch(`/api/favorites/${f.wineId}`, {
              method: 'DELETE',
              headers: { 'X-Guest-Key': this.guestKey! }
            })
          )
        )
      } catch (e) {
        this.favorites = removedFavorites
        this.error = 'Failed to remove all favorites'
        console.error('Failed to remove all favorites:', e)
      }
    }
  }
})

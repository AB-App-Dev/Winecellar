import { defineStore } from 'pinia'
import type { WineGrower } from '~/types'

interface WineriesState {
  wineries: WineGrower[]
  isLoading: boolean
  error: string | null
}

export const useWineriesStore = defineStore('wineries', {
  state: (): WineriesState => ({
    wineries: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getWineryById: (state) => (id: number): WineGrower | undefined => {
      return state.wineries.find(w => w.id === id)
    }
  },

  actions: {
    async fetchWineries() {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/wineries')
        // this.wineries = response
      } catch (e) {
        this.error = 'Failed to fetch wineries'
      } finally {
        this.isLoading = false
      }
    },

    async createWinery(data: Omit<WineGrower, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/wineries', {
        //   method: 'POST',
        //   body: data
        // })
        // this.wineries.push(response)
      } catch (e) {
        this.error = 'Failed to create winery'
        throw e
      }
    },

    async updateWinery(id: number, data: Partial<WineGrower>) {
      try {
        // TODO: Implement actual API call
        // const response = await $fetch(`/api/wineries/${id}`, {
        //   method: 'PUT',
        //   body: data
        // })
        // const index = this.wineries.findIndex(w => w.id === id)
        // if (index !== -1) {
        //   this.wineries[index] = response
        // }
      } catch (e) {
        this.error = 'Failed to update winery'
        throw e
      }
    },

    async deleteWinery(id: number) {
      try {
        // TODO: Implement actual API call
        // await $fetch(`/api/wineries/${id}`, { method: 'DELETE' })
        this.wineries = this.wineries.filter(w => w.id !== id)
      } catch (e) {
        this.error = 'Failed to delete winery'
        throw e
      }
    }
  }
})

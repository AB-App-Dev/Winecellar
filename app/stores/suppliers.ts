import { defineStore } from 'pinia'
import type { Supplier } from '~/types'

interface SuppliersState {
  suppliers: Supplier[]
  isLoading: boolean
  error: string | null
}

export const useSuppliersStore = defineStore('suppliers', {
  state: (): SuppliersState => ({
    suppliers: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getSupplierById: (state) => (id: number): Supplier | undefined => {
      return state.suppliers.find(s => s.id === id)
    }
  },

  actions: {
    async fetchSuppliers() {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/suppliers')
        // this.suppliers = response
      } catch (e) {
        this.error = 'Failed to fetch suppliers'
      } finally {
        this.isLoading = false
      }
    },

    async createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        // TODO: Implement actual API call
        // const response = await $fetch('/api/suppliers', {
        //   method: 'POST',
        //   body: data
        // })
        // this.suppliers.push(response)
      } catch (e) {
        this.error = 'Failed to create supplier'
        throw e
      }
    },

    async updateSupplier(id: number, data: Partial<Supplier>) {
      try {
        // TODO: Implement actual API call
        // const response = await $fetch(`/api/suppliers/${id}`, {
        //   method: 'PUT',
        //   body: data
        // })
        // const index = this.suppliers.findIndex(s => s.id === id)
        // if (index !== -1) {
        //   this.suppliers[index] = response
        // }
      } catch (e) {
        this.error = 'Failed to update supplier'
        throw e
      }
    },

    async deleteSupplier(id: number) {
      try {
        // TODO: Implement actual API call
        // await $fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
        this.suppliers = this.suppliers.filter(s => s.id !== id)
      } catch (e) {
        this.error = 'Failed to delete supplier'
        throw e
      }
    }
  }
})

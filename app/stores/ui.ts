import { defineStore } from 'pinia'
import type { LayoutView, Theme } from '~/types'

interface UIState {
  layoutView: LayoutView
  theme: Theme
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    layoutView: 'grid',
    theme: 'system'
  }),

  actions: {
    setLayoutView(view: LayoutView) {
      this.layoutView = view
      if (import.meta.client) {
        localStorage.setItem('layoutView', view)
      }
    },

    setTheme(theme: Theme) {
      this.theme = theme
      if (import.meta.client) {
        localStorage.setItem('theme', theme)
        this.applyTheme()
      }
    },

    initFromStorage() {
      if (import.meta.client) {
        const savedView = localStorage.getItem('layoutView') as LayoutView | null
        if (savedView) {
          this.layoutView = savedView
        }

        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
          this.theme = savedTheme
        }

        this.applyTheme()
      }
    },

    applyTheme() {
      if (!import.meta.client) return

      const root = document.documentElement

      if (this.theme === 'dark') {
        root.classList.add('dark')
      } else if (this.theme === 'light') {
        root.classList.remove('dark')
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
  }
})

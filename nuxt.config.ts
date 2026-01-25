// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: {
    colors: {
      primary: 'amber',
      neutral: 'stone'
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    },
    openAPI: {
      meta: {
        title: 'WineCellar API',
        description: 'API for managing wines, wineries, suppliers, and guest favorites',
        version: '1.0.0'
      }
    }
  },
  sourcemap: {
    server: false,
    client: false
  }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/scss/main.scss'],
  nitro: {
    serverAssets: [
      {
        baseName: 'data',
        dir: './server/data'
      }
    ]
  },
  typescript: {
    strict: true
  }
})

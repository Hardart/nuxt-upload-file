// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './public',
      },
    },
  },

  modules: ['@nuxtjs/tailwindcss'],
  plugins: ['@/plugins/socketIo'],
})

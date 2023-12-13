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

  modules: ['@nuxt/image', '@nuxtjs/tailwindcss'],
})

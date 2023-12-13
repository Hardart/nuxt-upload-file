import type { Config } from 'tailwindcss'
// import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
module.exports = {
  content: ['./pages/**/*.vue', './components/**/*.vue', './app.vue'],
  theme: {
    extend: {
      screens: {
        xs: '500px',
      },
      boxShadow: {
        uikit: '0 5px 15px rgba(39,44,63,.06)',
      },
    },
  },

  // plugins: [require('@tailwindcss/aspect-ratio'), iconsPlugin({ collections: getIconCollections(['mdi', 'game-icons']) })],
} satisfies Config

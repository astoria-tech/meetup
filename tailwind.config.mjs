/** @type {import('tailwindcss').Config} */
import {colors, fontFamily} from './src/styles/themes/base'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
}

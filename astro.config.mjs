import {defineConfig} from 'astro/config'

import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  ...(process.env.NODE_ENV !== 'development'
    ? {
        site: process.env.ASTRO_CONFIG_SITE || 'https://astoria.app',
        ...(process.env.ASTRO_CONFIG_BASE ? {base: process.env.ASTRO_CONFIG_BASE} : {}),
      }
    : {
        site: 'http://localhost:4321',
        // base: '/dolphin'
      }),
})

import {defineConfig} from 'astro/config'

import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  ...(process.env.NODE_ENV !== 'development'
    ? {
        site: 'https://astoria.app',
        base: '/meetup',
      }
    : {
        site: 'http://localhost:4321',
        // base: '/dolphin'
      }),
})

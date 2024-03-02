import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  ...(process.env.NODE_ENV !== 'development' ? {
    site: 'https://reggi.github.io',
    base: '/astoria-tech-meetup-feed'
  }: {
    site: 'http://localhost:4321'
  })
})
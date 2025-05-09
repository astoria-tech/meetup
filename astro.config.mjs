import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import path from "path";

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        "@notosans-medium.otf": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-medium.otf",
        ),
        "@notosans-medium.woff": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-medium.woff",
        ),
        "@notosans-medium.woff2": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-medium.woff2",
        ),
        "@notosans-bold.otf": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-bold.otf",
        ),
        "@notosans-bold.woff": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-bold.woff",
        ),
        "@notosans-bold.woff2": path.join(
          import.meta.dirname,
          "/design/fonts/notosans/notosans-bold.woff2",
        ),
        "@playfair-regular.otf": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-regular.otf",
        ),
        "@playfair-regular.woff": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-regular.woff",
        ),
        "@playfair-regular.woff2": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-regular.woff2",
        ),
        "@playfair-bold.otf": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-bold.otf",
        ),
        "@playfair-bold.woff": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-bold.woff",
        ),
        "@playfair-bold.woff2": path.join(
          import.meta.dirname,
          "/design/fonts/playfair/playfairdisplay-bold.woff2",
        ),
      },
    },
  },
  ...(process.env.NODE_ENV !== "development"
    ? {
        site: process.env.ASTRO_CONFIG_SITE || "https://astoria.app",
        ...(process.env.ASTRO_CONFIG_BASE
          ? { base: process.env.ASTRO_CONFIG_BASE }
          : {}),
      }
    : {
        site: "http://localhost:4321",
        // base: '/dolphin'
      }),
});

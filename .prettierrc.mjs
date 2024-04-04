// .prettierrc.mjs

// Assuming @github/prettier-config is the package name and it exports a configuration object.
import githubConfig from '@github/prettier-config'

/** @type {import("prettier").Config} */
const astroConfig = {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}

// Merging the configurations
// This assumes both configs are objects and can be shallowly merged.
// For deep merging, consider using a utility function from a library like lodash.
export default {
  ...githubConfig,
  ...astroConfig,
  overrides: [...(githubConfig.overrides || []), ...astroConfig.overrides],
}

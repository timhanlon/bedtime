<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt Stories
- Package name: nuxt-stories
- Description: My new Nuxt module
-->

# Nuxt Stories

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for creating component stories.

Inspired by [Histoire](https://histoire.dev/).

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-stories?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Goals

- Excellent DX
- Fast HMR
- Idiomatic Vue/Nuxt syntax
- Thinnest possible implementation
- Ensure compatibility across the Nuxt module ecosystem
- Escape hatches for complex/unusual use cases

## Todo

- [ ] Static builds
- [ ] Improve ergonomics of `useStory`
- [ ] Tailwind viewer like Histoire
- [ ] Ability to group stories
- [ ] Component search
- [ ] Custom layouts/styles for story viewer
- [ ] Rename to something that isn’t `nuxt-stories`

## Static Build

I’ve roughly tested this by:

Adding this script to `./package.json`:

```
  "dev:generate": "nuxi generate playground",
```

Adding this route rule to `./playground/nuxt.config.ts`:

```
  routeRules: {
    '/stories/**': { static: true },
  },
```

That resulted in a working static build, but it’d be nice to have this as a first class feature for easy deployments, decoupled from the main application.

I think a combination of baseUrl & ignore would do the trick?

https://nuxt.com/docs/api/nuxt-config#baseurl

https://nuxt.com/docs/api/nuxt-config#ignore

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-stories
```

That's it! You can now use Nuxt Stories in your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-stories/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-stories

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-stories.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-stories

[license-src]: https://img.shields.io/npm/l/nuxt-stories.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-stories

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

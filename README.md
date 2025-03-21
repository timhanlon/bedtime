<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Bedtime
- Package name: nuxt-bedtime
- Description: My new Nuxt module
-->

# Bedtime

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Nuxt][nuxt-src]][nuxt-href]

Bedtime is a Nuxt module for creating component stories.

Inspired by [Histoire](https://histoire.dev/)'s excellent Story/Variant components.

This is work in progress, expect breaking changes ahead of versioned releases.

Check the [playground](https://github.com/timhanlon/bedtime/tree/main/playground) for a working example.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://codesandbox.io/p/devbox/github/timhanlon/bedtime/tree/main)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Goals

- Excellent DX
- Fast HMR
- Idiomatic Vue/Nuxt syntax
- Thinnest possible implementation
- Ensure compatibility across the Nuxt module ecosystem
- Escape hatches for complex/unusual use cases

## Features

- Compatible with Nuxt 3.15 and Vite 6
- Supports Nuxt [layers](https://nuxt.com/docs/getting-started/layers)
- Supports stories co-located with components or in a dedicated stories directory
- Copy Story/Variant templates to clipboard for easy implementation
- The `useStory` composable can be used to build your own [custom story viewer](https://github.com/timhanlon/bedtime/tree/main/playground-custom)

## Usage

```
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['nuxt-bedtime'],

  bedtime: { // optional config, with defaults shown below
    enabled: true,
    stories: {
      directories: ['./stories', './components'],
      glob: '**/*.story.vue',
    },
    viewer: {
      enabled: true,
      route: '/stories',
      theme: 'default',
    },
    classes: {
      story: {
        container: '',
        title: '',
        content: '',
      },
      variant: {
        container: '',
        title: '',
        content: '',
      },
    },
  }
})
```

## Open in Editor

Set the `LAUNCH_EDITOR` environment variable to your editor of choice:

```
LAUNCH_EDITOR=cursor pnpm dev
```

See [launch-editor](https://github.com/yyx990803/launch-editor/#supported-editors) for more details.

Note: this does not currently work in the playground, due to `nuxt dev playground` overriding the `rootDir`.

## Syntax Highlighting

Syntax highlighting is provided by [Nuxt Shiki](https://github.com/nuxt-modules/shiki), and can be configured via the `shiki` key in your `nuxt.config.ts`.

<!-- ## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add bedtime
```

That's it! You can now use Bedtime in your Nuxt app ✨ -->

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
[npm-version-src]: https://img.shields.io/npm/v/nuxt-bedtime/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-bedtime

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-bedtime.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-bedtime

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

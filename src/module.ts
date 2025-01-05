import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  addTemplate,
  updateTemplates,
  useLogger,
  addTypeTemplate,
} from '@nuxt/kit'
import { resolve } from 'pathe'

interface StoryComponent {
  pascalName: string
  kebabName: string
  shortPath: string
  global?: boolean | string
  srcDir: string
}

interface StoriesConfig {
  storiesRoute: string
  storyGlob: string
  storyDirectories: string[]
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-stories',
    configKey: 'stories',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    storiesRoute: '/stories',
    storyGlob: '**/*.story.vue',
    storyDirectories: ['./stories', './components'],
  } as StoriesConfig,
  async setup(options: StoriesConfig, nuxt) {
    const { storiesRoute, storyGlob, storyDirectories } = options
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    const logger = useLogger('nuxt-stories')

    logger.info('Setting up nuxt-stories module...')

    // Add type declarations
    addTypeTemplate({
      filename: 'types/nuxt-stories.d.ts',
      getContents: () => `
import type { Component } from 'vue'

declare module '#nuxt-stories' {
  interface Story {
    kebabName: string
    pascalName: string
    shortPath: string
    global: boolean
    component: Component
  }
  type Stories = Record<string, Story>
  const stories: Stories
  export { stories }
}
`,
    })

    // Check if using Vite
    if (nuxt.options.builder !== '@nuxt/vite-builder') {
      logger.warn('nuxt-stories does not support non-Vite environments')
    }

    // Add runtime directory to Nuxt
    nuxt.options.build.transpile.push(runtimeDir)

    // Set up the alias to point to the generated file
    nuxt.options.alias['#nuxt-stories'] = resolver.resolve(nuxt.options.buildDir, 'stories.mjs')

    // Add composables directory
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    const stories: Array<StoryComponent> = []

    // Create a stub stories.mjs file
    addTemplate({
      filename: 'stories.mjs',
      getContents: () => `
${stories.map(s => `import ${s.pascalName} from '${s.srcDir}'`).join('\n')}

export const stories = {
${stories.map(s => `  '${s.kebabName}': {
    kebabName: '${s.kebabName}',
    pascalName: '${s.pascalName}',
    shortPath: '${s.shortPath}',
    global: ${s.global},
    component: ${s.pascalName}
  }`).join(',\n')}
}
`,
    })

    // Add runtime components
    logger.debug('Adding runtime components directory:', resolve(runtimeDir, 'components'))
    await addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: '',
      global: true,
    })

    // Get all layers including the app itself
    const layerStoryDirs = [
      // Base layer (main app)
      {
        cwd: nuxt.options.srcDir,
        directories: storyDirectories,
      },
      // Additional layers
      ...nuxt.options._layers.map(layer => ({
        cwd: layer.cwd,
        directories: storyDirectories,
      })),
    ]

    // Add story components from all layers
    for (const { cwd, directories } of layerStoryDirs) {
      for (const dir of directories) {
        await addComponentsDir({
          path: resolve(cwd, dir),
          pattern: storyGlob,
          pathPrefix: false,
          prefix: '',
          global: true,
        })
      }
    }

    nuxt.hook('components:extend', async (components) => {
      const storyComponents = components.filter(c =>
        c.pascalName.endsWith('Story') && c.pascalName !== 'Story',
      )

      const newStories = storyComponents.map(component => ({
        kebabName: component.kebabName,
        pascalName: component.pascalName,
        shortPath: component.shortPath,
        global: component.global,
        srcDir: resolve(nuxt.options.srcDir, component.shortPath),
      }))

      // Only update if the stories have changed
      if (JSON.stringify(stories) !== JSON.stringify(newStories)) {
        logger.info(`Found ${storyComponents.length} story components`)
        stories.length = 0 // Clear the array
        stories.push(...newStories)
        await updateTemplates({
          filter: template => template.filename === 'stories.mjs',
        })
      }
    })

    // Add runtime routes
    nuxt.hook('pages:extend', (pages) => {
      if (!pages.some(page => page.name === 'stories-index')) {
        pages.push({
          name: 'stories-index',
          path: storiesRoute,
          file: resolver.resolve('./runtime/pages/stories-index.vue'),
        })
      }

      if (!pages.some(page => page.name === 'stories-slug')) {
        pages.push({
          name: 'stories-slug',
          path: `${storiesRoute}/:slug`,
          file: resolver.resolve('./runtime/pages/story-view.vue'),
        })
      }
    })

    logger.success('Nuxt Stories module setup complete')
  },
})

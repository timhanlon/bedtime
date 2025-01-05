import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  addTemplate,
  updateTemplates,
  useLogger,
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
  } as StoriesConfig,
  async setup(options: StoriesConfig, nuxt) {
    const { storiesRoute = '/stories', storyGlob = '**/*.story.vue' } = options
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    const logger = useLogger('nuxt-stories')

    logger.info('Setting up nuxt-stories module...')

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
      getContents: () => `export const stories = ${JSON.stringify(stories, null, 2)}`,
    })

    // Add runtime components
    logger.debug('Adding runtime components directory:', resolve(runtimeDir, 'components'))
    await addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: '',
      global: true,
    })

    // Add story components
    await addComponentsDir({
      path: nuxt.options.srcDir,
      pattern: storyGlob,
      pathPrefix: false,
      prefix: '',
      global: true,
    })

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

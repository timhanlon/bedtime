import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  useLogger,
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { globby } from 'globby'

export interface StoriesModuleOptions {
  /**
   * Glob pattern to locate your story files.
   * Defaults to scanning `~/components/**.story.vue`.
   */
  pattern?: string

  /**
   * Route path for the stories index. Defaults to '/stories'.
   */
  storiesRoute?: string
}

export default defineNuxtModule<StoriesModuleOptions>({
  meta: {
    name: 'nuxt-stories',
    configKey: 'stories',
  },
  defaults: {
    pattern: 'components/**/**.story.vue',
    storiesRoute: '/stories',
  },
  async setup(options, nuxt) {
    const logger = useLogger('nuxt-stories')
    const { pattern = 'components/**/**.story.vue', storiesRoute = '/stories' } = options
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    logger.info(`Scanning for story files matching ~/${pattern}`)

    // 1. Provide two globally available components: <Story /> and <Variant />
    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: '',
      global: true,
    })

    // 2. Scan for story files
    const storyFiles = await globby(pattern, {
      cwd: nuxt.options.srcDir,
      absolute: false,
    })

    logger.info(`Found ${storyFiles.length} story files`)

    // 3. Add runtime routes
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'stories-index',
        path: storiesRoute,
        file: resolver.resolve('./runtime/pages/index.vue'),
      })
      pages.push({
        name: 'stories-slug',
        path: `${storiesRoute}/:slug`,
        file: resolver.resolve('./runtime/pages/[slug].vue'),
      })
    })

    // 4. Add runtime config for story files
    nuxt.options.runtimeConfig.public.stories = {
      files: storyFiles.map(path => ({
        slug: path
          .replace(/^.*components\//, '')
          .replace(/\.story\.vue$/, '')
          .replace(/[\\/]/g, '_'),
        path: path.replace(/^components\//, '') + '.vue',
      })),
    }
  },
})

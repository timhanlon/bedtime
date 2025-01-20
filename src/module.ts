import { existsSync, readFileSync } from 'node:fs'
import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  addTemplate,
  updateTemplates,
  useLogger,
  addTypeTemplate,
  installModule,
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { parse } from '@vue/compiler-sfc'
import { defu } from 'defu'
import { extractStoryContent } from './utils/template-extraction'
import type {
  BedtimeModuleOptions,
  ResolvedBedtimeModuleOptions,
  BedtimeStory,
  BedtimeVariant,
} from './types/module'

export default defineNuxtModule<BedtimeModuleOptions>({
  meta: {
    name: 'nuxt-bedtime',
    configKey: 'bedtime',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
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
  },
  async setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    // Merge options with runtime config
    nuxt.options.runtimeConfig.public.bedtime = defu(
      nuxt.options.runtimeConfig.public.bedtime || {},
      options,
    ) as Required<BedtimeModuleOptions>

    // Ensure our final merged options are typed correctly
    // Thanks Johann / https://github.com/johannschopplich/nuxt-api-party
    const resolvedOptions = nuxt.options.runtimeConfig.public.bedtime as ResolvedBedtimeModuleOptions

    const storyGlob = resolvedOptions.stories.glob
    const storyDirectories = resolvedOptions.stories.directories
    const storyViewerRoute = resolvedOptions.viewer.route

    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    const logger = useLogger('bedtime')

    logger.info('Setting up bedtime module...')

    // Add type declarations
    addTypeTemplate({
      filename: 'types/bedtime.d.ts',
      getContents: () => `
// auto-generated by bedtime module
import type { BedtimeModuleOptions, BedtimeStory, BedtimeStories, DeepPartial } from '${resolve('./types/module')}'

export { BedtimeStory, BedtimeStories }

declare module '@nuxt/schema' {
  interface NuxtConfig {
    bedtime?: DeepPartial<BedtimeModuleOptions>
  }
  interface NuxtOptions {
    bedtime?: DeepPartial<BedtimeModuleOptions>
  }
}

export {}
`,
    })

    await installModule('nuxt-shiki', {
      bundledLangs: ['vue'],
    })
    // https://github.com/pi0/nuxt-shiki/issues/41
    nuxt.options.nitro.experimental = nuxt.options.nitro.experimental || {}
    nuxt.options.nitro.experimental.wasm = true

    // Ensure types are included in tsconfig
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: resolve(nuxt.options.buildDir, 'types/bedtime.d.ts') })
    })

    // Add runtime directory to Nuxt
    nuxt.options.build.transpile.push(runtimeDir)

    // Add variables.css to Nuxt
    nuxt.options.css.push(resolve(runtimeDir, 'variables.css'))

    // Add composables directory
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    const stories: Array<BedtimeStory> = []

    // Create a stub stories.mjs file
    addTemplate({
      filename: 'stories.mjs',
      getContents: () => `
${stories.map(s => `import ${s.pascalName} from '${s.filePath}'`).join('\n')}

export const stories = {
${stories.map(s => `  '${s.kebabName}': {
    kebabName: '${s.kebabName}',
    pascalName: '${s.pascalName}',
    shortPath: '${s.shortPath}',
    filePath: '${s.filePath}',
    component: ${s.pascalName},
    template: ${JSON.stringify(s.template)},
    variants: ${JSON.stringify(s.variants)}
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
        // Check if the directory exists
        const dirPath = resolve(cwd, dir)
        if (existsSync(dirPath)) {
          await addComponentsDir({
            path: dirPath,
            pattern: storyGlob,
            pathPrefix: false,
            prefix: '',
            global: true,
          })
        }
      }
    }

    nuxt.hook('components:extend', async (components) => {
      const storyComponents = components.filter(c =>
        c.pascalName.endsWith('Story') && c.pascalName !== 'Story',
      )

      const newStories = await Promise.all(storyComponents.map(async (component) => {
        const filePath = resolve(nuxt.options.srcDir, component.shortPath)
        const code = readFileSync(filePath, 'utf-8')
        const { descriptor } = parse(code)

        let template
        const variants: Record<string, BedtimeVariant> = {}

        if (descriptor.template) {
          const { template: extractedTemplate, variants: extractedVariants }
            = extractStoryContent(descriptor.template.content, filePath, component.pascalName)
          template = extractedTemplate ?? undefined
          Object.assign(variants, extractedVariants)
        }

        return {
          kebabName: component.kebabName,
          pascalName: component.pascalName,
          shortPath: component.shortPath,
          filePath: component.filePath,
          template,
          variants,
        }
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
      if (!resolvedOptions.viewer.enabled) {
        return
      }

      if (!pages.some(page => page.name === 'stories-index')) {
        pages.push({
          name: 'stories-index',
          path: storyViewerRoute,
          file: resolver.resolve('./runtime/pages/stories-index.vue'),
        })
      }

      if (!pages.some(page => page.name === 'stories-slug')) {
        pages.push({
          name: 'stories-slug',
          path: `${storyViewerRoute}/:slug`,
          file: resolver.resolve('./runtime/pages/story-view.vue'),
        })
      }
    })

    logger.success('Bedtime module setup complete')
  },
})

import { readFileSync } from 'node:fs'
import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  addTemplate,
  updateTemplates,
  useLogger,
  addTypeTemplate,
  addLayout,
} from '@nuxt/kit'
import { resolve } from 'pathe'
import { parse, compileTemplate } from 'vue/compiler-sfc'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core'

// Clean up template indentation
function cleanTemplate(template: string) {
  const lines = template
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  // If it's a single line, return as is
  if (lines.length === 1) return lines[0]

  // For multiline, add proper indentation
  return lines[0] + '\n'
    + lines.slice(1, -1).map(line => '  ' + line).join('\n') + '\n'
    + lines[lines.length - 1]
}

// Extract variant content from template node
function extractVariantContent(variantNode: ElementNode, template: string) {
  if (!variantNode.children) return null

  // Get the name prop
  const props = variantNode.props?.find(p => p.name === 'name')
  const name = props?.type === 6 ? props.value?.content || '' : ''
  if (!name) return null

  // Get the slot content
  const content = variantNode.children
    .filter((child): child is TemplateChildNode => child.type !== 3) // Skip whitespace nodes
    .map((child) => {
      if ('loc' in child) {
        return template.slice(child.loc.start.offset, child.loc.end.offset).trim()
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')

  return { name, content }
}

// Extract story content from template
function extractStoryContent(template: string, filename: string, id: string) {
  const { ast } = compileTemplate({
    source: template,
    filename,
    id,
  })

  if (!ast || !('children' in ast)) return { template: null, variants: {} }

  // Find the Story component's content
  const storyNode = ast.children.find(node =>
    node.type === 1 // Element
    && 'tag' in node
    && node.tag === 'Story',
  ) as ElementNode | undefined

  if (!storyNode?.children) return { template: null, variants: {} }

  // Find all Variant components
  const variantNodes = storyNode.children
    .filter((node): node is ElementNode =>
      node.type === 1 // Element
      && 'tag' in node
      && node.tag === 'Variant',
    )

  // If no variants, return the story content as template
  if (variantNodes.length === 0) {
    const content = storyNode.children
      .filter((child): child is TemplateChildNode => child.type !== 3) // Skip whitespace nodes
      .map((child) => {
        if ('loc' in child) {
          return template.slice(child.loc.start.offset, child.loc.end.offset).trim()
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')

    return {
      template: cleanTemplate(content),
      variants: {},
    }
  }

  // Process variants
  const processedVariants = variantNodes
    .map(node => extractVariantContent(node, template))
    .filter((v): v is { name: string, content: string } => v !== null)

  // Store variant templates
  const variants: Record<string, string> = {}
  processedVariants.forEach(({ name, content }) => {
    variants[name] = cleanTemplate(content)
  })

  return { template: null, variants }
}

interface StoryComponent {
  pascalName: string
  kebabName: string
  shortPath: string
  global?: boolean | string
  srcDir: string
  template?: string | null
  variants?: Record<string, string>
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

    // Add the stories layout
    addLayout({
      src: resolver.resolve(runtimeDir, 'layouts/stories.vue'),
      filename: 'stories.vue',
    })

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
    sourceCode?: string
    variants?: Record<string, string>
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

      const newStories = await Promise.all(storyComponents.map(async (component) => {
        const filePath = resolve(nuxt.options.srcDir, component.shortPath)
        const code = readFileSync(filePath, 'utf-8')
        const { descriptor } = parse(code)

        let template = null
        const variants: Record<string, string> = {}

        if (descriptor.template) {
          const { template: extractedTemplate, variants: extractedVariants }
            = extractStoryContent(descriptor.template.content, filePath, component.pascalName)
          template = extractedTemplate
          Object.assign(variants, extractedVariants)
        }

        return {
          kebabName: component.kebabName,
          pascalName: component.pascalName,
          shortPath: component.shortPath,
          global: component.global,
          srcDir: resolve(nuxt.options.srcDir, component.shortPath),
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

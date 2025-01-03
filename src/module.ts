import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  addTemplate,
  useLogger,
} from '@nuxt/kit'

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

  /**
   * Whether to eagerly import story files. Defaults to true.
   */
  eager?: boolean
}

export default defineNuxtModule<StoriesModuleOptions>({
  meta: {
    name: 'nuxt-stories',
    configKey: 'stories',
  },
  defaults: {
    pattern: 'components/**/**.story.vue',
    storiesRoute: '/stories',
    eager: true,
  },
  setup(options, nuxt) {
    const logger = useLogger('nuxt-stories')
    const { pattern, storiesRoute, eager } = options
    const resolver = createResolver(nuxt.options.srcDir)

    logger.info(`Scanning for story files matching ~/${pattern}`)

    // 1. Provide two globally available components: <Story /> and <Variant />
    //    We can place them in a sub-directory in this module, or inline them as templates.
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false, // so it doesn't require referencing a subfolder
      prefix: '', // let them be imported by name directly
      global: true, // automatically register them globally
    })

    // 2. Add the "index" page ( /stories ) and the dynamic "slug" page ( /stories/[slug] )
    //    We will use addTemplate to inject code that uses import.meta.glob to list and load story files.

    // (a) Index page template
    addTemplate({
      filename: 'stories-index-page.vue',
      getContents: () => `
<template>
  <div>
    <h1>All Stories</h1>
    <ul>
      <li v-for="story of allStoryEntries" :key="story.slug">
        <NuxtLink :to="\`${storiesRoute}/\${story.slug}\`">{{ story.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const storyFiles = import.meta.glob('${resolver.resolve(pattern)}', { eager: ${eager} })

const allStoryEntries = computed(() => {
  return Object.entries(storyFiles).map(([path, definition]) => {
    // Derive a slug from the file path, e.g., "MyButton" from "MyButton.story.vue"
    // Replace directories with underscores for a simple route param
    // e.g. ~/components/MyFolder/MyButton.story.vue -> "MyFolder_MyButton"
    const slug = path
      .replace(/^.*components\\//, '')
      .replace(/\\.story\\.vue$/, '')
      .replace(/[\\\\\\/]/g, '_')

    // Title is just the slug by default
    return {
      slug,
      title: slug
    }
  })
})
</script>
      `,
    })

    // (b) Slug page template
    addTemplate({
      filename: 'stories-slug-page.vue',
      getContents: () => `
<template>
  <div v-if="storyComponent">
    <component :is="storyComponent.default" />
  </div>
  <div v-else>
    <h1>Story not found</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const storyComponent = ref<any>(null)

// Reconstruct the file path from the slug (which replaced "/" with "_")
const slug = route.params.slug
const path = 'components/' + slug.replaceAll('_', '/') + '.story.vue'

// For consistency, use the same import.meta.glob as the index page
// But let's do it dynamic so we demonstrate lazy loading:
const storyFiles = import.meta.glob('/**/*.story.vue') 

onMounted(async () => {
  const possiblePaths = Object.keys(storyFiles)
  // We can't rely on "~" or absolute alias here, so we do a naive match:
  const matchingPath = possiblePaths.find(p => p.endsWith(path))
  if (matchingPath) {
    storyComponent.value = await storyFiles[matchingPath]()
  }
})
</script>
      `,
    })

    // 3. Extend the Nuxt app routes so these templates appear at /stories + /stories/[slug]
    nuxt.hook('pages:extend', (pages) => {
      // add the index page
      pages.push({
        name: 'stories-index',
        path: storiesRoute,
        file: resolver.resolve(nuxt.options.buildDir, 'stories-index-page.vue'),
      })
      // add the slug page
      pages.push({
        name: 'stories-slug',
        path: `${storiesRoute}/:slug`,
        file: resolver.resolve(nuxt.options.buildDir, 'stories-slug-page.vue'),
      })
    })
  },
})

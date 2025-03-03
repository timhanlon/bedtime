<template>
  <StoriesLayout>
    <div class="stories-index">
      <h1>Options</h1>
      <label>
        <input
          v-model="options.tree"
          type="checkbox"
        > Show tree
      </label>
    </div>
  </StoriesLayout>
</template>

<script setup lang="ts">
import StoriesLayout from '../layouts/stories.vue'
import { useOptions } from '../composables/useOptions'

const options = useOptions()
</script>

<style scoped>
.stories-index {
  padding: 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>

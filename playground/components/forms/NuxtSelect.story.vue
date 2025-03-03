<script setup lang="ts">
import { ref } from 'vue'

const drinks = [
  'Coke Zero',
  'Pepsi Max',
]

const selected = ref(drinks[0])
</script>

<template>
  <Story>
    <USelect
      v-model="selected"
      :items="drinks"
    />
  </Story>
</template>

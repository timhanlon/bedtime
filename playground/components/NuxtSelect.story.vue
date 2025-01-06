<script setup lang="ts">
import { ref } from 'vue'

const drinks = [
  'Coke Zero',
  'Pepsi Max',
]

const selected = ref(drinks[0])
</script>

<template>
  <USelect
    v-model="selected"
    :items="drinks"
  />
</template>

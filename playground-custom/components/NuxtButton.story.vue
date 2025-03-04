<template>
  <Story
    title="Button"
    :classes="{ content: 'grid grid-cols-2 gap-4' }"
  >
    <Variant title="Default">
      <UButton>Button</UButton>
    </Variant>

    <Variant title="Class Overrides">
      <UButton class="font-bold rounded-full">
        Button
      </UButton>
    </Variant>
  </Story>
</template>

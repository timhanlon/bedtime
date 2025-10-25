<template>
  <Story
    title="Badge"
    :layout="{ width: '33%' }"
  >
    <Variant title="Default">
      <UBadge>Badge</UBadge>
    </Variant>

    <Variant title="Class Overrides">
      <UBadge class="font-bold rounded-full">
        Badge
      </UBadge>
    </Variant>

    <Variant title="Size">
      <UBadge size="lg">
        Badge
      </UBadge>
    </Variant>

    <Variant title="Color">
      <UBadge color="secondary">
        Badge
      </UBadge>
    </Variant>

    <Variant title="Label">
      <UBadge label="A label" />
    </Variant>
  </Story>
</template>

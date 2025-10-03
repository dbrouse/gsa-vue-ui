<script setup lang="ts">
const props = defineProps<{
  title?: string
  class?: string
}>()
</script>

<template>
  <div
    :class="[
      'bg-white md:rounded-lg shadow-soft dark:bg-dark-2 px-4 py-5 md:px-8 md:py-6 border-1 border-gray-200/70 dark:border-dark-3',
      props.class,
    ]"
    v-bind="$attrs"
  >
    <h3 v-if="props.title" class="text-lg font-medium dark:text-white mb-4">{{ props.title }}</h3>
    <slot />
  </div>
</template>

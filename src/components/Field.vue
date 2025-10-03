<script setup lang="ts">
import Text from './Text.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    note?: string
    notePosition?: 'above' | 'below'
    class?: string
  }>(),
  {
    notePosition: 'above',
  }
)
</script>

<template>
  <div class="w-full" :class="props.class">
    <label v-if="props.label" class="mb-1 md:mb-2 block text-[13px] text-dark dark:text-white">
      {{ props.label }}
    </label>

    <div v-if="props.note && props.notePosition === 'above'" class="mb-2">
      <Text small faint no-margin>{{ props.note }}</Text>
    </div>

    <div>
      <slot />
    </div>

    <div v-if="props.note && props.notePosition === 'below'" class="mt-2">
      <Text small faint no-margin>{{ props.note }}</Text>
    </div>

    <div v-if="props.error" class="mt-2 text-xs text-red-600 dark:text-red-500">
      {{ props.error }}
    </div>
  </div>
</template>

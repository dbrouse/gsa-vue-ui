<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    gap?: number
    className?: string
  }>(),
  {
    gap: 6,
  }
)

const normalizedGap = computed(() => {
  const value = Number.isFinite(props.gap) ? Math.floor(props.gap as number) : 0
  return value < 0 ? 0 : value
})

const classes = computed(() => [
  'flex flex-col w-full',
  `gap-${normalizedGap.value}`,
  props.className,
])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

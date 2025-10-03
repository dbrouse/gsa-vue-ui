<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    className?: string
  }>(),
  {}
)

const injected = inject<ComputedRef<string> | undefined>('tabsActiveName')
const isActive = computed(() => (injected ? injected.value === props.name : false))
</script>

<template>
  <div v-show="isActive" :class="props.className">
    <slot />
  </div>
</template>

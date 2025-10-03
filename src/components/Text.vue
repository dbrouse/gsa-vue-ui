<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: boolean
  pageTitle?: boolean
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  p?: boolean
  small?: boolean
  className?: string
  noMargin?: boolean
  faint?: boolean
}>()

const tagName = computed<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p'>(() => {
  if (props.title) return 'h1'
  if (props.pageTitle) return 'h1'
  if (props.h1) return 'h1'
  if (props.h2) return 'h2'
  if (props.h3) return 'h3'
  if (props.h4) return 'h4'
  if (props.h5) return 'h5'
  if (props.small) return 'p'
  return 'p'
})

const baseClasses = computed(() => {
  if (props.title) return 'text-4xl md:text-5xl font-medium leading-tight text-dark dark:text-white'
  if (props.pageTitle)
    return 'text-2xl md:text-3xl font-medium leading-tight text-dark dark:text-white px-3 pt-5 pb-0 md:p-0'
  if (props.h1) return 'text-2xl md:text-3xl font-medium leading-tight text-dark dark:text-white'
  if (props.h2) return 'text-xl md:text-2xl font-medium leading-snug text-dark dark:text-white'
  if (props.h3) return 'text-lg md:text-xl font-medium leading-snug text-dark dark:text-white'
  if (props.h4) return 'text-xl md:text-lg font-medium leading-snug text-dark dark:text-white'
  if (props.h5) return 'text-xs md:text-sm font-medium leading-snug text-dark dark:text-white'
  if (props.small) return 'text-xs md:text-sm leading-relaxed text-body-color dark:text-gray-300'
  return 'text-base leading-relaxed text-body-color dark:text-gray-300'
})

const marginClass = computed(() => {
  if (props.noMargin) return 'mb-0'
  if (props.title) return 'mb-5'
  if (props.pageTitle) return 'mb-9'
  if (props.h1) return 'mb-3'
  if (props.h2) return 'mb-2'
  if (props.h3) return 'mb-2'
  if (props.h4) return 'mb-2'
  if (props.h5) return 'mb-1'
  return 'mb-6'
})

const finalClasses = computed(
  () =>
    `${baseClasses.value} ${marginClass.value}${props.faint ? ' opacity-50' : ''}${props.className ? ` ${props.className}` : ''}`
)
</script>

<template>
  <component :is="tagName" :class="finalClasses">
    <slot />
  </component>
</template>

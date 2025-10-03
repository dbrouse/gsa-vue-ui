<script setup lang="ts">
import { computed, useSlots, cloneVNode } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    className?: string
    onClick?: (e: MouseEvent) => void
    labelSizeSm?: string
    labelSizeMd?: string
    labelSizeLg?: string
    labelSizeXl?: string
    labelSize2xl?: string
  }>(),
  {
    labelSizeSm: 'text-sm',
    labelSizeMd: 'text-base',
    labelSizeLg: 'text-base',
    labelSizeXl: 'text-lg',
    labelSize2xl: 'text-lg',
  }
)

const baseClasses =
  'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-2 shadow-soft transition hover:shadow-md inline-flex flex-col items-center justify-center text-center select-none cursor-pointer hover:border-gray-300 dark:hover:bg-gray-700/10 dark:hover:border-gray-600'

// Container padding and gaps by breakpoint (defaults)
const containerClasses = computed(
  () => `${baseClasses} p-8 gap-2 lg:p-10 lg:gap-3 lg:gap-4 2xl:p-13 ${props.className ?? ''}`
)

// Icon sizing by breakpoint (defaults)
const iconClass = computed(() => 'h-12 w-12 lg:h-14')

const toToken = (bp: string | null, size: string) => (bp ? `${bp}:${size}` : size)

const labelClass = computed(() => {
  const sm = toToken(null, props.labelSizeSm || 'text-sm')
  const md = toToken('md', props.labelSizeMd || 'text-base')
  const lg = toToken('lg', props.labelSizeLg || 'text-lg')
  const xl = toToken('xl', props.labelSizeXl || 'text-lg')
  const two = toToken('2xl', props.labelSize2xl || 'text-lg')
  return `${sm} ${md} ${lg} ${xl} ${two} text-dark dark:text-gray-200`
})

// Keep numeric size for compatibility with icon components that read size prop (use a reasonable base)
const iconSize = computed(() => 24)

const slots = useSlots()
const processedIconVNodes = computed(() => {
  const nodes = slots.default ? slots.default() : []
  const sizeClasses = 'h-7 w-7 md:h-10 md:w-10 lg:h-12 lg:w-12'
  return nodes.map((vnode, idx) =>
    cloneVNode(vnode as any, {
      class: [(vnode as any).props?.class || '', sizeClasses],
      key: (vnode as any).key ?? idx,
    })
  )
})
</script>

<template>
  <button type="button" :class="containerClasses" @click="props.onClick?.($event)">
    <span :class="['inline-flex items-center justify-center', iconClass]">
      <template v-if="$slots.default">
        <component :is="node" v-for="(node, i) in processedIconVNodes" :key="i" />
      </template>
      <template v-else>
        <slot :icon-class="iconClass" :size="iconSize" />
      </template>
    </span>
    <span :class="labelClass">{{ props.label }}</span>
  </button>
</template>

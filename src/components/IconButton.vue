<script setup lang="ts">
import { computed, useSlots, cloneVNode } from 'vue'
import type { VNode } from 'vue'

const props = withDefaults(
  defineProps<{
    // Diameter of the circular button in Tailwind arbitrary size units, e.g. 20 => w-20 h-20
    size?: number
    // Additional classes to control background (and optionally hover/dark variants)
    bgClass?: string
    // Optional click handler
    onClick?: (e: MouseEvent) => void
    // Optional aria-label for accessibility when icon has no visible text
    ariaLabel?: string
  }>(),
  {
    size: 20,
    bgClass: 'bg-white dark:bg-dark-2 hover:bg-gray-100 dark:hover:bg-gray-700/20 cursor-pointer',
    onClick: undefined,
    ariaLabel: undefined,
  }
)

// Use inline style to guarantee a perfect square regardless of Tailwind class ordering
const circleStyle = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))

// Icon should be smaller than the circle: icon = size * 0.5
const iconSizePx = computed(() => Math.max(1, Math.round(props.size * 0.5)))
const iconSizeClasses = computed(() => `w-[${iconSizePx.value}px] h-[${iconSizePx.value}px]`)

const baseClasses =
  'inline-flex items-center justify-center rounded-full aspect-square border border-gray-200 dark:border-gray-700 shadow-soft transition hover:shadow-md text-dark dark:text-gray-200 p-0 leading-none shrink-0 overflow-hidden'

const buttonClasses = computed(() => `${baseClasses} ${props.bgClass ?? ''}`)

const slots = useSlots()
const processedIconVNodes = computed(() => {
  const nodes = (slots.default?.() ?? []) as VNode[]
  return nodes.map((vnode, idx) => {
    const existingClass =
      ((vnode.props as Record<string, unknown> | null | undefined)?.class as
        | string
        | string[]
        | undefined) ?? ''
    return cloneVNode(vnode, {
      class: [existingClass, iconSizeClasses.value],
      key: vnode.key ?? idx,
      // Many icons in vue-icons-plus accept numeric `size` prop (pixels)
      size: iconSizePx.value,
    })
  })
})
</script>

<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    :class="buttonClasses"
    :style="circleStyle"
    @click="props.onClick?.($event)"
  >
    <template v-if="$slots.default">
      <component :is="node" v-for="(node, i) in processedIconVNodes" :key="i" />
    </template>
    <template v-else>
      <!-- Empty by design: consumer supplies icon via default slot -->
    </template>
  </button>
</template>

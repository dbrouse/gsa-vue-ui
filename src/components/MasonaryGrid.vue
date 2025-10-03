<script setup lang="ts">
import { computed, useSlots, cloneVNode } from 'vue'

const props = withDefaults(
  defineProps<{
    containerClass?: string
    itemClass?: string
  }>(),
  {
    containerClass: 'columns-1 min-[1200px]:columns-2 min-[1800px]:columns-3 gap-6',
    itemClass: 'mb-6 break-inside-avoid',
  }
)

const slots = useSlots()

const processedChildren = computed(() => {
  const children = slots.default ? slots.default() : []
  return children.map((child, index) => {
    // Merge/append classes onto each direct child (e.g., Card)
    return cloneVNode(child, {
      class: [child.props?.class, props.itemClass],
      key: child.key ?? index,
    })
  })
})
</script>

<template>
  <div :class="props.containerClass">
    <component v-for="(vnode, i) in processedChildren" :is="vnode" :key="vnode.key ?? i" />
  </div>
</template>

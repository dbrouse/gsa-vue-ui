<script setup lang="ts">
import { onMounted, onUnmounted, ref, useSlots, computed, nextTick } from 'vue'
import Button from './Button.vue'
import { BiChevronDown } from 'vue-icons-plus/bi'

type DropdownItem = {
  text: string
  onClick?: (event: MouseEvent) => void
}

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = defineProps<{
  label?: string
  'label-'?: string
  items?: DropdownItem[]
  // Button variant booleans (forwarded to default trigger Button)
  primary?: boolean
  outline?: boolean
  danger?: boolean
  warning?: boolean
  success?: boolean
  // Button size forwarded to default trigger
  size?: ButtonSize
}>()

const dropdownOpen = ref(false)
const wrapperRef = ref<HTMLDivElement | null>(null)
const menuRef = ref<HTMLDivElement | null>(null)
const slots = useSlots()

const triggerLabel = computed(() => props.label ?? props['label-'] ?? 'Dropdown Button')

const chevronSizeBySize: Record<ButtonSize, number> = {
  xs: 11,
  sm: 13,
  md: 17,
  lg: 19,
  xl: 22,
}
const chevronSize = computed(() => chevronSizeBySize[props.size ?? 'md'])

const openDirection = ref<'down' | 'up'>('down')
const horizontalAlign = ref<'left' | 'right'>('left')
const maxHeightPx = ref<number | null>(null)

const updatePosition = () => {
  if (!wrapperRef.value || !menuRef.value) return
  const triggerRect = wrapperRef.value.getBoundingClientRect()
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const margin = 8

  // Ensure menu has layout
  const menuEl = menuRef.value
  const menuW = menuEl.offsetWidth

  const spaceBelow = viewportH - triggerRect.bottom
  const spaceAbove = triggerRect.top

  // Choose vertical direction
  if (spaceBelow >= spaceAbove) {
    openDirection.value = spaceBelow > margin ? 'down' : 'up'
  } else {
    openDirection.value = spaceAbove > margin ? 'up' : 'down'
  }

  // Compute maxHeight to keep within viewport
  maxHeightPx.value = Math.max(
    0,
    (openDirection.value === 'down' ? spaceBelow : spaceAbove) - margin
  )

  // Choose horizontal alignment
  const overflowRight = triggerRect.left + menuW > viewportW - margin
  const overflowLeft = triggerRect.right - menuW < margin
  if (overflowRight && !overflowLeft) {
    horizontalAlign.value = 'right'
  } else {
    horizontalAlign.value = 'left'
  }
}

const toggleDropdown = async () => {
  if (!dropdownOpen.value) {
    dropdownOpen.value = true
    await nextTick()
    updatePosition()
  } else {
    dropdownOpen.value = false
  }
}

const items = computed<DropdownItem[]>(() => props.items ?? [])

// Custom composition function to handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    dropdownOpen.value = false
  }
}

const handleItemClick = (item: DropdownItem, event: MouseEvent) => {
  item.onClick?.(event)
  dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', () => dropdownOpen.value && updatePosition())
  window.addEventListener('scroll', () => dropdownOpen.value && updatePosition(), true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', () => dropdownOpen.value && updatePosition())
  window.removeEventListener('scroll', () => dropdownOpen.value && updatePosition(), true)
})

const alignClass = computed(() =>
  horizontalAlign.value === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
)
const openPosClass = computed(() => (openDirection.value === 'up' ? 'bottom-full' : 'top-full'))
const closedPosClass = computed(() =>
  openDirection.value === 'up' ? 'bottom-[110%]' : 'top-[110%]'
)
</script>

<template>
  <div ref="wrapperRef" class="relative inline-block text-left [&>*]:mb-0">
    <template v-if="slots.trigger">
      <slot name="trigger" :toggle="toggleDropdown" :open="dropdownOpen" />
    </template>
    <template v-else-if="slots.default">
      <span class="inline-flex [&_*]:mb-0" @click="toggleDropdown">
        <slot />
      </span>
    </template>
    <template v-else>
      <Button
        :label="triggerLabel"
        :primary="props.primary"
        :outline="props.outline"
        :danger="props.danger"
        :warning="props.warning"
        :success="props.success"
        :size="props.size"
        @click.prevent="toggleDropdown"
      >
        <template #suffix>
          <BiChevronDown
            :size="chevronSize"
            class="transition-transform duration-200"
            :class="dropdownOpen ? 'rotate-180' : ''"
          />
        </template>
      </Button>
    </template>
    <div
      ref="menuRef"
      class="shadow-1 dark:shadow-box-dark absolute z-40 mt-2 min-w-[12rem] rounded-md bg-white dark:bg-dark-2 py-[10px] transition-all duration-200 overflow-auto"
      :class="[alignClass, dropdownOpen ? openPosClass + ' opacity-100 visible' : 'hidden']"
      :style="{
        maxHeight: maxHeightPx != null ? maxHeightPx + 'px' : undefined,
        maxWidth: 'calc(100vw - 16px)',
      }"
    >
      <template v-for="item in items" :key="item.text">
        <button
          type="button"
          class="text-body-color dark:text-dark-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-black block w-full text-left px-5 py-2 text-base dark:hover:text-white"
          @click="(e) => handleItemClick(item, e)"
        >
          {{ item.text }}
        </button>
      </template>
    </div>
  </div>
</template>

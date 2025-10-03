<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { FaChevronDown } from 'vue-icons-plus/fa'

type NavItem = {
  label?: string
  icon?: Component
  value?: string
  onClick?: () => void
  color?: string // arrow color when active (light mode)
  colorDark?: string // arrow color when active (dark mode)
}

const props = withDefaults(
  defineProps<{
    items: NavItem[]
    className?: string
    activeValue?: string
    collapseBreakpointPx?: number
    largeGapBreakpointPx?: number
  }>(),
  {
    collapseBreakpointPx: 1120,
    largeGapBreakpointPx: 1300,
  }
)

const defaultColor = '#F5F7F9'
const defaultColorDark = '#F5F7F9'
const isCollapsedOpen = ref(false)

const isWide = ref(false)
const useLargeGaps = ref(false)

const computeResponsiveState = () => {
  const width = window.innerWidth
  isWide.value = width >= (props.collapseBreakpointPx ?? 1120)
  useLargeGaps.value = width >= (props.largeGapBreakpointPx ?? 1300)
}
onMounted(() => {
  computeResponsiveState()
  window.addEventListener('resize', computeResponsiveState)
})
onUnmounted(() => {
  window.removeEventListener('resize', computeResponsiveState)
})

const isActive = (val?: string) => props.activeValue === (val ?? '')

const emit = defineEmits<{ (e: 'select', value: string, item?: NavItem): void }>()
const selectItem = (value: string, item?: NavItem) => emit('select', value, item)

const activeItem = computed(() => props.items.find((i) => isActive(i.value)))
const activeLabel = computed(() => activeItem.value?.label ?? activeItem.value?.value ?? '')
</script>

<template>
  <nav class="w-full" :class="[props.className, isWide ? 'md:pt-3' : 'md:pt-3']">
    <div class="w-full flex md:items-end justify-between" :class="isWide ? 'pl-2' : 'pl-0'">
      <!-- Wide (>=breakpoint) -->
      <div :class="[isWide ? 'flex' : 'hidden', 'pl-2', useLargeGaps ? 'gap-3' : 'gap-1']">
        <a
          v-for="item in props.items"
          :key="(item.label || '') + String(item.value)"
          href="#"
          :class="[
            useLargeGaps ? 'text-base h-10' : 'text-sm h-8',
            'font-medium hover:text-white flex flex-col items-center justify-between',
            isActive(item.value) ? 'text-white font-semibold' : 'text-gray-400',
            item.icon ? 'px-0' : 'px-3',
          ]"
          @click.prevent="item.onClick ? item.onClick() : selectItem(String(item.value ?? ''))"
        >
          <component :is="item.icon" v-if="item.icon" size="19" />
          <span v-else>{{ item.label }}</span>
          <span
            v-if="isActive(item.value)"
            class="pointer-events-none h-0 w-0 rotate-180 border-l-[5px] border-r-[5px] border-t-[7px] dark:hidden"
            :style="{
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: item.color || defaultColor,
            }"
          />
          <span
            v-if="isActive(item.value)"
            class="hidden dark:inline-block pointer-events-none h-0 w-0 rotate-180 border-l-[5px] border-r-[5px] border-t-[7px]"
            :style="{
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: item.colorDark || item.color || defaultColorDark,
            }"
          />
        </a>
      </div>

      <!-- Collapsed (<breakpoint) -->
      <div :class="[isWide ? 'hidden' : 'flex', 'flex-1 flex-col grow-1']">
        <button
          type="button"
          class="h-14 text-gray-300 hover:text-white transition flex items-center gap-3 py-3 px-4 cursor-pointer"
          aria-label="Toggle navigation"
          @click="isCollapsedOpen = !isCollapsedOpen"
        >
          <FaChevronDown
            :class="[isCollapsedOpen ? 'rotate-180' : 'rotate-0', 'transition-transform']"
            size="12"
          />
          <div class="text-xl font-medium text-white truncate">{{ activeLabel }}</div>
        </button>
      </div>

      <slot />
    </div>
    <div v-show="isCollapsedOpen" class="mt-3">
      <a
        v-for="item in props.items"
        :key="'m-' + (item.label || '') + String(item.value)"
        href="#"
        class="block px-3 py-4 text-sm font-medium"
        :class="
          isActive(item.value)
            ? 'bg-white/16 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        "
        @click.prevent="
          () => {
            isCollapsedOpen = false
            item.onClick ? item.onClick() : selectItem(String(item.value ?? ''))
          }
        "
      >
        {{ item.label ?? item.value }}
      </a>
    </div>
  </nav>
</template>

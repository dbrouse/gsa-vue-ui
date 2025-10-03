<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

type Breadcrumb = {
  label: string
  to?: string
  onClick?: () => void
}

const props = withDefaults(
  defineProps<{
    icon?: Component | string
    breadcrumbs?: Breadcrumb[]
    color?: string
    colorDark?: string
    className?: string
    darkText?: boolean
  }>(),
  {
    breadcrumbs: () => [],
    color: 'bg-primary',
  }
)

// Support Tailwind bg-* classes OR raw CSS color values (e.g. #F6CA45, rgb(), hsl(), var(), named colors)
const isTailwindBg = computed(() => (props.color || '').startsWith('bg-'))
const isTailwindBgDark = computed(() => (props.colorDark || '').startsWith('bg-'))

const containerClasses = computed(() => {
  const classes: (string | undefined)[] = []
  if (isTailwindBg.value) classes.push(props.color)
  // If a Tailwind class was provided for dark, prefix with dark: unless already present
  if (isTailwindBgDark.value) {
    classes.push(
      props.colorDark?.startsWith('dark:')
        ? (props.colorDark as string)
        : (`dark:${props.colorDark}` as string)
    )
  }
  classes.push('text-white w-full', props.className)
  // For raw colors, we add bracket utilities via a separate computed below
  return classes.filter(Boolean) as string[]
})
const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!isTailwindBg.value && props.color) style['--subheader-bg'] = String(props.color)
  if (!isTailwindBgDark.value && props.colorDark)
    style['--subheader-bg-dark'] = String(props.colorDark)
  return Object.keys(style).length ? style : undefined
})
const navTextClass = computed(() => (props.darkText ? 'text-black' : 'text-white'))
</script>

<template>
  <div
    :class="[
      containerClasses,
      // Apply raw color variables via arbitrary property utilities
      !isTailwindBg && props.color ? '[background:var(--subheader-bg)]' : '',
      !isTailwindBgDark && props.colorDark
        ? 'dark:[background:var(--subheader-bg-dark)]'
        : '',
    ]"
    :style="containerStyle"
    :data-test="'subheader'"
  >
    <div class="px-4 py-3">
      <div class="flex items-center justify-between gap-4">
        <!-- Left: icon + breadcrumbs -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <component :is="props.icon" v-if="props.icon" size="19" :class="navTextClass" />
          <nav
            aria-label="Breadcrumb"
            :class="[
              'flex items-center gap-3 text-sm flex-1 min-w-0 overflow-hidden flex-wrap',
              navTextClass,
            ]"
          >
            <template v-for="(bc, idx) in props.breadcrumbs" :key="bc.label + idx">
              <router-link
                v-if="bc.to"
                :to="bc.to"
                class="md:flex-none opacity-90 hover:opacity-100 flex-wrap"
                @click.stop.prevent="bc.onClick ? bc.onClick() : undefined"
              >
                {{ bc.label }}
              </router-link>
              <button
                v-else-if="bc.onClick"
                type="button"
                class="block flex-1 opacity-90 hover:opacity-100 text-left"
                @click="bc.onClick()"
              >
                {{ bc.label }}
              </button>
              <span v-else class="opacity-100">
                {{ bc.label }}
              </span>
              <span v-if="idx < props.breadcrumbs.length - 1" class="opacity-60">›</span>
            </template>
          </nav>
        </div>

        <!-- Right: slot -->
        <div class="flex items-center gap-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

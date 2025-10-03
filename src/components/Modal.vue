<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import Text from './Text.vue'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    title?: string
    fullScreen?: boolean
    onOpen?: () => void
    afterOpen?: () => void
    onClose?: () => void
    afterClose?: () => void
  }>(),
  {
    visible: false,
    fullScreen: false,
  }
)

const emit = defineEmits<{ (e: 'close'): void }>()

const panelRef = ref<HTMLDivElement | null>(null)

const openClasses = computed(() =>
  props.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
)

const panelOpenClasses = computed(() =>
  props.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
)

const panelBaseClasses = computed(() =>
  props.fullScreen
    ? 'fixed inset-0 w-screen h-screen rounded-none bg-white dark:bg-dark-2 shadow-none dark:shadow-none transition-all duration-200 transform overflow-hidden'
    : 'fixed top-0 md:top-[120px] bottom-0 w-[100vw] mx-0 md:w-[90vw] md:mx-[5vw] min-[1300px]:w-[1170px] min-[1300px]:mx-auto min-[1300px]:left-1/2 min-[1300px]:-translate-x-1/2 md:rounded-t-xl bg-white dark:bg-dark-2 shadow-1 dark:shadow-card transition-all duration-200 transform overflow-hidden'
)

const lockScroll = () => {
  document.body.style.overflow = 'hidden'
}
const unlockScroll = () => {
  document.body.style.overflow = ''
}

const callMaybe = (fn?: unknown) => {
  if (typeof fn === 'function') {
    try {
      ;(fn as () => void)()
    } catch (e) {
      // swallow to avoid breaking transitions; user handlers log as needed
      console.error(e)
    }
  }
}

watch(
  () => props.visible,
  (open) => {
    if (open) {
      lockScroll()
      callMaybe(props.onOpen)
      nextTick(() => {
        const el = panelRef.value
        if (!el) {
          callMaybe(props.afterOpen)
          return
        }
        const handler = () => {
          clearTimeout(timer)
          el.removeEventListener('transitionend', handler)
          callMaybe(props.afterOpen)
        }
        const timer = setTimeout(handler, 250)
        el.addEventListener('transitionend', handler)
      })
    } else {
      callMaybe(props.onClose)
      nextTick(() => {
        const el = panelRef.value
        if (!el) {
          callMaybe(props.afterClose)
          unlockScroll()
          return
        }
        const handler = () => {
          clearTimeout(timer)
          el.removeEventListener('transitionend', handler)
          callMaybe(props.afterClose)
          unlockScroll()
        }
        const timer = setTimeout(handler, 250)
        el.addEventListener('transitionend', handler)
      })
    }
  }
)

onMounted(() => {})
onUnmounted(() => unlockScroll())
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-40 bg-dark-2/70 transition-opacity duration-200"
    :class="openClasses"
    @click="$emit('close')"
  />

  <!-- Fixed panel: top offset 150px, bottom 0. Centered horizontally -->
  <div
    :class="openClasses"
    class="fixed inset-0 z-50 transition-opacity duration-200"
    aria-modal="true"
    role="dialog"
    @click.self="$emit('close')"
  >
    <div ref="panelRef" :class="[panelBaseClasses, panelOpenClasses]">
      <!-- Close button (same style/position as Drawer) -->
      <button
        class="absolute top-5 right-5 z-10 text-dark-5 hover:text-black cursor-pointer"
        @click="$emit('close')"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current"
        >
          <path
            d="M9.9 9.00001L16.7625 2.13751C17.0156 1.88439 17.0156 1.49064 16.7625 1.23751C16.5094 0.984387 16.1156 0.984387 15.8625 1.23751L9 8.10001L2.1375 1.23751C1.88437 0.984387 1.49062 0.984387 1.2375 1.23751C0.984372 1.49064 0.984372 1.88439 1.2375 2.13751L8.1 9.00001L1.2375 15.8625C0.984372 16.1156 0.984372 16.5094 1.2375 16.7625C1.35 16.875 1.51875 16.9594 1.6875 16.9594C1.85625 16.9594 2.025 16.9031 2.1375 16.7625L9 9.90001L15.8625 16.7625C15.975 16.875 16.1437 16.9594 16.3125 16.9594C16.4812 16.9594 16.65 16.9031 16.7625 16.7625C17.0156 16.5094 17.0156 16.1156 16.7625 15.8625L9.9 9.00001Z"
          />
        </svg>
      </button>

      <!-- Scrollable content area with bottom padding for footer height (h-16 = pb-16) -->
      <div class="h-full overflow-y-auto px-4 md:px-12 py-6 md:py-10 sm:px-8 sm:py-8 pb-16">
        <div v-if="props.title" class="mb-6">
          <Text h2>{{ props.title }}</Text>
        </div>
        <slot />
      </div>

      <!-- Sticky/absolute footer overlapping content -->
      <div
        class="absolute bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-dark-2/95 backdrop-blur flex items-center justify-end gap-3 px-6 sm:px-8"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

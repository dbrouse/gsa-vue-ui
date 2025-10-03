<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, nextTick, ref } from 'vue'
import Text from './Text.vue'
import { EpClose } from 'vue-icons-plus/ep'

type DrawerSide = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    side?: DrawerSide
    title?: string
    afterOpen?: () => void
  }>(),
  {
    visible: false,
    side: 'right',
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Keep a ref to the panel so we can wait for the open transition before focusing inputs (iOS Safari fix)
const panelRef = ref<HTMLDivElement | null>(null)

const sideClass = computed(() =>
  props.side === 'right' ? 'right-0 translate-x-0' : 'left-0 -translate-x-0'
)
const hiddenTranslateClass = computed(() =>
  props.side === 'right' ? 'translate-x-full' : '-translate-x-full'
)

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible) emit('close')
}

// Prevent horizontal overflow/jank when focusing inputs on iOS after opening
const lockScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.overflowY = 'hidden'
  document.body.style.overflowX = 'hidden'
  document.documentElement.style.overflowX = 'hidden'
}
const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.overflowY = ''
  document.body.style.overflowX = ''
  document.documentElement.style.overflowX = ''
}

watch(
  () => props.visible,
  (open) => {
    if (open) {
      lockScroll()
      // Wait for panel transition to complete before calling afterOpen (prevents iOS reflow/overflow)
      nextTick(() => {
        const el = panelRef.value
        if (!el) {
          props.afterOpen?.()
          return
        }
        const handler = () => {
          clearTimeout(timer)
          el.removeEventListener('transitionend', handler)
          props.afterOpen?.()
        }
        // Fallback in case transitionend doesn't fire
        const timer = setTimeout(handler, 350)
        el.addEventListener('transitionend', handler)
      })
    } else {
      unlockScroll()
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
    :class="props.visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'"
    @click="$emit('close')"
  />

  <!-- Panel -->
  <div
    ref="panelRef"
    class="fixed top-0 z-50 h-screen w-[85vw] md:w-full md:max-w-[400px] bg-white dark:bg-dark-2 py-6 px-5 sm:px-9 shadow-xl transition-transform duration-300 will-change-transform"
    :class="[
      props.visible ? sideClass : hiddenTranslateClass,
      props.side === 'right' ? 'right-0' : 'left-0',
    ]"
  >
    <button
      class="absolute top-5 right-5 z-10 text-dark-5 hover:text-black dark:hover:text-white cursor-pointer"
      @click="$emit('close')"
    >
      <EpClose />
    </button>

    <div>
      <div v-if="props.title" class="mb-4 flex justify-between">
        <Text h3>{{ props.title }}</Text>
      </div>
      <div class="space-y-[30px] pb-5">
        <slot />
      </div>
    </div>

    <div class="pt-5">
      <slot name="footer" />
    </div>
  </div>
</template>

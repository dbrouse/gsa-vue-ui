<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BiSolidMoon } from 'vue-icons-plus/bi'

const props = withDefaults(defineProps<{ showLabel?: boolean }>(), { showLabel: false })

const isDark = ref(false)

const apply = () => {
  const root = document.documentElement
  if (isDark.value) root.classList.add('dark')
  else root.classList.remove('dark')
}

const detectOSPref = () => window.matchMedia('(prefers-color-scheme: dark)').matches

const loadInitial = () => {
  const stored = localStorage.getItem('theme:dark')
  if (stored === 'true' || stored === 'false') {
    isDark.value = stored === 'true'
  } else {
    isDark.value = detectOSPref()
  }
  apply()
}

const toggle = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme:dark', String(isDark.value))
  apply()
}

let mq: MediaQueryList | null = null
const handleOSChange = (e: MediaQueryListEvent) => {
  isDark.value = e.matches
  apply()
}

onMounted(() => {
  loadInitial()
  mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', handleOSChange)
})

onUnmounted(() => {
  mq?.removeEventListener('change', handleOSChange)
})
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 py-2 rounded cursor-pointer dark:text-white"
    @click="toggle"
  >
    <BiSolidMoon class="opacity-50 dark:opacity-100" />
    <span v-if="props.showLabel" class="text-sm">Dark mode</span>
  </button>
</template>

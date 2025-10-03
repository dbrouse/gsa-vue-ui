<script setup lang="ts">
import Button from './Button.vue'
import Dropdown from './Dropdown.vue'
import { Io5Menu } from 'vue-icons-plus/io5'
import { ref, onMounted, onUnmounted } from 'vue'

type ButtonKind = 'primary' | 'default' | 'danger' | 'warning' | 'success'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    buttons: { label: string; onClick?: () => void; type?: ButtonKind; size?: ButtonSize }[]
    className?: string
    collapseBelowPx?: number // breakpoint at which to collapse into dropdown
  }>(),
  {
    collapseBelowPx: 1300,
    className: '',
  }
)

const isWide = ref(true)
const onResize = () => {
  if (typeof window === 'undefined') return
  isWide.value = window.innerWidth >= (props.collapseBelowPx ?? 1300)
}
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <!-- Visible buttons on wide screens -->
  <div v-if="isWide" :class="['flex items-center gap-2', props.className]">
    <Button
      v-for="(b, i) in props.buttons"
      :key="i"
      :label="b.label"
      :type="b.type ?? 'default'"
      :size="b.size ?? 'md'"
      @click="b.onClick?.()"
    />
  </div>

  <!-- Collapsed dropdown on narrow screens -->
  <div v-else class="inline-flex">
    <Dropdown :items="props.buttons.map((b) => ({ text: b.label, onClick: () => b.onClick?.() }))">
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-stroke text-dark hover:bg-gray-100 dark:text-white"
      >
        <Io5Menu size="18" />
      </button>
    </Dropdown>
  </div>
</template>

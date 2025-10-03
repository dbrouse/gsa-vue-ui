<script setup lang="ts">
import { computed } from 'vue'

type Option = string | { label: string; value: string | number }

const props = withDefaults(
  defineProps<{
    options: Option[]
    modelValue?: string | number
    className?: string
    disabled?: boolean
  }>(),
  {
    options: () => [],
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const normalized = computed<{ label: string; value: string | number }[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const isActive = (val: string | number) => props.modelValue === val

const onSelect = (val: string | number) => {
  if (props.disabled) return
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div class="inline-flex items-center" :class="props.className">
    <button
      v-for="(opt, idx) in normalized"
      :key="String(opt.value)"
      type="button"
      class="px-4 py-2.5 text-sm font-medium transition outline-none border border-gray-7 dark:border-gray-500 cursor-pointer"
      :class="[
        // shape
        idx === 0 ? 'rounded-l-lg' : '-ml-px',
        idx === normalized.length - 1 ? 'rounded-r-lg' : '',
        // state
        props.disabled ? 'opacity-60 cursor-not-allowed' : '',
        isActive(opt.value)
          ? 'bg-primary text-white border-primary hover:brightness-90 dark:border-primary'
          : 'text-dark dark:text-white border-stroke hover:bg-gray-2 hover:text-primary',
      ]"
      @click="onSelect(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

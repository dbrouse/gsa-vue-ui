<script setup lang="ts">
import { computed } from 'vue'
import { BiChevronDown } from 'vue-icons-plus/bi'

type Option = string | { label: string; value: string | number; disabled?: boolean }

const props = withDefaults(
  defineProps<{
    options: Option[]
    modelValue?: string | number
    placeholder?: string
    name?: string
    disabled?: boolean
    className?: string
    onChange?: (value: string | number, ev: Event) => void
  }>(),
  {
    options: () => [],
    disabled: false,
    placeholder: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, ev: Event): void
}>()

const normalized = computed<{ label: string; value: string | number; disabled?: boolean }[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const isPlaceholder = computed(
  () => props.modelValue === undefined || props.modelValue === null || props.modelValue === ''
)

const classes = computed(() =>
  [
    'w-full',
    'appearance-none',
    'rounded-md',
    'border',
    'bg-transparent',
    'py-[13px]',
    'pl-4',
    'pr-12',
    'text-sm',
    'font-normal',
    isPlaceholder.value ? 'text-dark/50 dark:text-white/50' : 'text-dark dark:text-white',
    'placeholder:text-dark-6',
    'outline-none',
    'transition',
    props.disabled ? 'cursor-not-allowed opacity-60' : '',
    // neutral borders identical to Input.vue
    'border-gray-7 focus:border-black active:border-black dark:border-gray-600 dark:focus:border-gray-300',
    props.className ?? '',
  ].join(' ')
)

const handleChange = (ev: Event) => {
  const t = ev.target as HTMLSelectElement
  const value = t.value
  emit('update:modelValue', value)
  emit('change', value, ev)
  props.onChange?.(value, ev)
}
</script>

<template>
  <div class="relative inline-block w-full">
    <select
      :name="name"
      :value="(props.modelValue ?? '') as any"
      :disabled="props.disabled"
      :class="classes"
      @change="handleChange"
    >
      <option v-if="props.placeholder" value="" disabled selected hidden>
        {{ props.placeholder }}
      </option>
      <option
        v-for="opt in normalized"
        :key="String(opt.value)"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>
    <span
      class="pointer-events-none absolute right-0 top-0 flex h-full w-12 items-center justify-center text-dark-5 dark:text-gray-500 opacity-80"
      :class="props.disabled ? 'opacity-50' : ''"
    >
      <BiChevronDown size="19" />
    </span>
  </div>
</template>

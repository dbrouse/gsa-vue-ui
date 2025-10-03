<script setup lang="ts">
import { computed, useSlots } from 'vue'

type ButtonType = 'primary' | 'default' | 'light' | 'danger' | 'warning' | 'success'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    label: string
    type?: ButtonType
    size?: ButtonSize
    className?: string
    onClick?: (event: globalThis.MouseEvent) => void
    primary?: boolean
    default?: boolean
    light?: boolean
    danger?: boolean
    warning?: boolean
    success?: boolean
  }>(),
  {
    type: 'default',
    size: 'md',
  }
)

const baseClasses =
  'border inline-flex items-center justify-center text-center font-medium disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'

const variantClasses: Record<ButtonType, string> = {
  primary:
    'bg-dark border-dark text-white dark:border-white dark:hover:bg-gray-200 dark:bg-white dark:text-dark hover:bg-dark-3',
  default:
    'border-gray-400 dark:border-dark-2 text-dark dark:text-white hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700',
  light:
    'border-gray-300 dark:border-dark-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700',
  success: 'bg-green-600 border-green-600 text-white hover:brightness-115',
  danger: 'bg-red-600 border-red-600 text-white hover:brightness-115',
  warning: 'bg-yellow-500 border-yellow-500 text-white hover:brightness-115',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-[11px] py-0.75 px-2 rounded-sm',
  sm: 'text-xs py-1.5 px-3 rounded-md',
  md: 'text-sm py-2 px-5 rounded-md',
  lg: 'text-lg py-2.5 px-8 rounded-lg',
  xl: 'text-xl py-4 px-9 rounded-[10px]',
}

const resolvedType = computed<ButtonType>(() => {
  if (props.default) return 'default'
  if (props.light) return 'light'
  if (props.danger) return 'danger'
  if (props.warning) return 'warning'
  if (props.success) return 'success'
  if (props.primary) return 'primary'
  return props.type ?? 'primary'
})

const buttonClasses = computed(
  () =>
    `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[resolvedType.value]} ${props.className ?? ''}`
)

const slots = useSlots()

const prefixPaddingBySize: Record<ButtonSize, string> = {
  xs: 'pl-2',
  sm: 'pl-2',
  md: 'pl-3',
  lg: 'pl-4',
  xl: 'pl-6',
}

const suffixPaddingBySize: Record<ButtonSize, string> = {
  xs: 'pr-2',
  sm: 'pr-2',
  md: 'pr-3',
  lg: 'pr-4',
  xl: 'pr-6',
}

const slotPaddingClasses = computed(() => {
  const left = slots.prefix ? prefixPaddingBySize[props.size] : ''
  const right = slots.suffix ? suffixPaddingBySize[props.size] : ''
  return `${left} ${right}`.trim()
})
</script>

<template>
  <button
    type="button"
    :class="[buttonClasses, slotPaddingClasses]"
    @click="props.onClick?.($event)"
  >
    <span v-if="$slots.prefix" class="mr-2 inline-flex items-center">
      <slot name="prefix" />
    </span>
    <span>{{ props.label }}</span>
    <span v-if="$slots.suffix" class="ml-2 inline-flex items-center">
      <slot name="suffix" />
    </span>
  </button>
</template>

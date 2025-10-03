<script setup lang="ts">
import { computed } from 'vue'
import { Fa6Check } from 'vue-icons-plus/fa6'

const props = withDefaults(
  defineProps<{
    label?: string
    modelValue?: boolean
    checked?: boolean
    id?: string
    name?: string
    disabled?: boolean
    className?: string
    onChange?: (checked: boolean, ev: Event) => void
  }>(),
  {
    label: 'Checkbox',
    modelValue: undefined,
    checked: undefined,
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:checked', value: boolean): void
  (e: 'change', value: boolean, ev: Event): void
}>()

const generatedId = `cb_${Math.random().toString(36).slice(2, 9)}`
const inputId = computed(() => props.id || generatedId)

const isControlled = computed(() => props.modelValue !== undefined || props.checked !== undefined)

const isChecked = computed<boolean>({
  get() {
    if (props.modelValue !== undefined) return !!props.modelValue
    if (props.checked !== undefined) return !!props.checked
    return false
  },
  set(val: boolean) {
    emit('update:modelValue', val)
    emit('update:checked', val)
  },
})

const handleChange = (ev: Event) => {
  const target = ev.target as HTMLInputElement
  const val = target.checked
  if (!isControlled.value) {
    // Prevent uncontrolled toggling
    target.checked = isChecked.value
    ev.preventDefault()
    return
  }
  isChecked.value = val
  emit('change', val, ev)
  props.onChange?.(val, ev)
}

const handleClick = (ev: MouseEvent) => {
  if (!isControlled.value) {
    ev.preventDefault()
    ev.stopPropagation()
  }
}

const handleKeydown = (ev: KeyboardEvent) => {
  if (!isControlled.value && (ev.key === ' ' || ev.key === 'Spacebar' || ev.key === 'Enter')) {
    ev.preventDefault()
    ev.stopPropagation()
  }
}
</script>

<template>
  <label
    :for="inputId"
    class="flex items-center cursor-pointer select-none text-dark dark:text-white group"
    :class="props.className"
  >
    <div class="relative">
      <input
        :id="inputId"
        type="checkbox"
        class="sr-only"
        :name="props.name"
        :checked="isChecked"
        :disabled="props.disabled"
        @change="handleChange"
        @click="handleClick"
        @keydown="handleKeydown"
      />
      <div
        class="flex items-center justify-center w-5 h-5 mr-3 border rounded-[5px] transition dark:border-gray-500"
        :class="[
          props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          isChecked
            ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black'
            : 'bg-transparent border-gray-7 dark:border-dark-3',
        ]"
      >
        <span class="opacity-0 group-has-checked:opacity-100 transition-opacity">
          <Fa6Check size="12" />
        </span>
      </div>
    </div>
    <span class="text-[13px]">{{ props.label }}</span>
  </label>
</template>

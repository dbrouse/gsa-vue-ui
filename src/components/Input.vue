<script setup lang="ts">
import { computed, ref, defineExpose } from 'vue'
import { BiSearch } from 'vue-icons-plus/bi'

type InputType = 'text' | 'email' | 'date' | 'number' | 'password' | 'search'

const props = withDefaults(
  defineProps<{
    type?: InputType
    value?: string | number
    placeholder?: string
    solid?: boolean
    darkLighter?: boolean
    error?: boolean
    success?: boolean
    className?: string
    onChange?: (e: globalThis.Event) => void
  }>(),
  {
    type: 'text',
    placeholder: '',
    darkLighter: false,
    value: undefined,
    className: '',
    onChange: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:value', value: string | number | undefined): void
  (e: 'change', ev: globalThis.Event): void
}>()

const classes = computed(() => {
  const classList: string[] = [
    'w-full',
    'rounded-md',
    'py-[13px]',
    'px-5',
    'text-sm',
    'font-normal',
    'text-dark',
    'placeholder:text-dark-6',
    'outline-none',
    'transition',
    'disabled:cursor-default',
    'disabled:bg-gray-2',
    'disabled:border-gray-2',
    'border',
    'dark:text-white',
  ]

  // Background style
  if (props.solid) {
    classList.push('bg-gray-2', 'focus:bg-gray-2.5')
    if (props.darkLighter) {
      classList.push('dark:bg-dark-2', 'focus:dark:bg-dark-3', 'focus:dark:border-dark-3')
    } else {
      classList.push('dark:bg-dark', 'focus:dark:bg-dark-darker', 'focus:dark:border-dark-darker')
    }
  } else {
    classList.push('bg-transparent')
  }

  // Border color logic: avoid conflicting base border colors
  if (props.error) {
    classList.push('border-red-600', 'focus:border-red-700', 'dark:focus:border-red-400')
  } else if (props.success) {
    classList.push('border-green-600', 'focus:border-green-700', 'dark:focus:border-green-400')
  } else {
    // Neutral state border color
    if (props.solid) {
      classList.push('border-gray-2', 'focus:border-gray-2.5')
      if (props.darkLighter) {
        classList.push('dark:border-dark-2', 'focus:dark:border-dark-3')
      } else {
        classList.push('dark:border-dark', 'focus:dark:border-dark-darker')
      }
    } else {
      classList.push(
        'border-gray-7',
        'dark:border-gray-600',
        'focus:border-black',
        'active:border-black',
        'dark:focus:border-gray-300',
        'dark:active:border-white'
      )
    }
  }

  if (props.className) classList.push(props.className)
  return classList.join(' ')
})

const searchWrapperClasses = computed(() => {
  const classList: string[] = [
    'w-full',
    'rounded-md',
    'border',
    'transition',
    'flex',
    'items-center',
  ]

  // Background style for wrapper
  if (props.solid) {
    classList.push('bg-gray-2')
    if (props.darkLighter) {
      classList.push('dark:bg-dark-2')
    } else {
      classList.push('dark:bg-dark')
    }
  } else {
    classList.push('bg-transparent')
  }

  // Border color logic for wrapper
  if (props.error) {
    classList.push('border-red-600')
  } else if (props.success) {
    classList.push('border-green-600')
  } else {
    if (props.solid) {
      classList.push('border-gray-2')
      if (props.darkLighter) {
        classList.push('dark:border-dark-2')
      } else {
        classList.push('dark:border-dark')
      }
    } else {
      classList.push('border-gray-7', 'dark:border-gray-600')
    }
  }

  if (props.className) classList.push(props.className)
  return classList.join(' ')
})

const onInput = (e: globalThis.Event) => {
  const target = e.target as globalThis.HTMLInputElement
  let newValue: string | number | undefined = target.value
  if (props.type === 'number') {
    newValue = target.value === '' ? undefined : Number(target.value)
  }
  emit('update:value', newValue)
}

const onChangeInternal = (e: globalThis.Event) => {
  emit('change', e)
  props.onChange?.(e)
}

const inputRef = ref<globalThis.HTMLInputElement | null>(null)

// Apply focus styles to the imposter wrapper for search inputs
const addSearchFocusStyles = () => {
  const wrap = inputRef.value?.parentElement
  if (!wrap) return

  if (props.solid) {
    if (props.darkLighter) {
      wrap.classList.add('bg-gray-2.5', 'border-gray-2.5', 'dark:bg-dark-3', 'dark:border-dark-3')
    } else {
      wrap.classList.add(
        'bg-gray-2.5',
        'border-gray-2.5',
        'dark:bg-dark-darker',
        'dark:border-dark-darker'
      )
    }
  } else {
    wrap.classList.add('border-black', 'dark:ring-gray-300')
  }
}

const removeSearchFocusStyles = () => {
  const wrap = inputRef.value?.parentElement
  if (!wrap) return
  wrap.classList.remove('border-black', 'dark:ring-gray-300')
  if (props.solid) {
    wrap.classList.remove('bg-gray-2.5', 'border-gray-2.5')
    if (props.darkLighter) {
      wrap.classList.remove('dark:bg-dark-3', 'dark:border-dark-3')
    } else {
      wrap.classList.remove('dark:bg-dark-darker', 'dark:border-dark-darker')
    }
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <!-- Search mode: use an imposter wrapper with icon + naked input -->
  <div v-if="props.type === 'search'" class="relative">
    <div :class="searchWrapperClasses" class="peer">
      <span class="pl-4 pr-2 text-dark-5 flex items-center">
        <BiSearch size="18" />
      </span>
      <input
        ref="inputRef"
        type="search"
        :value="props.value as any"
        :placeholder="props.placeholder"
        class="flex-1 bg-transparent outline-none text-sm font-normal text-dark dark:text-white py-[13px] pr-4"
        @focus="addSearchFocusStyles()"
        @blur="removeSearchFocusStyles()"
        @input="onInput"
        @change="onChangeInternal"
      />
    </div>
  </div>

  <!-- Default input -->
  <input
    v-else
    ref="inputRef"
    :type="props.type"
    :value="props.value as any"
    :placeholder="props.placeholder"
    :class="classes"
    @input="onInput"
    @change="onChangeInternal"
  />
</template>

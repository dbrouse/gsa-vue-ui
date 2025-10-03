<template>
  <div ref="wrapperRef" class="relative inline-block w-full mb-3">
    <input
      id="datepicker"
      ref="inputRef"
      type="text"
      :placeholder="props.placeholder"
      :class="inputClasses"
      :value="displayValue"
      readonly
      @focus="openDatepicker"
      @blur="onBlur"
      @click="openDatepicker"
    />
    <span
      class="absolute inset-y-0 right-0 flex h-12 w-12 items-center justify-center text-dark-5 cursor-pointer"
      @mousedown.prevent="focusInput"
      @click.stop
    >
      <LuCalendarDays />
    </span>

    <div
      v-show="isOpen"
      id="datepicker-container"
      class="shadow-soft absolute left-0 z-40 mt-2 w-[340px] flex flex-col rounded-lg border border-stroke bg-white px-4 py-6 sm:px-6 sm:py-[30px] dark:border-dark-3 dark:bg-dark transition-all duration-200"
      :class="
        isOpen
          ? 'top-full opacity-100 visible'
          : 'top-[110%] invisible opacity-0 pointer-events-none'
      "
      @mousedown.prevent
      @click.stop
    >
      <div class="flex items-center justify-between pb-2">
        <p id="currentMonth" class="text-base font-medium text-dark dark:text-white">
          {{ currentMonth }}
        </p>
        <div class="flex items-center justify-end space-x-[10px]">
          <span
            id="prevMonth"
            class="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:bg-dark dark:text-white"
            @click="changeMonth(-1)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current"
            >
              <path
                d="M10.825 14.325C10.675 14.325 10.525 14.275 10.425 14.15L4.77501 8.40002C4.55001 8.17502 4.55001 7.82502 4.77501 7.60002L10.425 1.85002C10.65 1.62502 11 1.62502 11.225 1.85002C11.45 2.07502 11.45 2.42502 11.225 2.65002L5.97501 8.00003L11.25 13.35C11.475 13.575 11.475 13.925 11.25 14.15C11.1 14.25 10.975 14.325 10.825 14.325Z"
              />
            </svg>
          </span>
          <span
            id="nextMonth"
            class="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:bg-dark dark:text-white"
            @click="changeMonth(1)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current"
            >
              <path
                d="M5.17501 14.325C5.02501 14.325 4.90001 14.275 4.77501 14.175C4.55001 13.95 4.55001 13.6 4.77501 13.375L10.025 8.00003L4.77501 2.65002C4.55001 2.42502 4.55001 2.07502 4.77501 1.85002C5.00001 1.62502 5.35001 1.62502 5.57501 1.85002L11.225 7.60002C11.45 7.82502 11.45 8.17502 11.225 8.40002L5.57501 14.15C5.47501 14.25 5.32501 14.325 5.17501 14.325Z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-7 text-sm font-normal capitalize text-body-color dark:text-dark-6">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="mb-2 mt-4 flex h-[38px] w-[38px] items-center justify-center"
        >
          {{ day }}
        </div>

        <div
          v-for="(day, index) in renderCalendar()"
          :key="index"
          :class="day.className"
          :data-date="day.dayString"
          @click="handleDayClick(day.dayString)"
        >
          {{ day.day }}
        </div>
      </div>

      <div v-if="props.range" class="flex items-center space-x-3 pt-3 sm:space-x-4">
        <button
          class="h-[32px] flex-1 rounded border border-stroke bg-transparent px-4 text-xs font-medium text-body-color hover:border-primary focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-gray-600"
        >
          {{ selectedStartDate || 'Select Start Date' }}
        </button>
        <button
          class="h-[32px] flex-1 rounded border border-stroke bg-transparent px-4 text-xs font-medium text-body-color hover:border-primary focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-gray-600"
        >
          {{ selectedEndDate || 'Select End Date' }}
        </button>
      </div>
      <div class="pt-3 flex justify-center">
        <button
          type="button"
          class="h-[32px] w-full rounded border border-stroke bg-transparent px-4 text-xs font-medium text-body-color hover:border-primary focus:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-gray-600 cursor-pointer"
          @click="clearSelection"
        >
          {{ props.range ? 'Clear Dates' : 'Clear Date' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { LuCalendarDays } from 'vue-icons-plus/lu'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    value?: string // single date (DD/MM/YYYY)
    valueStartDate?: string // range start (DD/MM/YYYY)
    valueEndDate?: string // range end (DD/MM/YYYY)
    solid?: boolean
    error?: boolean
    success?: boolean
    onChange?: (e: any) => void
    range?: boolean
  }>(),
  {
    placeholder: 'Pick a date',
    range: false,
  }
)

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'update:valueStartDate', value: string | null): void
  (e: 'update:valueEndDate', value: string | null): void
  (e: 'change', value: any): void
}>()

const currentDate = ref<Date>(new Date())
// Range mode state
const selectedStartDate = ref<string | null>(null)
const selectedEndDate = ref<string | null>(null)
// Single mode state
const selectedDate = ref<string | null>(null)
const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (d: Date): string =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
const parseDMY = (s: string | null): Date | null => {
  if (!s) return null
  const [dd, mm, yyyy] = s.split('/')
  const day = Number(dd),
    month = Number(mm),
    year = Number(yyyy)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

const renderCalendar = () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysArray = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ day: '', className: '', dayString: '' })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(year, month, i)
    const dayString = formatDate(day)
    let className =
      'text-sm font-medium text-dark dark:text-white flex h-[46px] w-[46px] items-center justify-center rounded-full mb-2'

    if (props.range) {
      if (selectedStartDate.value && dayString === selectedStartDate.value) {
        className += ' bg-primary text-white dark:text-white rounded-r-none hover:brightness-90'
      }
      if (selectedEndDate.value && dayString === selectedEndDate.value) {
        className += ' bg-primary text-white dark:text-white rounded-l-none hover:brightness-90'
      }
      const startObj = parseDMY(selectedStartDate.value)
      const endObj = parseDMY(selectedEndDate.value)
      if (startObj && endObj && day > startObj && day < endObj) {
        className += ' bg-dark-3 text-white rounded-none hover:bg-dark'
      }
      if (!selectedStartDate.value && !selectedEndDate.value) {
        className += ' hover:bg-gray-2 dark:hover:bg-dark-2'
      } else {
        // If this day is not part of selection range nor endpoints, keep default hover
        if (
          !(startObj && endObj && day > startObj && day < endObj) &&
          !(selectedStartDate.value === dayString || selectedEndDate.value === dayString)
        ) {
          className += ' hover:bg-gray-2 dark:hover:bg-dark-2'
        }
      }
    } else {
      if (selectedDate.value && dayString === selectedDate.value) {
        className += ' bg-primary text-white hover:brightness-90'
      } else {
        className += ' hover:bg-gray-2 dark:hover:bg-dark-2'
      }
    }

    daysArray.push({ day: i, className, dayString })
  }

  return daysArray
}

const handleDayClick = (selectedDay: string) => {
  if (props.range) {
    if (!selectedStartDate.value || (selectedStartDate.value && selectedEndDate.value)) {
      selectedStartDate.value = selectedDay
      selectedEndDate.value = null
    } else {
      const startObj = parseDMY(selectedStartDate.value)
      const currObj = parseDMY(selectedDay)
      if (startObj && currObj && currObj < startObj) {
        selectedEndDate.value = selectedStartDate.value
        selectedStartDate.value = selectedDay
      } else {
        selectedEndDate.value = selectedDay
      }
    }
    const v = { startDate: selectedStartDate.value, endDate: selectedEndDate.value }
    emit('update:valueStartDate', selectedStartDate.value)
    emit('update:valueEndDate', selectedEndDate.value)
    emit('change', v)
    props.onChange?.(v)
  } else {
    selectedDate.value = selectedDay
    const v = selectedDay
    emit('update:value', v)
    emit('change', v)
    props.onChange?.(v)
    isOpen.value = false
  }
}

const updateInput = () => {
  if (selectedStartDate.value && selectedEndDate.value) {
    return `${selectedStartDate.value}-${selectedEndDate.value}`
  } else if (selectedStartDate.value) {
    return selectedStartDate.value
  } else {
    return ''
  }
}

const openDatepicker = () => {
  // Always open on the month of the current value/selection
  if (props.range) {
    const target =
      parseDMY(props.valueStartDate ?? selectedStartDate.value) ||
      parseDMY(props.valueEndDate ?? selectedEndDate.value)
    currentDate.value = target ?? new Date()
  } else {
    const target = parseDMY(props.value ?? selectedDate.value)
    currentDate.value = target ?? new Date()
  }
  isOpen.value = true
}
const closeDatepicker = () => {
  isOpen.value = false
}

const onBlur = (e: FocusEvent) => {
  // Delay to allow click on calendar
  setTimeout(() => {
    const target = e.relatedTarget as Node | null
    if (!wrapperRef.value) return
    if (!wrapperRef.value.contains(document.activeElement) && !wrapperRef.value.contains(target)) {
      closeDatepicker()
    }
  }, 0)
}

const currentMonth = computed(() =>
  currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
)

const changeMonth = (direction: number) => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + direction))
}

onMounted(() => {
  // Initialize internal state from external props
  if (props.range) {
    selectedStartDate.value = props.valueStartDate ?? null
    selectedEndDate.value = props.valueEndDate ?? null
    const initial = parseDMY(props.valueStartDate ?? props.valueEndDate ?? null)
    if (initial) currentDate.value = initial
  } else {
    if (props.value) {
      selectedDate.value = props.value
      const initial = parseDMY(props.value)
      if (initial) currentDate.value = initial
    }
  }
})

// Keep internal selection in sync when external props change
watch(
  () => props.value,
  (newVal) => {
    if (!props.range) {
      selectedDate.value = newVal ?? null
      const d = parseDMY(newVal ?? null)
      if (d) currentDate.value = d
    }
  }
)

watch([() => props.valueStartDate, () => props.valueEndDate], ([start, end]) => {
  if (props.range) {
    selectedStartDate.value = start ?? null
    selectedEndDate.value = end ?? null
    const d = parseDMY(start ?? end ?? null)
    if (d) currentDate.value = d
  }
})

const focusInput = () => {
  inputRef.value?.focus()
}

// Display value prefers external value if provided
const displayValue = computed(() => {
  if (props.range) {
    // Prefer explicit start/end props if provided
    if (props.valueStartDate || props.valueEndDate) {
      return [props.valueStartDate ?? '', props.valueEndDate ?? ''].filter(Boolean).join('-')
    }
    return updateInput()
  } else {
    return props.value ?? selectedDate.value ?? ''
  }
})

// Shared input styling to match Input.vue
const inputClasses = computed(() => {
  const classList: string[] = [
    'h-12',
    'w-full',
    'appearance-none',
    'pl-4',
    'pr-12',
    'rounded-md',
    'text-sm',
    'font-normal',
    'text-dark',
    'placeholder:text-dark-6',
    'outline-none',
    'transition',
    'border',
    'dark:text-white',
  ]

  if (props.solid) {
    classList.push('bg-gray-2', 'focus:bg-gray-3', 'dark:bg-dark-3', 'dark:focus:bg-dark-4')
  } else {
    classList.push('bg-transparent')
  }

  if (props.error) {
    classList.push('border-red-600', 'focus:border-red-700')
  } else if (props.success) {
    classList.push('border-green-600', 'focus:border-green-700')
  } else {
    classList.push(
      props.solid
        ? 'border-gray-2 dark:border-dark-2 focus:border-gray-3 dark:focus:border-dark-4'
        : 'border-gray-7 focus:border-black active:border-black dark:border-gray-600 focus:dark:border-gray-300'
    )
  }

  return classList.join(' ')
})

const clearSelection = () => {
  if (props.range) {
    selectedStartDate.value = null
    selectedEndDate.value = null
    emit('update:valueStartDate', null)
    emit('update:valueEndDate', null)
    const v = { startDate: null, endDate: null }
    emit('change', v)
    props.onChange?.(v)
  } else {
    selectedDate.value = null
    emit('update:value', '')
    emit('change', '')
    props.onChange?.('')
  }
}
</script>

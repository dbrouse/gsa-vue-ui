<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { BsChevronLeft, BsChevronRight } from 'vue-icons-plus/bs'

const props = withDefaults(
  defineProps<{
    // Controlled page (1-based). Supports v-model:currentPage
    currentPage?: number
    // Total number of pages. If omitted, will be computed from totalItems/pageSize
    totalPages?: number
    // Optional item-based inputs to compute totalPages when totalPages not provided
    totalItems?: number
    pageSize?: number
    // Max visible numbered buttons (excludes first/last arrows)
    maxVisible?: number
    className?: string
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    currentPage: 1,
    totalPages: undefined,
    totalItems: 0,
    pageSize: 10,
    maxVisible: 5,
    className: '',
    align: 'right',
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'change', page: number): void
}>()

const internal = ref<number>(props.currentPage)
watch(
  () => props.currentPage,
  (val) => {
    if (typeof val === 'number' && val !== internal.value) internal.value = val
  }
)

const totalPages = computed(() => {
  if (props.totalPages && props.totalPages > 0) return props.totalPages
  const items = Math.max(0, props.totalItems || 0)
  const size = Math.max(1, props.pageSize || 1)
  return Math.max(1, Math.ceil(items / size))
})

const clamp = (p: number) => Math.min(totalPages.value, Math.max(1, p))
const setPage = (p: number) => {
  const next = clamp(p)
  if (next === internal.value) return
  internal.value = next
  emit('update:currentPage', next)
  emit('change', next)
}
const navigate = (delta: number) => setPage(internal.value + delta)

const visiblePages = ref<number[]>([])
watchEffect(() => {
  const max = Math.max(1, props.maxVisible || 5)
  const start = Math.max(1, internal.value - Math.floor(max / 2))
  const end = Math.min(totalPages.value, start + max - 1)
  const startAdjusted = Math.max(1, end - max + 1)
  const pages: number[] = []
  for (let i = startAdjusted; i <= end; i++) pages.push(i)
  visiblePages.value = pages
})

const showJumpToLast = computed(() => totalPages.value > (props.maxVisible || 5))
const showEllipsis = computed(() => {
  const max = Math.max(1, props.maxVisible || 5)
  return totalPages.value > max && internal.value <= totalPages.value - max + 2
})

const isFirstPage = computed(() => internal.value <= 1)
const isLastPage = computed(() => internal.value >= totalPages.value)

const alignClass = computed(() =>
  props.align === 'left'
    ? 'justify-start'
    : props.align === 'right'
      ? 'justify-end'
      : 'justify-center'
)
</script>

<template>
  <div :class="['flex items-center', alignClass, props.className]">
    <ul class="inline-flex overflow-hidden rounded-lg border border-stroke dark:border-white/5">
      <!-- Prev -->
      <li>
        <button
          type="button"
          :disabled="isFirstPage"
          class="flex h-10 min-w-10 items-center justify-center border-r border-stroke px-2 text-base font-medium text-dark hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          @click="navigate(-1)"
        >
          <BsChevronLeft size="14" />
        </button>
      </li>

      <!-- Numbered pages -->
      <li v-for="page in visiblePages" :key="page">
        <button
          type="button"
          :class="[
            'flex h-10 min-w-10 items-center justify-center border-r border-stroke px-2 text-base font-medium transition-colors dark:border-white/10',
            page === internal
              ? 'bg-primary text-white hover:brightness-110'
              : 'text-dark/80 dark:text-white/80 hover:bg-gray-2 dark:hover:bg-white/5',
          ]"
          @click="setPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <!-- Ellipsis & last page -->
      <li v-if="showEllipsis">
        <span
          class="flex h-10 min-w-10 items-center justify-center border-r border-stroke px-2 text-base text-dark dark:text-white dark:border-white/10"
          >…</span
        >
      </li>
      <li v-if="showJumpToLast">
        <button
          type="button"
          class="flex h-10 min-w-10 items-center justify-center border-r border-stroke px-2 text-base font-medium text-dark hover:bg-gray-2 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          @click="setPage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </li>

      <!-- Next -->
      <li>
        <button
          type="button"
          :disabled="isLastPage"
          class="flex h-10 min-w-10 items-center justify-center px-2 text-base font-medium text-dark hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          @click="navigate(1)"
        >
          <BsChevronRight size="14" />
        </button>
      </li>
    </ul>
  </div>
</template>

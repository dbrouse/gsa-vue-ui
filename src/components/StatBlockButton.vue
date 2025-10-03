<script setup lang="ts">
import { BiChevronRight } from 'vue-icons-plus/bi'

const props = withDefaults(
  defineProps<{
    stat: string
    title: string
    subTitle?: string | string[]
    onClick?: (event: MouseEvent) => void
    featured?: boolean
  }>(),
  {}
)

const handleClick = (e: MouseEvent) => props.onClick?.(e)
</script>

<template>
  <button
    type="button"
    :class="[
      'flex flex-col text-left rounded-lg border-1 cursor-pointer hover:shadow-soft/4 ',
      props.featured
        ? 'bg-faint-blue border-[#DFEDF0] dark:bg-[#0E3954] dark:border-[#124769] dark:hover:bg-[#124769] dark:hover:border-[#145278]'
        : 'bg-faint dark:bg-dark-2 dark:hover:bg-dark-3 border-gray-200/70 dark:border-dark-3 hover:border-gray-300/70 dark:hover:border-dark-3',
    ]"
    @click="handleClick"
  >
    <div class="py-5 px-7 grow-1">
      <div class="text-4xl text-black font-medium mb-2 dark:text-white">{{ props.stat }}</div>
      <div class="text-base text-black font-medium mb-3 dark:text-white">{{ props.title }}</div>
      <template v-if="Array.isArray(props.subTitle)">
        <div
          v-for="(line, i) in props.subTitle"
          :key="i"
          class="text-xs opacity-50 mb-1 dark:text-white"
        >
          {{ line }}
        </div>
      </template>
      <template v-else>
        <div v-if="props.subTitle" class="text-xs opacity-50 mb-1 dark:text-white">
          {{ props.subTitle }}
        </div>
      </template>
    </div>
    <div
      class="px-7 py-3.5 border-t-1 border-t-gray-200 text-primary text-sm flex items-center justify-between dark:border-t-gray-700"
    >
      Show List
      <BiChevronRight />
    </div>
  </button>
</template>

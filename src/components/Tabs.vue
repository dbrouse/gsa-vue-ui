<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { FaChevronDown } from 'vue-icons-plus/fa'

interface TabsItem {
  title: string
  name: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    items: TabsItem[]
    activeTab?: number
    className?: string
  }>(),
  {
    activeTab: 0,
  }
)

const emit = defineEmits<{
  (e: 'update:activeTab', value: number): void
  (e: 'change', value: number): void
}>()

// Controlled/uncontrolled support: keep local state in sync with prop
const internalActive = ref<number>(props.activeTab ?? 0)

watch(
  () => props.activeTab,
  (val) => {
    if (typeof val === 'number' && val !== internalActive.value) internalActive.value = val
  }
)

const currentIndex = computed({
  get: () => internalActive.value,
  set: (val: number) => {
    internalActive.value = val
    emit('update:activeTab', val)
    emit('change', val)
  },
})

const activeName = computed(() => props.items[currentIndex.value]?.name ?? '')
provide('tabsActiveName', activeName)

const selectTab = (index: number) => {
  if (index < 0 || index >= props.items.length) return
  currentIndex.value = index
}

const isCollapsedOpen = ref(false)
const activeTitle = computed(() => props.items[currentIndex.value]?.title ?? '')

const onMobileSelect = (index: number) => {
  selectTab(index)
  isCollapsedOpen.value = false
}
</script>

<template>
  <div>
    <!-- Collapsed (mobile) header -->
    <div class="md:hidden border-b-3 border-gray-100 dark:border-dark-2">
      <button
        type="button"
        class="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-black dark:text-white"
        @click="isCollapsedOpen = !isCollapsedOpen"
      >
        <span class="truncate">{{ activeTitle }}</span>
        <FaChevronDown
          :class="[isCollapsedOpen ? 'rotate-180' : 'rotate-0', 'transition-transform']"
          size="12"
        />
      </button>
      <div v-show="isCollapsedOpen" class="px-2 pb-2">
        <button
          v-for="(tab, index) in props.items"
          :key="index"
          type="button"
          class="block w-full text-left px-3 py-2 rounded text-sm"
          :class="
            currentIndex === index
              ? 'bg-white/10 text-black dark:text-white'
              : 'text-gray-600 dark:text-dark-6 hover:text-black dark:hover:text-white'
          "
          @click="onMobileSelect(index)"
        >
          {{ tab.title }}
        </button>
      </div>
    </div>

    <!-- Desktop header -->
    <div class="hidden md:block border-b-3 border-gray-100 dark:border-dark-2">
      <div class="flex -mx-4">
        <div v-for="(tab, index) in props.items" :key="index" class="px-4">
          <button
            :class="{
              'text-black dark:text-white': currentIndex === index,
              'border-black dark:border-white': currentIndex === index && !tab.color,
              'text-gray-500 border-transparent hover:text-black dark:text-dark-6 dark:hover:text-white':
                currentIndex !== index,
            }"
            :style="currentIndex === index && tab.color ? { borderColor: tab.color } : undefined"
            class="-mb-[3px] w-full border-b-3 py-2 text-base font-medium cursor-pointer"
            type="button"
            @click="selectTab(index)"
          >
            {{ tab.title }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 text-base text-body-color dark:text-dark-6">
      <slot />
    </div>
  </div>
</template>

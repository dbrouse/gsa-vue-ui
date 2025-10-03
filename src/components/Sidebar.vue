<script setup lang="ts">
type NavItem = {
  label?: string
  value?: string
  onClick?: (value?: string, item?: NavItem) => void
}

const props = withDefaults(
  defineProps<{
    items: NavItem[]
    activeRoute?: string
    className?: string
  }>(),
  {
    activeRoute: '',
    className: '',
  }
)

const isActive = (val?: string) => props.activeRoute === (val ?? '')

const emit = defineEmits<{ (e: 'select', value: string, item?: NavItem): void }>()
const selectItem = (value: string, item?: NavItem) => emit('select', value, item)

const handleItemClick = (item: NavItem) => {
  const value = String(item.value ?? '')
  if (item.onClick) item.onClick(value, item)
  selectItem(value, item)
}
</script>

<template>
  <nav class="w-full py-9" :class="props.className">
    <ul class="flex flex-col gap-3">
      <li v-for="item in props.items" :key="(item.label || '') + String(item.value)">
        <a
          href="#"
          class="text-sm font-medium flex items-center px-6 py-1 border-l-5"
          :class="
            isActive(item.value)
              ? 'text-black border-black dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-black border-transparent dark:text-gray-400 dark:hover:text-white'
          "
          @click.prevent="handleItemClick(item)"
        >
          <span>{{ item.label ?? item.value }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ className?: string; dense?: boolean }>(), {
  className: '',
  dense: false,
})
</script>

<template>
  <div :class="['overflow-x-auto w-full', props.className]">
    <table
      class="w-full border-separate border-spacing-0 text-left text-sm text-dark dark:text-gray-200"
    >
      <slot />
    </table>
  </div>
</template>

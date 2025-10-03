<script setup lang="ts"></script>

<template>
  <thead class="top-0 z-10">
    <slot />
  </thead>
</template>

<style scoped>
/* Ensure header rows do not show hover background */
thead :deep(tr:hover) {
  background-color: transparent !important;
}
</style>

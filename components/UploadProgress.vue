<script setup lang="ts">
defineProps(['isVisible', 'progress'])
</script>

<template>
  <div class="max-w-5xl mx-auto my-20 transition-opacity duration-200" :class="isVisible ? 'opacity-0' : 'opacity-100'">
    <div class="h-2 flex bg-neutral-200 rounded-md overflow-hidden">
      <div class="h-2 bg-sky-500 dark:bg-blue-600 z-10" :style="`width: ${progress}%`"></div>
    </div>
  </div>
</template>

<style></style>

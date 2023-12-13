<script setup lang="ts">
defineProps(['isVisible'])
</script>

<template>
  <div class="absolute bg-slate-300 w-full h-full transition-opacity duration-200" :class="isVisible ? 'opacity-0' : 'opacity-100'"></div>
</template>

<style></style>

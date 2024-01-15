<script setup lang="ts">
const dragEl = ref<HTMLElement | null>(null)
const targetOverlay = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const { style } = useDrag(dragEl, { targetOverlay, container })
</script>

<template>
  <div class="fixed inset-0 grid place-items-center">
    <div ref="container" class="w-1/3 h-1/2 bg-slate-600 grid place-items-center">
      <div ref="dragEl" class="w-52 h-52 bg-sky-600 absolute" :style="style"></div>
      <!-- <div ref="targetOverlay" class="w-40 h-40 bg-black/25 shadow-hdrt absolute"></div> -->
    </div>
  </div>
</template>

<style>
.shadow-hdrt {
  box-shadow: rgba(47, 49, 54, 0.7) 0 0 0 9999px;
}
</style>

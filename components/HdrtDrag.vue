<script setup lang="ts">
const { src } = defineProps<{ src: string }>()
const panArea = ref<HTMLElement | null>(null)
const { preloadImageSource, imageStyle, panStyle, zoomValue, imageRect } = useDrag(panArea, src)
useHead({ htmlAttrs: { style: 'touch-action: none' } })
defineEmits(['on-confirm'])
</script>

<template>
  <div class="fixed inset-0 m-2">
    <div class="w-full h-80 sm:w-2/3 lg:w-1/3 lg:h-1/2 bg-slate-600 grid place-items-center relative overflow-hidden mx-auto">
      <img class="absolute select-none" @dragstart.prevent :src="preloadImageSource" :style="imageStyle" />
      <div ref="panArea" class="w-44 h-44 shadow-hdrt absolute" :style="panStyle"></div>
    </div>

    <div class="m-6 md:mx-10 lg:mx-14 text-center">
      <input
        type="range"
        min="1"
        v-model.number="zoomValue"
        max="1000"
        class="w-full h-2 mb-6 max-w-sm rounded-lg appearance-none bg-neutral-800/20 cursor-pointer bg-gradient-to-tr bg-no-repeat from-zinc-300 to-neutral-700 [&::-webkit-slider-thumb]:bg-stone-700"
      />
    </div>
    <div><button @click="$emit('on-confirm', { ...imageRect, crop: panArea?.clientWidth })">Отправить</button></div>
  </div>
</template>

<style>
.shadow-hdrt {
  box-shadow: rgba(47, 49, 54, 0.7) 0 0 0 9999px;
}

input[type='range'] {
  --slider-value: v-bind(zoomValue);
  background-size: calc(var(--slider-value) * 0.1%) 100%;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 22px;
  width: 18px;
  border-radius: 20%;
  cursor: ew-resize;
}
</style>

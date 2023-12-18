<script lang="ts" setup>
const props = defineProps<{
  src: string
}>()
defineEmits(['confirm'])
const rangeValue = ref(1)

const avatar = new DragZone()

onMounted(() => {
  avatar.init(props.src)
})
watch(rangeValue, () => avatar.onChangeZoom(rangeValue.value))
</script>

<template>
  <section class="fixed inset-0 grid place-items-center max-[450px]:mb-10 px-2">
    <div class="flex flex-col relative w-full md:w-2/3 lg:w-[600px] bg-stone-600">
      <div class="flex flex-col relative min-h-0 flex-auto rounded-sm p-4" avatar-container>
        <div
          class="relative flex justify-center items-center w-full overflow-hidden bg-black/50 min-h-[320px] md:h-[400px] lg:h-[450px]"
          avatar-wrap
        >
          <div class="shape opacity-0 border-[6px] rounded-full cursor-grab" avatar-borders></div>
        </div>
        <div class="my-4 mx-4 md:mx-10 lg:mx-14">
          <input
            id="medium-range"
            type="range"
            v-model.number="rangeValue"
            min="1"
            max="1000"
            class="w-full h-2 mb-6 rounded-lg appearance-none bg-neutral-800/20 cursor-pointer bg-gradient-to-tr bg-no-repeat from-zinc-300 to-neutral-700 [&::-webkit-slider-thumb]:bg-stone-700"
          />
        </div>
      </div>
      <button @click="$emit('confirm', avatar.imageProps)">Отправить</button>
    </div>
  </section>
</template>

<style scoped>
.shape {
  position: absolute;
  box-shadow: rgba(47, 49, 54, 0.7) 0 0 0 9999px;
}

input[type='range'] {
  --slider-value: v-bind(rangeValue);
  background-size: calc(var(--slider-value) * 0.1%) 100%;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 26px;
  width: 12px;
  border-radius: 20%;
  cursor: ew-resize;
}
</style>

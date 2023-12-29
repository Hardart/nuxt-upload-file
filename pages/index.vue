<script lang="ts" setup>
import { useScreenOrientation } from '@vueuse/core'

const { angle } = useScreenOrientation()

const { data } = await useFetch('/api/files', { query: { folder: 'photos' } })
if (!data.value) throw createError('No images')
const itemsState = ref<{ [key: number]: boolean }>({})

for (let i = 0; i < data.value.length / 2; i++) {
  itemsState.value[i] = false
}

function toggleItemState(i: number) {
  Object.keys(itemsState.value).forEach((key, index) => {
    itemsState.value[index] = i == index ? !itemsState.value[index] : itemsState.value[index]
  })
}
const mult = data.value?.length / 2

const isHorisontal = computed(() => angle)
</script>

<template>
  <div class="space-y-52 absolute">
    <div
      class="wrap h-screen flex justify-center items-center"
      :class="[itemsState[index] && 'rotat']"
      v-for="(imageSrc, index) in data?.slice(0, mult)"
      @dblclick="toggleItemState(index)"
    >
      <div class="wrap__container h-full">
        <img :src="imageSrc" class="object-contain h-full" alt="" loading="lazy" />
      </div>
      <div class="wrap_reverse">
        <img :src="data![index + mult]" loading="lazy" class="object-contain h-full" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap.rotat {
  transform: rotateY(-180deg);
}
.wrap {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

.wrap__container {
  position: relative;
  backface-visibility: hidden;
}

.wrap_reverse {
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
}
</style>

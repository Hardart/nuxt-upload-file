<script lang="ts" setup>
const { data } = await useFetch('/api/files')
if (!data.value) throw createError('')
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
</script>

<template>
  <div class="absolute">
    <div
      class="wrap grid place-items-center min-h-[800px]"
      :class="itemsState[index] && 'rotat'"
      v-for="(imageSrc, index) in data?.slice(0, mult)"
      @dblclick="toggleItemState(index)"
    >
      <div class="wrap__container">
        <img :src="imageSrc" class="object-cover max-h-[600px]" alt="" loading="lazy" />
      </div>
      <div class="wrap_reverse">
        <img :src="data![index + mult]" class="object-cover max-h-[600px]" loading="lazy" alt="" />
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
  height: 100%;
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

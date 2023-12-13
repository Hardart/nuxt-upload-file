<script setup lang="ts">
const props = defineProps(['src'])
const container = ref<HTMLElement>()
const imageEl = ref<HTMLImageElement>()

const onLoad = () => {
  if (!imageEl.value) return
  avatarData.el = imageEl.value
  container.value?.append(avatarData.el)
  avatarData.width = imageEl.value.width
  avatarData.height = imageEl.value.height
  setNewSizeToImage()
  setTransformToImage(0, delta('x'))
}

const avatarData = reactive({
  width: 0,
  height: 0,
  el: imageEl.value,
})

const containerData = reactive({
  width: 0,
  height: 0,
})

watch(
  () => props.src,
  () => {
    imageEl.value!.src = props.src
    imageEl.value!.onload = onLoad
  }
)

onMounted(() => {
  imageEl.value = new Image()
  const { width, height } = container.value!.getBoundingClientRect()
  containerData.width = width
  containerData.height = height
})

function setTransformToImage(x: number = 0, y: number = 0) {
  if (!imageEl.value) return
  imageEl.value.style.transform = `translate3d(${x}px, ${y}px, 0px)`
}

function setNewSizeToImage() {
  if (!imageEl.value) return
  // imageEl.value.style.width = `0px`
  imageEl.value.style.height = `${containerData.height}px`
}

const delta = (axis: 'x' | 'y') => (containerData[axis == 'x' ? 'width' : 'height'] - avatarData[axis == 'x' ? 'width' : 'height']) / 2
</script>

<template>
  <div class="mx-auto mt-20 relative w-96 h-96 bg-emerald-500 overflow-hidden rounded-full" ref="container"></div>
</template>

<style></style>

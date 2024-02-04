<script lang="ts" setup>
interface ITrackData {
  artistName: string
  trackTitle: string
  covers: {
    art30: string
    art60: string
    art100: string
  }
}
const { $ws } = useNuxtApp()
onMounted(initSocket)
const trackData = ref<ITrackData | null>()
function initSocket() {
  const socket = $ws('admin', '3068')
  socket.on('radio:track', (data: ITrackData) => (trackData.value = data))
}
</script>

<template>
  <div class="container my-32 mx-auto">
    <h1 class="text-7xl">Stream Page</h1>
    <div v-if="trackData">
      <h3>{{ trackData.artistName }}</h3>
      <img :src="trackData.covers?.art100" alt="" />
    </div>
  </div>
</template>

<style scoped></style>

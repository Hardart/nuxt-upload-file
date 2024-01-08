<script setup lang="ts">
const { data } = await useFetch('/api/files', { query: { folder: 'lol' } })
if (!data.value) throw createError('No images')
</script>

<template>
  <div>
    <img :src="src" v-for="src in data" alt="" />
  </div>
</template>

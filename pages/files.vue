<script lang="ts" setup>
const { data: images } = await useFetch('/api/files')
</script>

<template>
  <div>
    <ul>
      <li v-for="image in images"><img :src="image" alt="" /></li>
      <!-- <li><img src="~/assets/images/avatar.jpeg" alt="" /></li> -->
    </ul>
  </div>
</template>

<style scoped></style>

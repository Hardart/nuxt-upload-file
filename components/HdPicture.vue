<script setup lang="ts">
defineProps(['src', 'handler'])
</script>

<template>
  <picture>
    <!-- <source type="image/avif" srcset="/images/blog/default/blog_img_300.avif 372w, /images/blog/default/blog_img_600.avif 672w" />
    <source type="image/webp" srcset="/images/blog/default/blog_img_300.webp 372w, /images/blog/default/blog_img_600.webp 672w" /> -->
    <!-- <source
      type="image/webp"
      srcset="
        /images/blog/test/blog_img_300.webp   372w,
        /images/blog/test/blog_img_600.webp   672w,
        /images/blog/test/blog_img_730.webp   744w,
        /images/blog/test/blog_img_800.webp   972w,
        /images/blog/test/blog_img_960.webp  1272w,
        /images/blog/test/blog_img_1200.webp 1344w
      "
    /> -->
    <img fetchpriority="high" :src="src" class="object-cover h-full w-full" @load="handler" />
  </picture>
</template>

<style></style>

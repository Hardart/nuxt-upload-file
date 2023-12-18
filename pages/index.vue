<script lang="ts" setup>
const src = ref('')
const avatarSrc = ref('')
const uploadProgress = ref(0)
const isShowAvatarDrag = ref(false)
const form = ref<HTMLFormElement | null>(null)

const onSubmit = async () => {
  if (!form.value) return
  uploadForm('/api/upload', form.value)
  form.value.reset()
}

const onConfirm = async (props: object) => {
  if (!form.value) return

  avatarSrc.value = await $fetch('/api/crop-image', { body: { props, src: src.value }, method: 'POST' })
  isShowAvatarDrag.value = false
}

function uploadForm(url: string, formElement: HTMLFormElement) {
  const form = new FormData(formElement)
  const xhr = new XMLHttpRequest()
  xhr.open('post', url, true)
  xhr.upload.onprogress = function ({ total, loaded }) {
    // Upload progress here
    uploadProgress.value = Math.round((loaded / total) * 100)
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // Uploaded
      const fileName = xhr.response
      if (fileName.trim()) src.value = fileName
      isShowAvatarDrag.value = true
    }
  }
  xhr.send(form)
}
</script>

<template>
  <form @submit.prevent="onSubmit" ref="form">
    <input type="text" name="title" />
    <input type="file" name="image" />
    <button type="submit" class="">Отправить</button>
  </form>

  <HdrtDragzone :src="src" v-if="src && isShowAvatarDrag" @confirm="onConfirm" />
  <div class="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-rose-300">
    <img :src="avatarSrc" class="object-cover w-full" alt="" v-if="avatarSrc" />
    <div class="bg-rose-200 w-full h-full"></div>
  </div>
  <!-- <div class="mx-auto mt-32 relative w-[600px] h-[700px] overflow-hidden" v-if="uploadProgress">
    <UploadPlaceholder :is-visible="isFileLoad" />
    <LazyHdPicture :src="src" :handler="onLoad" v-if="src" />
  </div> -->
</template>

<style scoped></style>

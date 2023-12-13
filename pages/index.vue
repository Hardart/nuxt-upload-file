<script lang="ts" setup>
const src = ref<string>('')
const uploadProgress = ref(0)
const isFileLoad = ref(false)

const onSubmit = async (form: HTMLFormElement) => {
  if (!form) return
  uploadForm('/api/upload', form)
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
    }
  }
  xhr.send(form)
}
</script>

<template>
  <form @submit.prevent="onSubmit($event.target as HTMLFormElement)">
    <input type="text" name="title" />
    <input type="file" name="image" />
    <button type="submit" class="">Отправить</button>
  </form>

  <HdAvatar :src="src" />
  <!-- <div class="mx-auto mt-32 relative w-[600px] h-[700px] overflow-hidden" v-if="uploadProgress">
    <UploadPlaceholder :is-visible="isFileLoad" />
    <LazyHdPicture :src="src" :handler="onLoad" v-if="src" />
  </div> -->
</template>

<style scoped></style>

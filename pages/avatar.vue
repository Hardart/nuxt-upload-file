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

const onChange = async () => {
  if (!form.value) return
  uploadForm('/api/upload', form.value)
  form.value.reset()
}

const onConfirm = async (props: object) => {
  if (!form.value) return
  const { data, error } = await $fetch('/api/crop-image', { body: { props, src: src.value }, method: 'POST' })
  avatarSrc.value = data!
  isShowAvatarDrag.value = false
}

function uploadForm(url: string, formElement: MaybeRef<HTMLFormElement>) {
  formElement = toValue(formElement)
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
      const { data, error } = JSON.parse(xhr.response)
      if (error) return console.error(error)

      if (data.trim()) src.value = data
      isShowAvatarDrag.value = true
    }
  }

  xhr.send(form)
}
</script>

<template>
  <form @submit.prevent="onSubmit" ref="form" v-if="!avatarSrc">
    <!-- <input type="text" name="title" /> -->
    <div class="inline-block p-2">
      <label
        for="image"
        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
      >
        <span>Upload a file</span>
        <input id="image" name="image" type="file" class="sr-only" @change="onChange" />
      </label>
    </div>
  </form>

  <HdrtDrag :src="src" v-if="src && isShowAvatarDrag" @on-confirm="onConfirm" />
  <div class="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-rose-300" v-if="avatarSrc">
    <img :src="avatarSrc" class="object-cover w-full" alt="" />
    <div class="bg-rose-200 w-full h-full"></div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { io, type Socket } from 'socket.io-client'

const { $ws } = useNuxtApp()

const socket = ref<Socket | null>(null)
const msg = ref('')
const msgList = ref<HTMLUListElement | undefined>(undefined)
const isConnect = ref(false)

const initSocket = () => {
  socket.value = $ws()
  socket.value.on('connect', () => (isConnect.value = true))
  socket.value.on('message:add', mesg => addMessageToList(mesg))
}

const createMsgElem = (mesg: string) => `<li>${mesg}</li>`
const addMessageToList = (mesg: string) => {
  msgList.value?.insertAdjacentHTML('beforeend', createMsgElem(mesg))
}
const onSend = () => {
  const io = socket.value
  io?.emit('message:user', msg.value)
  msg.value = ''
}
</script>

<template>
  <div>
    <h1 v-if="isConnect">Connect</h1>
    <input class="h-10 py-2 px-5 rounded-xl mt-10 w-1/2 bg-neutral-200" type="text" v-model.trim="msg" />
  </div>
  <ul ref="msgList"></ul>
  <button :disabled="msg === ''" @click="onSend">Send</button>
  <button @click="initSocket">Connect</button>
</template>

<style></style>

<script setup lang="ts">
interface IMessage {
  text: string
  sender: string
}
import { type Socket } from 'socket.io-client'
import { useSessionStorage } from '@vueuse/core'
const { $ws } = useNuxtApp()

const userId = useSessionStorage('socketId', null)

const socket = ref<Socket | null>(null)
const msg = ref('')
const messages = ref<IMessage[]>([])
const isConnect = ref(false)
const messageList = ref<HTMLUListElement | undefined>(undefined)

const initSocket = async () => {
  socket.value = $ws(userId.value)
  socket.value.on('connect', () => (isConnect.value = true))
  socket.value.on('user_id', id => {
    useSessionStorage('socketId', id)
    userId.value = id
  })

  socket.value.on('message:list', async list => {
    await delay(500)
    messages.value = list || []
    scrollToBottom()
  })

  socket.value.on('message:recive', mesg => {
    messages.value.push(mesg)
    scrollToBottom()
  })
}

const onSend = () => {
  const io = socket.value!
  io.emit('message:send', msg.value)
  console.log(messages.value)
  messages.value.push({ text: msg.value, sender: userId.value! })
  msg.value = ''
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' })
  }, 0)
}
</script>

<template>
  <div>
    <h1 v-if="isConnect">Connect</h1>
  </div>
  <!-- <ul class="w-1/2 mx-auto space-y-2">
    <li v-for="message in messages" class="px-3 py-1 bg-neutral-100" :class="message.sender == userId && 'text-right'">
      {{ message.text }}
    </li>
  </ul>
  <div class="flex gap-4 mt-6">
    <button class="px-4 py-2 bg-indigo-500 text-white" :disabled="msg === ''" @click="onSend">Send</button>
    <button class="px-4 py-2 bg-indigo-500 text-white" @click="initSocket">Connect</button>
    <button class="px-4 py-2 bg-indigo-500 text-white" @click="onGetMessagesList">List</button>
  </div> -->
  <div
    @click="initSocket()"
    class="fixed rounded-full z-[9999] transition-all duration-500 shadow-lg"
    :class="isConnect ? 'bottom-[510px] right-[310px] w-8 h-8 bg-sky-300' : 'bottom-2 right-2 w-20 h-20 cursor-pointer bg-indigo-400'"
  ></div>
  <div
    class="fixed flex flex-col bg-neutral-200 bottom-8 right-8 rounded-xl overflow-clip transition-all duration-500"
    :class="isConnect ? 'h-[500px] w-[300px]' : 'h-0 w-0'"
  >
    <div class="w-full h-12 bg-sky-800"></div>
    <div class="flex-grow relative">
      <ul class="absolute inset-0 overflow-y-scroll py-3 space-y-2" ref="messageList">
        <li v-for="message in messages" class="px-3" :class="message.sender == userId && 'text-right'">
          <p
            class="inline text-white px-3 pt-1 pb-1.5 rounded-xl text-sm"
            :class="message.sender == userId ? 'bg-green-600' : 'bg-sky-600'"
          >
            {{ message.text }}
          </p>
        </li>
      </ul>
    </div>
    <div class="flex px-3 py-3 h-12 space-x-1.5 bg-sky-900">
      <input class="px-2 w-full rounded-lg text-sm bg-neutral-200" type="text" v-model.trim="msg" />
      <button class="bg-emerald-700 text-white w-8 rounded-lg flex justify-center items-center" @click="onSend">S</button>
    </div>
  </div>
</template>

<style></style>

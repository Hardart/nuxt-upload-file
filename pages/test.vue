<script setup lang="ts">
interface IMessage {
  text: string
  sender: string
  roomToken: string
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
    console.log(list)
    await delay(500)
    messages.value = list || []
    scrollToBottom()
  })

  socket.value.on('message:recive', mesg => {
    console.log('recive')
    messages.value.push(mesg)
    scrollToBottom()
  })

  socket.value.on('admin:connected', mesg => {
    console.log('connect')
  })
}

const onSend = () => {
  const io = socket.value!
  const message = {
    text: msg.value,
    sender: userId.value!,
    roomToken: userId.value!,
  }
  io.emit('message:send', message)

  messages.value.push(message)
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

  <div
    @click="initSocket()"
    class="fixed rounded-full z-[9999] transition-all duration-500 shadow-lg"
    :class="isConnect ? 'bottom-[510px] right-[310px] w-8 h-8 bg-sky-300' : 'bottom-2 right-2 w-20 h-20 cursor-pointer bg-indigo-400'"
  ></div>
  <div class="fixed flex flex-col bg-neutral-200 bottom-8 right-8 rounded-xl overflow-clip transition-all duration-500" :class="isConnect ? 'h-[500px] w-[300px]' : 'h-0 w-0'">
    <ClientOnly>
      <div class="w-full h-12 text-white bg-sky-800 grid place-items-center" v-if="userId">{{ userId }}</div>
    </ClientOnly>
    <!-- MESSEAGES LIST -->
    <div class="flex-grow relative">
      <ul class="absolute inset-0 overflow-y-scroll py-3 space-y-2" ref="messageList">
        <li v-for="message in messages" class="px-3" :class="message.sender == userId && 'text-right'">
          <p class="inline text-white px-3 pt-1 pb-1.5 rounded-xl text-sm" :class="message.sender == userId ? 'bg-green-600' : 'bg-sky-600'">
            {{ message.text }}
          </p>
        </li>
      </ul>
    </div>
    <!-- MESSEAGES LIST END -->
    <div class="flex px-3 py-3 h-12 space-x-1.5 bg-sky-900">
      <input class="px-2 w-full rounded-lg text-sm bg-neutral-200" type="text" v-model.trim="msg" />
      <button class="bg-emerald-700 text-white w-8 rounded-lg flex justify-center items-center" @click="onSend">S</button>
    </div>
  </div>
</template>

<style></style>

<script setup lang="ts">
const { init, isConnect, userToken, messages, message, messageList, onSendMessage } = useIO()
const { $ws } = useNuxtApp()
</script>

<template>
  <div
    @click="init($ws)"
    class="fixed rounded-full z-[9999] transition-all duration-500 shadow-lg"
    :class="isConnect ? 'bottom-[510px] right-[310px] w-8 h-8 bg-sky-300' : 'bottom-2 right-2 w-20 h-20 cursor-pointer bg-indigo-400'"
  ></div>
  <div
    class="fixed flex flex-col bg-neutral-200 bottom-8 right-8 rounded-xl overflow-clip transition-all duration-500"
    :class="isConnect ? 'h-[500px] w-[300px]' : 'h-0 w-0'"
  >
    <ClientOnly>
      <div class="w-full h-12 text-white bg-sky-800 grid place-items-center" v-if="userToken">{{ userToken }}</div>
    </ClientOnly>
    <!-- MESSEAGES LIST -->
    <div class="flex-grow relative">
      <ul class="absolute inset-0 overflow-y-auto py-3 space-y-2" ref="messageList">
        <li v-for="message in messages" class="flex items-center space-x-2 px-3" :class="message.sender == userToken && 'justify-end'">
          <p
            class="inline text-white px-3 pt-1 pb-1.5 rounded-xl text-sm"
            :class="message.sender == userToken ? 'bg-green-600' : 'bg-sky-600'"
          >
            {{ message.text }}
          </p>
          <p class="text-[10px] font-extralight text-neutral-600/80">
            {{ new Date(message.createdAt).toLocaleTimeString('ru', { timeStyle: 'short' }) }}
          </p>
        </li>
      </ul>
    </div>
    <!-- MESSEAGES LIST END -->
    <div class="flex px-3 py-3 h-12 space-x-1.5 bg-sky-900">
      <input class="px-2 w-full rounded-lg text-sm bg-neutral-200" type="text" v-model.trim="message" @keyup.enter="onSendMessage" />
      <button class="bg-emerald-700 text-white w-8 rounded-lg flex justify-center items-center" @click="onSendMessage">S</button>
    </div>
  </div>
</template>

<style></style>

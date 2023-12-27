import type { Socket } from 'socket.io-client'
import { useSessionStorage } from '@vueuse/core'
interface IMessage {
  text: string
  sender: string
  roomToken: string
  createdAt: string | number
}

export const useIO = () => {
  const socket = ref<Socket>()
  const messages = ref<IMessage[]>([])
  const message = ref('')
  const isConnect = ref(false)
  const messageList = ref<HTMLUListElement | undefined>(undefined)
  const userToken = useSessionStorage<string>('socketId', null)

  async function onMessageList(list: IMessage[]) {
    await delay(500)
    messages.value = list
    scrollToBottom()
  }

  function onRecive(msg: IMessage) {
    msg.createdAt = Date.now()
    messages.value.push(msg)
    scrollToBottom()
  }

  function onSendMessage() {
    if (!message.value || !socket.value) return
    const msg = createMessage()
    socket.value.emit('message:send', msg)
    messages.value.push(msg)
    message.value = ''
    scrollToBottom()
  }

  function createMessage(): IMessage {
    return { text: message.value, sender: userToken.value, roomToken: userToken.value, createdAt: Date.now() }
  }

  function onGetId(id: string) {
    useSessionStorage('socketId', id)
    userToken.value = id
  }

  function onConnect() {
    isConnect.value = true
  }

  async function init($ws: any) {
    socket.value = $ws(userToken.value)
    if (!socket.value) return
    const sock = socket.value

    sock.on('connect', onConnect)
    sock.on('user_id', onGetId)
    sock.on('message:list', onMessageList)
    sock.on('message:recive', onRecive)
  }

  function scrollToBottom() {
    setTimeout(() => {
      messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' })
    }, 0)
  }

  return { messages, message, isConnect, userToken, messageList, onMessageList, onRecive, onSendMessage, init }
}

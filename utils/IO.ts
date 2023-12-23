import type { Socket } from 'socket.io-client'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'

class IO {
  $io: Socket<DefaultEventsMap, DefaultEventsMap> | null = null
  private clientMsg: string = ''

  init(io: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.$io = io
  }

  messageFrom = (msg: string) => {
    if (this.$io === null) return
    this.$io.emit('message:from', msg)
  }

  messageTo = (msg: string) => {
    if (this.$io === null) return
    this.clientMsg = msg
  }

  get clientMessage() {
    if (this.$io === null) return
    this.$io.on('message:to', msg => (this.clientMsg = msg))
    console.log(this.clientMsg)
    return this.clientMsg
  }
}

export default new IO()

import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
  if (!process.client) return

  const url = 'http://127.0.0.1:3069'

  if (!url || typeof url !== 'string') return

  return {
    provide: {
      ws: (token: string | null) => io(url, { auth: { token } }),
    },
  }
})
